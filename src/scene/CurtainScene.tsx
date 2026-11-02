import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useStudio, type FabricId } from '../store'

const fabricProfiles: Record<FabricId, {
  color: string; roughness: number; opacity: number; sheen: number; weight: number; wind: number; fold: number
}> = {
  sheer: { color: '#eee9dd', roughness: 0.48, opacity: 0.42, sheen: 0.32, weight: 0.45, wind: 1.55, fold: 0.045 },
  linen: { color: '#c9beaa', roughness: 0.94, opacity: 1, sheen: 0.08, weight: 1, wind: 1, fold: 0.085 },
  velvet: { color: '#625b50', roughness: 0.98, opacity: 1, sheen: 0.88, weight: 1.65, wind: 0.58, fold: 0.13 },
  blackout: { color: '#858176', roughness: 0.99, opacity: 1, sheen: 0.04, weight: 1.9, wind: 0.42, fold: 0.105 },
}

type Constraint = { a: number; b: number; length: number; stiffness: number }
type ClothState = {
  positions: Float32Array
  previous: Float32Array
  initial: Float32Array
  constraints: Constraint[]
  dragIndex: number
  dragTarget: THREE.Vector3
  lastTarget: THREE.Vector3
  dragging: boolean
}

const SEG_X = 34
const SEG_Y = 44
const WIDTH = 2.34
const HEIGHT = 4.05
const indexOf = (x: number, y: number) => y * (SEG_X + 1) + x

function createCloth(): ClothState {
  const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, SEG_X, SEG_Y)
  const source = geometry.attributes.position.array as Float32Array
  const initial = new Float32Array(source.length)
  const positions = new Float32Array(source.length)
  const previous = new Float32Array(source.length)
  const constraints: Constraint[] = []
  for (let y = 0; y <= SEG_Y; y++) {
    for (let x = 0; x <= SEG_X; x++) {
      const i = indexOf(x, y) * 3
      const u = x / SEG_X
      const pleat = Math.sin(u * Math.PI * 13) * 0.065
      initial[i] = source[i]
      initial[i + 1] = source[i + 1]
      initial[i + 2] = Math.cos(u * Math.PI * 13) * 0.085 + pleat
    }
  }
  positions.set(initial)
  previous.set(initial)
  const add = (x1: number, y1: number, x2: number, y2: number, stiffness: number) => {
    const a = indexOf(x1, y1)
    const b = indexOf(x2, y2)
    const ai = a * 3
    const bi = b * 3
    const dx = initial[ai] - initial[bi]
    const dy = initial[ai + 1] - initial[bi + 1]
    const dz = initial[ai + 2] - initial[bi + 2]
    constraints.push({ a, b, length: Math.sqrt(dx * dx + dy * dy + dz * dz), stiffness })
  }
  for (let y = 0; y <= SEG_Y; y++) {
    for (let x = 0; x <= SEG_X; x++) {
      if (x < SEG_X) add(x, y, x + 1, y, 0.92)
      if (y < SEG_Y) add(x, y, x, y + 1, 0.92)
      if (x < SEG_X && y < SEG_Y) {
        add(x, y, x + 1, y + 1, 0.42)
        add(x + 1, y, x, y + 1, 0.42)
      }
      if (x < SEG_X - 1) add(x, y, x + 2, y, 0.16)
      if (y < SEG_Y - 1) add(x, y, x, y + 2, 0.16)
    }
  }
  geometry.dispose()
  return {
    positions, previous, initial, constraints,
    dragIndex: -1,
    dragTarget: new THREE.Vector3(),
    lastTarget: new THREE.Vector3(),
    dragging: false,
  }
}

