import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useStudio, type FabricId } from '../store'

const fabricColors: Record<FabricId, string> = { sheer:'#f4ead5', linen:'#c8b99b', velvet:'#756b60', blackout:'#596b63' }

function Curtain({ side }: { side: -1 | 1 }) {
  const mesh = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(2.55, 4.1, 28, 42), [])
  const opening = useStudio(s => s.opening), wind = useStudio(s => s.wind), fabric = useStudio(s => s.fabric)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    const attr = geometry.attributes.position as THREE.BufferAttribute
    for (let i=0;i<attr.count;i++) {
      const x=attr.getX(i), y=attr.getY(i), u=(x+1.275)/2.55, v=(y+2.05)/4.1, t=clock.elapsedTime
      attr.setZ(i, Math.cos(u*Math.PI*18)*.075 + Math.sin(t*1.55+u*7+v*2)*(.025+wind*.018)*v + Math.sin(t*2.4+u*20)*(.012+wind*.009)*v)
    }
    attr.needsUpdate=true; geometry.computeVertexNormals()
    mesh.current.position.x=side*(1.34+opening*1.18)
    mesh.current.scale.x=1-opening*.22
    mesh.current.rotation.y=side*(-.025-opening*.035)
  })
  return <mesh ref={mesh} geometry={geometry} castShadow receiveShadow>
    <meshPhysicalMaterial color={fabricColors[fabric]} roughness={fabric==='velvet'?.98:.78} side={THREE.DoubleSide} sheen={.35} sheenRoughness={.85} transparent={fabric==='sheer'} opacity={fabric==='sheer'?.72:1}/>
  </mesh>
}

