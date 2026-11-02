import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useStudio, type FabricId } from '../store'

const fabricLooks: Record<FabricId, { color: string; roughness: number; metalness: number; opacity: number; fold: number; weight: number }> = {
  sheer: { color: '#e8e5dc', roughness: 0.72, metalness: 0, opacity: 0.58, fold: 0.065, weight: 0.55 },
  linen: { color: '#b9ad98', roughness: 0.94, metalness: 0, opacity: 1, fold: 0.105, weight: 1 },
  velvet: { color: '#555047', roughness: 0.98, metalness: 0, opacity: 1, fold: 0.14, weight: 1.55 },
  blackout: { color: '#77756d', roughness: 0.99, metalness: 0, opacity: 1, fold: 0.12, weight: 1.8 },
}

function Room() {
  const hour = useStudio((s) => s.hour)
  const daylight = THREE.MathUtils.clamp(1 - Math.abs(hour - 13) / 11, 0.12, 1)
  return (
    <group>
      <mesh position={[0, 2.2, -2.5]} receiveShadow>
        <boxGeometry args={[12, 6.2, 0.22]} />
        <meshStandardMaterial color="#e9e5dc" roughness={0.92} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#b6a58e" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.45, -2.31]}>
        <boxGeometry args={[5.35, 4.65, 0.08]} />
        <meshStandardMaterial color="#f7f4ed" roughness={0.25} metalness={0.12} />
      </mesh>
      <mesh position={[0, 2.45, -2.22]}>
        <boxGeometry args={[4.85, 4.18, 0.025]} />
        <meshBasicMaterial color={hour > 18 || hour < 7 ? '#39404a' : '#c8d7d7'} />
      </mesh>
      <mesh position={[0, 2.45, -2.17]}>
        <boxGeometry args={[0.055, 4.25, 0.12]} />
        <meshStandardMaterial color="#f7f4ed" roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.34, -1.98]}>
        <boxGeometry args={[5.4, 0.12, 0.36]} />
        <meshStandardMaterial color="#d4cfc3" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.62, -2.02]}>
        <boxGeometry args={[5.55, 0.12, 0.28]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.3} />
      </mesh>
      <mesh position={[-2.72, 2.45, -2.02]}>
        <boxGeometry args={[0.13, 4.45, 0.28]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.3} />
      </mesh>
      <mesh position={[2.72, 2.45, -2.02]}>
        <boxGeometry args={[0.13, 4.45, 0.28]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.78, -1.55]}>
        <cylinderGeometry args={[0.035, 0.035, 5.9, 24]} />
        <meshStandardMaterial color="#9b8c70" metalness={0.78} roughness={0.25} />
      </mesh>
      <mesh position={[-3.5, 2.8, -1.4]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.72, 1.9, 0.08]} />
        <meshStandardMaterial color="#9b927e" roughness={0.8} />
      </mesh>
      <mesh position={[3.55, 1.1, -1.2]}>
        <cylinderGeometry args={[0.38, 0.46, 0.72, 32]} />
        <meshStandardMaterial color="#c6bca8" roughness={0.88} />
      </mesh>
      <mesh position={[3.55, 2.12, -1.2]}>
        <sphereGeometry args={[0.68, 24, 16]} />
        <meshStandardMaterial color="#65745c" roughness={0.95} />
      </mesh>
      <mesh position={[3.25, 2.48, -1.2]}>
        <sphereGeometry args={[0.45, 20, 16]} />
        <meshStandardMaterial color="#78866b" roughness={0.95} />
      </mesh>
      <mesh position={[3.82, 2.62, -1.1]}>
        <sphereGeometry args={[0.42, 20, 16]} />
        <meshStandardMaterial color="#899477" roughness={0.95} />
      </mesh>
      <ambientLight intensity={0.65 + daylight * 0.22} />
      <directionalLight position={[-3 + (hour - 12) * 0.18, 5.8, 2.5]} intensity={0.9 + daylight * 1.25} color={hour > 17 ? '#f2b98a' : '#fff3dc'} castShadow />
      <pointLight position={[0, 3.4, 1.8]} intensity={hour > 19 || hour < 7 ? 2 : 0.15} color="#f6d9ad" distance={8} />
    </group>
  )
}