function CurtainPanel({ side }: { side: 'left' | 'right' }) {
  const mesh = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.BufferGeometry(), [])
  const cloth = useMemo(createCloth, [])
  const fabric = useStudio((s) => s.fabric)
  const wind = useStudio((s) => s.wind)
  const opening = useStudio((s) => s.opening)
  const profile = fabricProfiles[fabric]
  const sideSign = side === 'left' ? -1 : 1

  useMemo(() => {
    geometry.setAttribute('position', new THREE.BufferAttribute(cloth.positions, 3))
    const indices: number[] = []
    for (let y = 0; y < SEG_Y; y++) {
      for (let x = 0; x < SEG_X; x++) {
        const a = indexOf(x, y)
        const b = indexOf(x + 1, y)
        const c = indexOf(x, y + 1)
        const d = indexOf(x + 1, y + 1)
        indices.push(a, c, b, b, c, d)
      }
    }
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
  }, [geometry, cloth])

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return
    const dt = Math.min(delta, 1 / 30)
    const time = clock.elapsedTime
    const { positions, previous, initial, constraints } = cloth
    const windPower = [0, 0.22, 0.52, 0.95][wind] * profile.wind
    const damping = cloth.dragging ? 0.986 : 0.992

    for (let y = 0; y <= SEG_Y; y++) {
      for (let x = 0; x <= SEG_X; x++) {
        const n = indexOf(x, y)
        const i = n * 3
        if (y === 0) {
          positions[i] = initial[i]
          positions[i + 1] = initial[i + 1]
          positions[i + 2] = initial[i + 2]
          previous[i] = positions[i]
          previous[i + 1] = positions[i + 1]
          previous[i + 2] = positions[i + 2]
          continue
        }
        const u = x / SEG_X
        const v = y / SEG_Y
        const vx = (positions[i] - previous[i]) * damping
        const vy = (positions[i + 1] - previous[i + 1]) * damping
        const vz = (positions[i + 2] - previous[i + 2]) * damping
        previous[i] = positions[i]
        previous[i + 1] = positions[i + 1]
        previous[i + 2] = positions[i + 2]
        const gust = Math.sin(time * 1.4 + u * 6.4 + v * 2.2) * windPower * (0.15 + v * 0.85)
        const ripple = Math.sin(time * 2.1 + u * 16) * windPower * 0.11 * v
        positions[i] += vx + gust * dt * dt * 5
        positions[i + 1] += vy - 1.15 * profile.weight * dt * dt
        positions[i + 2] += vz + (gust + ripple) * dt * dt * 8
      }
    }

    if (cloth.dragging && cloth.dragIndex >= 0) {
      const gx = cloth.dragIndex % (SEG_X + 1)
      const gy = Math.floor(cloth.dragIndex / (SEG_X + 1))
      const radius = 5
      for (let oy = -radius; oy <= radius; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          const x = gx + ox
          const y = gy + oy
          if (x < 0 || x > SEG_X || y <= 0 || y > SEG_Y) continue
          const distance = Math.sqrt(ox * ox + oy * oy)
          if (distance > radius) continue
          const n = indexOf(x, y)
          const i = n * 3
          const weight = Math.pow(1 - distance / (radius + 0.5), 2)
          const follow = 0.2 * weight
          positions[i] += (cloth.dragTarget.x - positions[i]) * follow
          positions[i + 1] += (cloth.dragTarget.y - positions[i + 1]) * follow
          positions[i + 2] += (cloth.dragTarget.z - positions[i + 2]) * follow
        }
      }
    }

    for (let pass = 0; pass < 4; pass++) {
      for (const c of constraints) {
        const ai = c.a * 3
        const bi = c.b * 3
        const dx = positions[bi] - positions[ai]
        const dy = positions[bi + 1] - positions[ai + 1]
        const dz = positions[bi + 2] - positions[ai + 2]
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001
        const correction = ((length - c.length) / length) * c.stiffness
        const aPinned = Math.floor(c.a / (SEG_X + 1)) === 0
        const bPinned = Math.floor(c.b / (SEG_X + 1)) === 0
        if (!aPinned && !bPinned) {
          positions[ai] += dx * correction * 0.5
          positions[ai + 1] += dy * correction * 0.5
          positions[ai + 2] += dz * correction * 0.5
          positions[bi] -= dx * correction * 0.5
          positions[bi + 1] -= dy * correction * 0.5
          positions[bi + 2] -= dz * correction * 0.5
        } else if (aPinned && !bPinned) {
          positions[bi] -= dx * correction
          positions[bi + 1] -= dy * correction
          positions[bi + 2] -= dz * correction
        } else if (!aPinned && bPinned) {
          positions[ai] += dx * correction
          positions[ai + 1] += dy * correction
          positions[ai + 2] += dz * correction
        }
      }
      for (let x = 0; x <= SEG_X; x++) {
        const i = indexOf(x, 0) * 3
        positions[i] = initial[i]
        positions[i + 1] = initial[i + 1]
        positions[i + 2] = initial[i + 2]
      }
    }
    const attribute = geometry.attributes.position as THREE.BufferAttribute
    attribute.needsUpdate = true
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()
    mesh.current.position.set(sideSign * (1.16 + opening * 1.25), 2.38, -1.78)
  })

  const onPointerDown = (event: any) => {
    event.stopPropagation()
    if (!mesh.current || !event.uv) return
    const x = Math.round(THREE.MathUtils.clamp(event.uv.x, 0, 1) * SEG_X)
    const y = Math.round((1 - THREE.MathUtils.clamp(event.uv.y, 0, 1)) * SEG_Y)
    cloth.dragIndex = indexOf(x, y)
    cloth.dragging = true
    const local = mesh.current.worldToLocal(event.point.clone())
    cloth.dragTarget.copy(local)
    cloth.lastTarget.copy(local)
    event.target.setPointerCapture?.(event.pointerId)
    document.body.style.cursor = 'grabbing'
  }
  const onPointerMove = (event: any) => {
    if (!cloth.dragging || !mesh.current) return
    event.stopPropagation()
    const local = mesh.current.worldToLocal(event.point.clone())
    cloth.lastTarget.copy(cloth.dragTarget)
    cloth.dragTarget.lerp(local, 0.72)
    cloth.dragTarget.z += 0.08
  }
  const onPointerUp = (event: any) => {
    if (!cloth.dragging) return
    event.stopPropagation()
    cloth.dragging = false
    cloth.dragIndex = -1
    document.body.style.cursor = ''
  }

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      castShadow
      receiveShadow
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerOut={onPointerUp}
    >
      <meshPhysicalMaterial
        color={profile.color}
        roughness={profile.roughness}
        metalness={0}
        side={THREE.DoubleSide}
        transparent={profile.opacity < 1}
        opacity={profile.opacity}
        depthWrite={profile.opacity > 0.9}
        sheen={profile.sheen}
        sheenRoughness={0.86}
        transmission={fabric === 'sheer' ? 0.12 : 0}
        thickness={fabric === 'velvet' || fabric === 'blackout' ? 0.16 : 0.025}
      />
    </mesh>
  )
}