function Canopy({p,s=1,c='#456a4c'}:{p:[number,number,number];s?:number;c?:string}) {
  return <mesh position={p} scale={s} castShadow><icosahedronGeometry args={[1,2]}/><meshStandardMaterial color={c} roughness={1} flatShading/></mesh>
}
function GreatTree() {
  const crown=useRef<THREE.Group>(null)
  useFrame(({clock})=>{if(crown.current)crown.current.rotation.z=Math.sin(clock.elapsedTime*.22)*.018})
  return <group position={[-1.95,.12,-4.3]}>
    <mesh position={[0,1.45,0]} rotation={[0,0,-.08]} castShadow><cylinderGeometry args={[.19,.38,3.1,10]}/><meshStandardMaterial color="#594b3b" roughness={1}/></mesh>
    <mesh position={[-.48,1.12,0]} rotation={[0,0,-.85]}><cylinderGeometry args={[.08,.13,1.35,8]}/><meshStandardMaterial color="#594b3b"/></mesh>
    <mesh position={[.45,1.65,.04]} rotation={[0,0,.7]}><cylinderGeometry args={[.07,.12,1.35,8]}/><meshStandardMaterial color="#594b3b"/></mesh>
    <group ref={crown} position={[0,3.15,0]}>
      <Canopy p={[0,.2,0]} s={1.45} c="#385e43"/><Canopy p={[-.9,-.05,.1]} s={.95} c="#52764e"/><Canopy p={[.95,.08,.08]} s={1.02} c="#466d49"/><Canopy p={[-.42,.85,-.08]} s={.9} c="#658355"/><Canopy p={[.52,.88,-.05]} s={.88} c="#5b7c50"/><Canopy p={[.08,-.72,.12]} s={.82} c="#6e8958"/>
    </group>
  </group>
}
function Hills(){return <group position={[0,0,-5.2]}>
  <mesh position={[0,.2,0]} scale={[7.8,1.45,.2]}><sphereGeometry args={[1,32,16]}/><meshStandardMaterial color="#81936c"/></mesh>
  <mesh position={[3.4,.25,-.1]} scale={[4.2,1.65,.3]}><sphereGeometry args={[1,32,16]}/><meshStandardMaterial color="#617e5c"/></mesh>
  <mesh position={[-4.2,.2,-.2]} scale={[3.8,1.35,.3]}><sphereGeometry args={[1,32,16]}/><meshStandardMaterial color="#718a64"/></mesh>
</group>}
function ForestFriend(){
  const body=useRef<THREE.Group>(null), bounce=useRef(0)
  useFrame(({clock},dt)=>{if(!body.current)return;body.current.position.y=.68+Math.sin(clock.elapsedTime*1.45)*.035+bounce.current;body.current.rotation.z=Math.sin(clock.elapsedTime*.65)*.025;bounce.current*=Math.max(0,1-dt*2.8)})
  return <group ref={body} position={[1.52,.68,-3.1]} scale={.82}>
    <mesh position={[0,.62,0]} castShadow><sphereGeometry args={[.72,32,24]}/><meshStandardMaterial color="#8c9388" roughness={.96}/></mesh>
    <mesh position={[0,.34,.39]} scale={[.72,.68,.3]}><sphereGeometry args={[.52,24,18]}/><meshStandardMaterial color="#e8dfc9"/></mesh>
    <mesh position={[-.31,1.27,0]} rotation={[0,0,-.2]}><capsuleGeometry args={[.12,.28,5,10]}/><meshStandardMaterial color="#858d82"/></mesh>
    <mesh position={[.31,1.27,0]} rotation={[0,0,.2]}><capsuleGeometry args={[.12,.28,5,10]}/><meshStandardMaterial color="#858d82"/></mesh>
    {[-.2,.2].map(x=><group key={x} position={[x,.88,.55]}><mesh><sphereGeometry args={[.075,14,12]}/><meshBasicMaterial color="#fffdf0"/></mesh><mesh position={[0,0,.06]}><sphereGeometry args={[.034,12,10]}/><meshBasicMaterial color="#26352c"/></mesh></group>)}
    <mesh position={[0,.72,.65]}><sphereGeometry args={[.045,12,10]}/><meshStandardMaterial color="#4d5148"/></mesh>
    {[-.12,0,.12].map((x,i)=><mesh key={x} position={[x,.43+(i===1?.06:0),.65]} rotation={[0,0,Math.PI]}><coneGeometry args={[.035,.09,3]}/><meshStandardMaterial color="#8c9388"/></mesh>)}
    <mesh position={[-.57,.42,.05]}><sphereGeometry args={[.18,16,12]}/><meshStandardMaterial color="#858d82"/></mesh><mesh position={[.57,.42,.05]}><sphereGeometry args={[.18,16,12]}/><meshStandardMaterial color="#858d82"/></mesh>
    <mesh position={[-.25,.06,.08]} scale={[.23,.14,.25]}><sphereGeometry args={[1,14,10]}/><meshStandardMaterial color="#777f75"/></mesh><mesh position={[.25,.06,.08]} scale={[.23,.14,.25]}><sphereGeometry args={[1,14,10]}/><meshStandardMaterial color="#777f75"/></mesh>
    <mesh position={[.04,1.55,.02]} rotation={[0,0,-.35]} scale={[.24,.08,.04]}><sphereGeometry args={[1,16,10]}/><meshStandardMaterial color="#6d9158"/></mesh>
  </group>
}
function Fireflies(){
 const group=useRef<THREE.Group>(null), hour=useStudio(s=>s.hour)
 const dots=useMemo(()=>Array.from({length:28},(_,i)=>({x:-3.4+(i*.71)%6.8,y:.45+(i*.37)%2.5,z:-2.8-(i*.19)%1.2,phase:i*.8})),[])
 useFrame(({clock})=>{if(!group.current)return;group.current.children.forEach((o,i)=>{const d=dots[i];o.position.y=d.y+Math.sin(clock.elapsedTime*1.5+d.phase)*.12;((o as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity=.28+(Math.sin(clock.elapsedTime*2+d.phase)+1)*.32})})
 return <group ref={group} visible={hour>=18||hour<7}>{dots.map((d,i)=><mesh key={i} position={[d.x,d.y,d.z]}><sphereGeometry args={[.025+(i%3)*.006,8,8]}/><meshBasicMaterial color="#ffe9a0" transparent opacity={.6}/></mesh>)}</group>
}
function Rain(){
 const weather=useStudio(s=>s.weather)
 const geometry=useMemo(()=>{const a=new Float32Array(240*3);for(let i=0;i<240;i++){a[i*3]=(Math.random()-.5)*9;a[i*3+1]=Math.random()*5.4;a[i*3+2]=-2.4+Math.random()*.3}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));return g},[])
 useFrame((_,dt)=>{if(weather!=='rainy')return;const p=geometry.attributes.position as THREE.BufferAttribute;for(let i=0;i<p.count;i++){p.setY(i,p.getY(i)-dt*3.4);p.setX(i,p.getX(i)-dt*.25);if(p.getY(i)<.1){p.setY(i,5.4);p.setX(i,(Math.random()-.5)*9)}}p.needsUpdate=true})
 return <points geometry={geometry} visible={weather==='rainy'}><pointsMaterial color="#dce8e7" size={.035} transparent opacity={.62} sizeAttenuation/></points>
}
function WindowWorld(){
 const hour=useStudio(s=>s.hour),weather=useStudio(s=>s.weather),night=hour>=19||hour<7
 const sky=weather==='rainy'?'#7e9695':night?'#273b4b':hour<10?'#e8c9a0':hour>17?'#dc9b70':'#a8c5bc'
 const sun=useRef<THREE.Mesh>(null)
 useFrame(({clock})=>{if(sun.current)sun.current.rotation.z=Math.sin(clock.elapsedTime*.15)*.04})
 return <group>
  <color attach="background" args={[sky]}/><fog attach="fog" args={[sky,10,22]}/>
  <mesh position={[0,2.45,-2.85]}><planeGeometry args={[6.2,4.8]}/><meshBasicMaterial color={sky}/></mesh>
  <mesh ref={sun} position={[2.15,3.65,-2.72]}><circleGeometry args={[.34,48]}/><meshBasicMaterial color={night?'#f5e7c1':'#ffe3a5'}/></mesh>
  <Hills/><GreatTree/><ForestFriend/><Fireflies/><Rain/>
  <group position={[0,0,-2.62]}>
   <mesh position={[0,2.48,0]}><boxGeometry args={[6.2,.12,.18]}/><meshStandardMaterial color="#e8ddc5"/></mesh>
   <mesh position={[0,.12,0]}><boxGeometry args={[6.2,.14,.18]}/><meshStandardMaterial color="#b9a98d"/></mesh>
   {[-3.02,3.02].map(x=><mesh key={x} position={[x,1.3,0]}><boxGeometry args={[.12,2.65,.18]}/><meshStandardMaterial color="#e8ddc5"/></mesh>)}
   <mesh position={[0,1.25,-.03]}><boxGeometry args={[.06,2.2,.12]}/><meshStandardMaterial color="#e8ddc5"/></mesh>
   <mesh position={[0,2.45,.02]}><boxGeometry args={[6.1,.08,.12]}/><meshStandardMaterial color="#d5c5a7"/></mesh>
  </group>
  <ambientLight intensity={night?.36:.68}/><directionalLight position={[-3,7,4]} intensity={night?.3:1.6} color={night?'#a8c7e1':'#fff0cf'} castShadow/><pointLight position={[0,2.2,1.2]} intensity={night?1.2:.18} color="#ffe2b1" distance={8}/>
 </group>
}
function Room(){return <>
 <mesh position={[0,2.65,-3.18]}><boxGeometry args={[9.2,5.6,.25]}/><meshStandardMaterial color="#e7dfcb" roughness={1}/></mesh>
 <mesh position={[0,-.08,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[18,16]}/><meshStandardMaterial color="#b8a78c" roughness={.95}/></mesh>
 <mesh position={[0,5.5,-.7]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[12,10]}/><meshStandardMaterial color="#eee6d4" roughness={1}/></mesh>
 <WindowWorld/><Curtain side={-1}/><Curtain side={1}/>
 <ContactShadows position={[0,.015,0]} opacity={.28} scale={12} blur={2.8} far={5}/>
 <hemisphereLight args={['#fff4df','#746d59',1.1]}/>
</>}
export default function CurtainScene(){return <Canvas shadows camera={{position:[0,2.55,10.8],fov:37}} dpr={[1,1.5]} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}><Room/></Canvas>}