function CurtainPanel({ side }: { side: 'left' | 'right' }) {
  const mesh = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(2.38, 4.12, 54, 56), [])
  const position = geometry.attributes.position as THREE.BufferAttribute
  const base = useMemo(() => Float32Array.from(position.array as ArrayLike<number>), [position])
  const drag = useRef({ active: false, x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 })
  const fabric = useStudio((s) => s.fabric)
  const wind = useStudio((s) => s.wind)
  const open = useStudio((s) => s.open)
  const look = fabricLooks[fabric]
  const direction = side === 'left' ? -1 : 1
  const rootX = direction * (0.05 + open * 1.15)
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#b9ad98', roughness: 0.94, side: THREE.DoubleSide, transparent: true, depthWrite: true, sheen: 0.35, sheenRoughness: 0.9 }), [])
  material.color.set(look.color)
  material.roughness = look.roughness
  material.opacity = look.opacity
  material.transparent = look.opacity < 1
  material.depthWrite = look.opacity > 0.8
  material.sheen = fabric === 'velvet' ? 0.9 : 0.25
  useFrame(({ clock }, delta) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    const dt = Math.min(delta, 0.033)
    const d = drag.current
    d.vx += (d.targetX - d.x) * 30 * dt
    d.vy += (d.targetY - d.y) * 30 * dt
    d.vx *= Math.exp(-7 * dt)
    d.vy *= Math.exp(-7 * dt)
    d.x += d.vx * dt
    d.y += d.vy * dt
    const windPower = [0, 0.045, 0.105, 0.19][wind] * (1 / look.weight)
    for (let i = 0; i < position.count; i++) {
      const u = i % 55 / 54
      const v = Math.floor(i / 55) / 56
      const bx = base[i * 3]
      const by = base[i * 3 + 1]
      const fold = Math.sin(u * Math.PI * 18) * look.fold * (0.5 + v * 0.5)
      const gust = Math.sin(t * (1.15 + wind * 0.28) + u * 5.4 + v * 1.9) * windPower * (0.15 + v * 0.85)
      const gaussian = Math.exp(-(((u - (0.5 + d.x * 0.2)) ** 2) / 0.018 + ((v - (0.52 + d.y * 0.12)) ** 2) / 0.055))
      const pull = gaussian * d.x * 0.5
      const lift = gaussian * d.y * 0.28
      position.setXYZ(i, bx + fold + gust + pull, by + lift, Math.cos(u * Math.PI * 18) * look.fold * 0.62 + gust * 0.8 + gaussian * (d.x * 0.18 + d.y * 0.12))
    }
    position.needsUpdate = true
    geometry.computeVertexNormals()
    mesh.current.position.x = direction * (1.23 + open * 0.95)
    mesh.current.position.y = 2.58
    mesh.current.position.z = -1.88 + (side === 'left' ? 0.025 : 0)
    mesh.current.rotation.y = direction * (open * 0.12)
  })
  const pointerDown = (e: any) => {
    e.stopPropagation()
    drag.current.active = true
    drag.current.targetX = 0
    drag.current.targetY = 0
    e.target.setPointerCapture?.(e.pointerId)
  }
  const pointerMove = (e: any) => {
    if (!drag.current.active) return
    e.stopPropagation()
    drag.current.targetX = THREE.MathUtils.clamp(e.point.x * direction * 0.8, -1.6, 1.6)
    drag.current.targetY = THREE.MathUtils.clamp((e.point.y - 2.5) * 0.55, -1.2, 1.2)
  }
  const pointerUp = (e: any) => {
    e.stopPropagation()
    drag.current.active = false
    drag.current.targetX *= 0.12
    drag.current.targetY *= 0.12
  }
  return (
    <mesh ref={mesh} geometry={geometry} material={material} castShadow receiveShadow
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerLeave={pointerUp}>
      <meshStandardMaterial attach="material" color={look.color} roughness={look.roughness} side={THREE.DoubleSide} transparent={look.opacity < 1} opacity={look.opacity} depthWrite={look.opacity > 0.8} />
    </mesh>
  )
}

function SceneContents() {
  return (
    <>
      <color attach="background" args={['#dedbd2']} />
      <fog attach="fog" args={['#dedbd2', 8, 18]} />
      <Room />
      <CurtainPanel side="left" />
      <CurtainPanel side="right" />
      <ContactShadows position={[0, 0.015, 0]} opacity={0.28} scale={12} blur={2.4} far={5} />
      <Environment preset="apartment" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 2.1} />
    </>
  )
}

export default function CurtainScene() {
  return (
    <Canvas shadows camera={{ position: [0, 2.55, 9.6], fov: 38 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: false }}>
      <SceneContents />
    </Canvas>
  )
}