function makeHill(points: Array<[number, number]>, color: string) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1])
  shape.lineTo(points[points.length - 1][0], -1)
  shape.lineTo(points[0][0], -1)
  shape.closePath()
  return <mesh position={[0, 0, 0]}><shapeGeometry args={[shape]} /><meshBasicMaterial color={color} /></mesh>
}

function FloatingCloud({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const cloud = useRef<THREE.Group>(null)
  useFrame(({ clock }, delta) => {
    if (!cloud.current) return
    cloud.current.position.x += delta * speed
    if (cloud.current.position.x > 3.4) cloud.current.position.x = -3.4
    cloud.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.35 + position[0]) * 0.035
  })
  return <group ref={cloud} position={position} scale={scale}>
    <mesh position={[-0.22, 0, 0]}><sphereGeometry args={[0.23, 14, 10]} /><meshBasicMaterial color="#fff5dc" /></mesh>
    <mesh position={[0.02, 0.08, 0]}><sphereGeometry args={[0.3, 14, 10]} /><meshBasicMaterial color="#fff9e9" /></mesh>
    <mesh position={[0.28, -0.015, 0]}><sphereGeometry args={[0.2, 14, 10]} /><meshBasicMaterial color="#fff2d7" /></mesh>
  </group>
}

function OutdoorGarden() {
  const sun = useRef<THREE.Mesh>(null)
  const birds = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (sun.current) sun.current.rotation.z = Math.sin(t * 0.15) * 0.04
    if (birds.current) {
      birds.current.position.x = Math.sin(t * 0.22) * 0.42
      birds.current.position.y = 3.12 + Math.sin(t * 1.8) * 0.07
    }
  })
  return <group position={[0, 0, -2.385]}>
    <mesh ref={sun} position={[1.72, 3.55, 0.015]}><circleGeometry args={[0.34, 32]} /><meshBasicMaterial color="#f8d58a" /></mesh>
    <FloatingCloud position={[-1.7, 3.75, 0.02]} scale={1.05} speed={0.035} />
    <FloatingCloud position={[0.25, 4.02, 0.025]} scale={0.72} speed={0.025} />
    {makeHill([[-2.65, 1.12], [-2.1, 1.65], [-1.45, 1.8], [-0.7, 1.52], [0.05, 1.73], [0.82, 1.38], [1.55, 1.6], [2.65, 1.15]], '#8ea77a')}
    {makeHill([[-2.65, 0.76], [-1.8, 1.15], [-1.05, 1.02], [-0.2, 1.28], [0.7, 0.92], [1.5, 1.18], [2.65, 0.82]], '#668c68')}
    {makeHill([[-2.65, 0.35], [-1.9, 0.65], [-1.1, 0.52], [-0.25, 0.72], [0.65, 0.48], [1.55, 0.68], [2.65, 0.4]], '#a6b77e')}
    {[-2.25, -1.95, 1.98, 2.28].map((x, i) => <group key={x} position={[x, 0.85 + (i % 2) * 0.18, -0.02]}>
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.055, 0.075, 0.86, 7]} /><meshBasicMaterial color="#80664b" /></mesh>
      <mesh position={[0, 1.03, 0]} scale={[1.05, 1.12, 0.5]}><sphereGeometry args={[0.48, 14, 10]} /><meshBasicMaterial color={i % 2 ? '#52785a' : '#6f9365'} /></mesh>
      <mesh position={[-0.18, 1.23, 0.012]} scale={[0.55, 0.72, 0.5]}><sphereGeometry args={[0.36, 12, 9]} /><meshBasicMaterial color="#86a16e" /></mesh>
    </group>)}
    <group ref={birds} position={[0, 3.12, 0.04]}>
      {[0, 1, 2].map((n) => <group key={n} position={[n * 0.16, n * 0.1, 0]}>
        <mesh rotation={[0, 0, 0.38]} position={[-0.055, 0, 0]}><planeGeometry args={[0.13, 0.035]} /><meshBasicMaterial color="#526b59" side={THREE.DoubleSide} /></mesh>
        <mesh rotation={[0, 0, -0.38]} position={[0.055, 0, 0]}><planeGeometry args={[0.13, 0.035]} /><meshBasicMaterial color="#526b59" side={THREE.DoubleSide} /></mesh>
      </group>)}
    </group>
    {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-2.25 + (i % 9) * 0.55, 0.55 + Math.sin(i * 1.7) * 0.13, 0.045]}>
      <circleGeometry args={[0.025 + (i % 3) * 0.008, 8]} /><meshBasicMaterial color={i % 3 === 0 ? '#f5e8bb' : i % 3 === 1 ? '#e9c3a9' : '#f6f0d8'} />
    </mesh>)}
  </group>
}

function WindowWall() {
  const hour = useStudio((s) => s.hour)
  const night = hour >= 19 || hour < 7
  const daylight = THREE.MathUtils.clamp(1 - Math.abs(hour - 13) / 10, 0.08, 1)
  const sky = night ? '#293b4c' : hour < 10 ? '#e6c9a4' : hour > 17 ? '#d99b72' : '#a9c6c7'
  return (
    <group>
      <mesh position={[0, 2.45, -2.65]} receiveShadow>
        <boxGeometry args={[11.8, 6.2, 0.24]} />
        <meshStandardMaterial color="#e8e3d9" roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.42, -2.49]}>
        <boxGeometry args={[5.42, 4.58, 0.08]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.42, -2.435]}>
        <boxGeometry args={[5.13, 4.28, 0.018]} />
        <meshBasicMaterial color={sky} />
      </mesh>
      <OutdoorGarden />
      <mesh position={[0, 2.42, -2.41]}>
        <boxGeometry args={[0.055, 4.3, 0.08]} />
        <meshStandardMaterial color="#f5f1e8" roughness={0.28} />
      </mesh>
      {[-1.72, 1.72].map((x) => (
        <mesh key={x} position={[x, 2.42, -2.405]}>
          <boxGeometry args={[0.045, 4.28, 0.08]} />
          <meshStandardMaterial color="#f5f1e8" roughness={0.28} />
        </mesh>
      ))}
      <mesh position={[0, 0.28, -2.36]}>
        <boxGeometry args={[5.52, 0.12, 0.28]} />
        <meshStandardMaterial color="#d0c8b9" roughness={0.42} />
      </mesh>
      <mesh position={[0, 4.72, -2.36]}>
        <boxGeometry args={[5.62, 0.14, 0.3]} />
        <meshStandardMaterial color="#f5f1e8" roughness={0.28} />
      </mesh>
      <mesh position={[0, 2.48, -2.39]}>
        <boxGeometry args={[5.45, 0.055, 0.1]} />
        <meshStandardMaterial color="#f5f1e8" roughness={0.28} />
      </mesh>
      <mesh position={[0, 4.83, -1.7]}>
        <cylinderGeometry args={[0.035, 0.035, 5.95, 24]} />
        <meshStandardMaterial color="#a18e6b" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color="#b9aa93" roughness={0.82} />
      </mesh>
      <mesh position={[0, 5.6, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.94} />
      </mesh>
      <group position={[0, 0.15, -3.3]}>
        {[-3.5, -2.5, 2.6, 3.6].map((x, i) => (
          <group key={x} position={[x, 0, -0.1 - (i % 2) * 0.25]}>
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.09, 0.13, 1.6, 8]} />
              <meshStandardMaterial color="#6e6856" roughness={1} />
            </mesh>
            <mesh position={[0, 1.9, 0]}>
              <sphereGeometry args={[0.78 + (i % 2) * 0.12, 16, 12]} />
              <meshStandardMaterial color={night ? '#30443b' : '#75866b'} roughness={1} />
            </mesh>
          </group>
        ))}
      </group>
      <ambientLight intensity={night ? 0.34 : 0.48 + daylight * 0.42} />
      <directionalLight
        position={[-3.5 + (hour - 12) * 0.24, 5.8, 2.4]}
        intensity={night ? 0.18 : 0.55 + daylight * 1.55}
        color={night ? '#9bb7d1' : hour > 17 ? '#ffd0a1' : '#fff2d8'}
        castShadow
      />
      <pointLight position={[0, 3.4, 0.2]} intensity={night ? 1.7 : 0.08} color="#f8dcb4" distance={8} />
      <pointLight position={[-3, 2, -1.5]} intensity={night ? 0.35 : 0.08} color="#f7e6c9" distance={5} />
    </group>
  )
}


function ForestSpirit() {
  const spirit = useRef<THREE.Group>(null)
  const jumpVelocity = useRef(0)
  const jumpHeight = useRef(0)
  useFrame(({ clock }, delta) => {
    if (!spirit.current) return
    const dt = Math.min(delta, 0.04)
    jumpVelocity.current -= 5.8 * dt
    jumpHeight.current = Math.max(0, jumpHeight.current + jumpVelocity.current * dt)
    if (jumpHeight.current === 0) jumpVelocity.current = 0
    spirit.current.position.y = 0.38 + jumpHeight.current + Math.sin(clock.elapsedTime * 2.1) * 0.025
    spirit.current.rotation.z = Math.sin(clock.elapsedTime * 0.72) * 0.025
    spirit.current.rotation.y = Math.sin(clock.elapsedTime * 0.42) * 0.06
  })
  const hop = (event: any) => {
    event.stopPropagation()
    jumpVelocity.current = 2.5
  }
  return <group ref={spirit} position={[2.52, 0.38, -1.12]} scale={0.78} onClick={hop}>
    <mesh position={[0, 0.68, 0]} castShadow><sphereGeometry args={[0.58, 24, 18]} /><meshStandardMaterial color="#8d9289" roughness={0.96} /></mesh>
    <mesh position={[-0.34, 1.22, 0.015]} rotation={[0, 0, 0.16]}><coneGeometry args={[0.14, 0.48, 9]} /><meshStandardMaterial color="#858b82" roughness={0.95} /></mesh>
    <mesh position={[0.34, 1.22, 0.015]} rotation={[0, 0, -0.16]}><coneGeometry args={[0.14, 0.48, 9]} /><meshStandardMaterial color="#858b82" roughness={0.95} /></mesh>
    <mesh position={[0, 0.48, 0.43]} scale={[0.68, 0.7, 0.23]}><sphereGeometry args={[0.48, 20, 16]} /><meshStandardMaterial color="#e7e2d2" roughness={1} /></mesh>
    {[-0.2, 0.2].map((x) => <group key={x} position={[x, 0.91, 0.51]}>
      <mesh><sphereGeometry args={[0.085, 14, 12]} /><meshStandardMaterial color="#fffdf2" /></mesh>
      <mesh position={[0, 0, 0.07]}><sphereGeometry args={[0.04, 12, 10]} /><meshBasicMaterial color="#27352e" /></mesh>
    </group>)}
    <mesh position={[0, 0.77, 0.57]}><sphereGeometry args={[0.055, 12, 10]} /><meshStandardMaterial color="#4b5148" /></mesh>
    {[-0.14, 0, 0.14].map((x, i) => <mesh key={x} position={[x, 0.52 + (i === 1 ? 0.07 : 0), 0.57]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.045, 0.11, 3]} /><meshStandardMaterial color="#858b82" /></mesh>)}
    <mesh position={[-0.48, 0.43, 0.08]}><sphereGeometry args={[0.17, 14, 10]} /><meshStandardMaterial color="#858b82" /></mesh>
    <mesh position={[0.48, 0.43, 0.08]}><sphereGeometry args={[0.17, 14, 10]} /><meshStandardMaterial color="#858b82" /></mesh>
    <mesh position={[-0.25, 0.08, 0.08]} scale={[0.24, 0.14, 0.27]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#777e75" /></mesh>
    <mesh position={[0.25, 0.08, 0.08]} scale={[0.24, 0.14, 0.27]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#777e75" /></mesh>
    <mesh position={[0, 1.49, 0.03]} rotation={[0, 0, -0.48]} scale={[0.24, 0.09, 0.035]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#75945d" roughness={1} /></mesh>
    <mesh position={[0, 1.49, 0.06]} rotation={[0, 0, -0.48]}><cylinderGeometry args={[0.008, 0.008, 0.35, 5]} /><meshStandardMaterial color="#55784d" /></mesh>
  </group>
}
function RoomScene() {
  return (
    <>
      <color attach="background" args={['#dcd8cf']} />
      <fog attach="fog" args={['#dcd8cf', 10, 22]} />
      <WindowWall />
      <CurtainPanel side="left" />
      <CurtainPanel side="right" />
      <ForestSpirit />
      <ContactShadows position={[0, 0.015, 0]} opacity={0.3} scale={12} blur={2.5} far={5} />
      {/* Fully local lighting: do not block scene startup on a remote HDRI download. */}
      <hemisphereLight args={['#fff7e8', '#817969', 1.15]} />
      <directionalLight position={[5, 7, 4]} intensity={0.42} color="#fff2dc" />
    </>
  )
}

export default function CurtainScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.55, 9.8], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      fallback={<div className="webgl-fallback">当前浏览器无法启动 WebGL，请更新浏览器或启用硬件加速。</div>}
    >
      <RoomScene />
    </Canvas>
  )
}
