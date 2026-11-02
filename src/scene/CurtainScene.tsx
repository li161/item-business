import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { useStudio, type FabricId } from '../store'

const cloth:Record<FabricId,string>={sheer:'#eee5d1',linen:'#b9a98c',velvet:'#626c59',blackout:'#3d5149'}
const wood='#79583d', paleWood='#b38d62', cream='#d8cbb2'
function Box({p,s,c,rough=0.9,cast=true}:{p:[number,number,number];s:[number,number,number];c:string;rough?:number;cast?:boolean}){
 return <mesh position={p} castShadow={cast} receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={rough}/></mesh>
}
function Floor(){
 return <group>
  <Box p={[0,-.16,-.1]} s={[11,.3,12]} c="#8c694a"/>
  {Array.from({length:17},(_,i)=><Box key={i} p={[-5.1+(i%2)*.34,-.005,-5.2+Math.floor(i/2)*.68]} s={[.64,.025, .65]} c={i%3===0?'#ad8963':i%3===1?'#9c7957':'#b28c65'} cast={false}/>)}
  <mesh position={[0,.012,.25]} rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[2.15,64]}/><meshStandardMaterial color="#9b8b70" roughness={1}/></mesh>
  <mesh position={[0,.018,.25]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.55,1.9,64]}/><meshStandardMaterial color="#c9b89a" roughness={1}/></mesh>
 </group>
}
function RoomShell(){
 return <group>
  <Box p={[-4.25,2.85,-5.55]} s={[2.5,5.9,.25]} c="#e4dac6"/>
  <Box p={[4.25,2.85,-5.55]} s={[2.5,5.9,.25]} c="#e4dac6"/>
  <Box p={[0,5.35,-5.55]} s={[6,.9,.25]} c="#e4dac6"/>
  <Box p={[0,.35,-5.55]} s={[6,.7,.25]} c="#e4dac6"/>
  <Box p={[-5.38,2.85,-.1]} s={[.25,5.9,11]} c="#d8cbb4"/>
  <Box p={[5.38,2.85,-.1]} s={[.25,5.9,11]} c="#d8cbb4"/>
  <Box p={[0,5.75,-.1]} s={[11,.2,11]} c="#eee7d8"/>
  <Box p={[0,.15,-5.34]} s={[11,.3,.5]} c="#a98a66"/>
  {[-5.15,5.15].map(x=><Box key={x} p={[x,.16,-.1]} s={[.18,.32,10.8]} c="#a98a66"/>)}
  {[-4.9,4.9].map(x=><Box key={x} p={[x,2.8,-5.38]} s={[.2,5.5,.2]} c="#b18c63"/>)}
  <Floor/>
 </group>
}
function WindowView(){
 const hour=useStudio(s=>s.hour),weather=useStudio(s=>s.weather),night=hour>=19||hour<7
 const sky=weather==='rainy'?'#829b9a':night?'#24394d':hour<10?'#e8c39b':hour>17?'#d79b70':'#a9c6b5'
 const dots=useMemo(()=>Array.from({length:22},(_,i)=>({x:-3.1+(i*1.37)%6.2,y:.4+(i*.73)%3.8,z:-6.9})),[])
 return <group>
  <mesh position={[0,2.95,-5.42]}><planeGeometry args={[9.6,5.1]}/><meshBasicMaterial color={sky}/></mesh>
  <mesh position={[0,1.15,-5.3]} scale={[8,.8,.2]}><sphereGeometry args={[1,32,16]}/><meshStandardMaterial color="#66835d"/></mesh>
  <mesh position={[-2.1,1.8,-6.1]}><cylinderGeometry args={[.16,.28,3.5,10]}/><meshStandardMaterial color="#594b39"/></mesh>
  {[[-2.1,3.2,-6.1,1.45],[-2.8,2.8,-6.15,.95],[-1.4,2.9,-6.2,1.05],[2.7,1.7,-6.3,.8],[3.4,2.1,-6.4,.95]].map((v,i)=><mesh key={i} position={[v[0],v[1],v[2]]} scale={v[3]}><icosahedronGeometry args={[1,2]}/><meshStandardMaterial color={i%2?'#52764f':'#3f6749'} flatShading/></mesh>)}
  <mesh position={[2.6,3.7,-6.6]}><circleGeometry args={[.35,32]}/><meshBasicMaterial color={night?'#f5e7bf':'#ffe0a1'}/></mesh>
  {dots.map((d,i)=><mesh key={i} position={[d.x,d.y,d.z]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color="#f5e6ad"/></mesh>)}
  {weather==='rainy'&&<RainWindow/>}
  <Box p={[0,5.1,-5.28]} s={[6.7,.18,.28]} c="#6f5138"/>
  <Box p={[0,.82,-5.28]} s={[6.7,.18,.28]} c="#6f5138"/>
  {[-3.25,3.25].map(x=><Box key={x} p={[x,2.95,-5.28]} s={[.18,4.2,.28]} c="#6f5138"/>)}
  <Box p={[0,2.95,-5.23]} s={[.12,4.05,.24]} c="#76563a"/>
  <Box p={[0,2.95,-5.23]} s={[6.45,.12,.24]} c="#76563a"/>
  <Box p={[-1.62,2.95,-5.2]} s={[.06,4,.12]} c="#a67e54"/>
  <Box p={[1.62,2.95,-5.2]} s={[.06,4,.12]} c="#a67e54"/>
 </group>
}
function RainWindow(){const ref=useRef<THREE.Points>(null);const geo=useMemo(()=>{const a=new Float32Array(180*3);for(let i=0;i<180;i++){a[i*3]=(Math.random()-.5)*6.4;a[i*3+1]=Math.random()*4.4;a[i*3+2]=-6.5}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));return g},[]);useFrame((_,dt)=>{const p=geo.attributes.position as THREE.BufferAttribute;for(let i=0;i<p.count;i++){p.setY(i,p.getY(i)-dt*2.8);if(p.getY(i)<.7)p.setY(i,5)}p.needsUpdate=true});return <points ref={ref} geometry={geo}><pointsMaterial color="#e0eceb" size={.025} transparent opacity={.6}/></points>}
function makeFabricMaps(){
 const colorCanvas=document.createElement('canvas');colorCanvas.width=1024;colorCanvas.height=1024;
 const colorCtx=colorCanvas.getContext('2d');
 const bumpCanvas=document.createElement('canvas');bumpCanvas.width=1024;bumpCanvas.height=1024;
 const bumpCtx=bumpCanvas.getContext('2d');
 if(!colorCtx||!bumpCtx)return {map:null,bumpMap:null};
 colorCtx.fillStyle='#d8d2c6';colorCtx.fillRect(0,0,1024,1024);
 bumpCtx.fillStyle='rgb(128,128,128)';bumpCtx.fillRect(0,0,1024,1024);
 // Fine warp and weft yarns, with alternating thread thickness and tiny slubs.
 for(let y=0;y<1024;y+=4){
  const light=y%8===0;
  colorCtx.strokeStyle=light?'rgba(255,255,255,.22)':'rgba(65,56,45,.13)';
  colorCtx.lineWidth=light?1.8:1.25;colorCtx.beginPath();colorCtx.moveTo(0,y);colorCtx.lineTo(1024,y);colorCtx.stroke();
  bumpCtx.strokeStyle=light?'rgb(153,153,153)':'rgb(105,105,105)';
  bumpCtx.lineWidth=light?2:1.3;bumpCtx.beginPath();bumpCtx.moveTo(0,y);bumpCtx.lineTo(1024,y);bumpCtx.stroke();
 }
 for(let x=0;x<1024;x+=4){
  const light=x%8===0;
  colorCtx.strokeStyle=light?'rgba(255,255,255,.18)':'rgba(58,50,42,.12)';
  colorCtx.lineWidth=light?1.8:1.2;colorCtx.beginPath();colorCtx.moveTo(x,0);colorCtx.lineTo(x,1024);colorCtx.stroke();
  bumpCtx.strokeStyle=light?'rgb(148,148,148)':'rgb(111,111,111)';
  bumpCtx.lineWidth=light?2:1.2;bumpCtx.beginPath();bumpCtx.moveTo(x,0);bumpCtx.lineTo(x,1024);bumpCtx.stroke();
 }
 for(let i=0;i<3200;i++){
  const x=(i*127)%1024,y=(i*293)%1024,w=1+(i%3);
  colorCtx.fillStyle=i%2?'rgba(255,255,255,.2)':'rgba(50,44,36,.12)';colorCtx.fillRect(x,y,w,1);
  bumpCtx.fillStyle=i%2?'rgb(174,174,174)':'rgb(86,86,86)';bumpCtx.fillRect(x,y,w,1);
 }
 const map=new THREE.CanvasTexture(colorCanvas),bumpMap=new THREE.CanvasTexture(bumpCanvas);
 for(const t of [map,bumpMap]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1.6,2.4);t.anisotropy=8}
 map.colorSpace=THREE.SRGBColorSpace;
 return {map,bumpMap};
}
function Curtain({side}:{side:-1|1}){
 const mesh=useRef<THREE.Mesh>(null);
 const geometry=useMemo(()=>{
  const g=new THREE.PlaneGeometry(2.12,4.08,72,88);
  const pos=g.attributes.position as THREE.BufferAttribute;
  const base=new Float32Array(pos.array.length);base.set(pos.array);
  g.userData.basePositions=base;return g;
 },[]);
 const opening=useStudio(s=>s.opening),wind=useStudio(s=>s.wind),fabric=useStudio(s=>s.fabric);
 const maps=useMemo(()=>makeFabricMaps(),[]);
 const isSheer=fabric==='sheer',isVelvet=fabric==='velvet',isBlackout=fabric==='blackout';
 useFrame(({clock},delta)=>{
  if(!mesh.current)return;
  const pos=geometry.attributes.position as THREE.BufferAttribute;
  const base=geometry.userData.basePositions as Float32Array;
  const t=clock.elapsedTime,windPower=wind/3;
  for(let i=0;i<pos.count;i++){
   const ix=i*3,x=base[ix],y=base[ix+1],u=(x+1.06)/2.12,v=(y+2.04)/4.08;
   // Deep, continuous vertical folds: tightly gathered at the heading, softer at the hem.
   const foldPhase=u*Math.PI*18;
   const foldDepth=.105+.035*Math.pow(1-v,1.4);
   const folds=Math.cos(foldPhase)*foldDepth+.018*Math.cos(foldPhase*2+.35);
   const secondary=Math.cos(u*Math.PI*6+v*.45)*.018;
   // Wind travels down the fabric rather than moving the whole panel as one sheet.
   const travelling=Math.sin(t*1.25-v*3.4+u*4.5)*.055*windPower*(.12+v*.88);
   const edgeFlutter=Math.sin(t*1.8+v*5.5)*.035*windPower*Math.pow(Math.abs(u-.5)*2,2)*v;
   const hemDrape=Math.sin(u*Math.PI*5+t*.65)*.025*windPower*v*v;
   pos.setXYZ(i,x,y,folds+secondary+travelling+edgeFlutter+hemDrape);
  }
  pos.needsUpdate=true;geometry.computeVertexNormals();
  const targetX=side*(2.42+opening*1.05);
  mesh.current.position.x=THREE.MathUtils.damp(mesh.current.position.x,targetX,4.5,delta);
  mesh.current.scale.x=THREE.MathUtils.damp(mesh.current.scale.x,1-opening*.28,4.5,delta);
  mesh.current.rotation.y=side*(-.035-opening*.055);
 });
 const panelX=side*(2.42+opening*1.05),panelWidth=1.9*(1-opening*.28);
 return <group>
  <mesh ref={mesh} geometry={geometry} position={[side*2.42,2.95,-5.03]} castShadow receiveShadow>
   <meshPhysicalMaterial
    color={cloth[fabric]}
    map={maps.map??undefined}
    bumpMap={maps.bumpMap??undefined}
    bumpScale={isSheer?.009:isVelvet?.026:.018}
    side={THREE.DoubleSide}
    roughness={isVelvet?.94:isSheer?.82:.88}
    metalness={0}
    sheen={isVelvet?1:isSheer?.28:.58}
    sheenRoughness={isVelvet?.96:.82}
    sheenColor={isVelvet?'#b5a28a':'#ffffff'}
    transparent={isSheer}
    opacity={isSheer?.46:1}
    depthWrite={!isSheer}
   />
  </mesh>
  {/* Header tape and stitched lower/side hems give the cloth a finished construction. */}
  <mesh position={[panelX,4.99,-5.045]}><boxGeometry args={[2.02*(1-opening*.28),.105,.035]}/><meshStandardMaterial color={isVelvet?'#4d5746':isBlackout?'#304139':'#b9aa91'} roughness={.96}/></mesh>
  <mesh position={[panelX, .91,-5.045]}><boxGeometry args={[2.08*(1-opening*.28),.075,.045]}/><meshStandardMaterial color={cloth[fabric]} roughness={.94}/></mesh>
  {[-1,1].map(edge=><mesh key={edge} position={[panelX+edge*1.035*(1-opening*.28),2.95,-5.045]}><boxGeometry args={[.045,4.02,.04]}/><meshStandardMaterial color={cloth[fabric]} roughness={.94}/></mesh>)}
  {Array.from({length:9},(_,i)=><group key={i} position={[panelX+(i/8-.5)*panelWidth,5.13,-5.03]}>
   <mesh rotation={[0,0,Math.PI/2]}><torusGeometry args={[.052,.012,8,18]}/><meshStandardMaterial color="#927653" metalness={.58} roughness={.34}/></mesh>
   <mesh position={[0,-.085,0]}><cylinderGeometry args={[.012,.012,.11,8]}/><meshStandardMaterial color="#927653" metalness={.45} roughness={.42}/></mesh>
  </group>)}
  {side===-1&&<mesh position={[0,5.2,-5.03]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.035,.035,6.25,16]}/><meshStandardMaterial color="#8b704f" metalness={.62} roughness={.34}/></mesh>}
 </group>
}
function Sofa(){
 return <group position={[-2.45,.08,.05]} rotation={[0,.2,0]}>
  <Box p={[0,.32,0]} s={[2.45,.42,1.05]} c="#75806a"/><Box p={[0,.83,-.42]} s={[2.5,1.05,.25]} c="#68765f"/>
  {[-1.05,1.05].map(x=><Box key={x} p={[x,.58,.05]} s={[.34,.85,1.1]} c="#5f7059"/>)}
  {[-.65,.05,.72].map((x,i)=><mesh key={i} position={[x,.59,.22]} rotation={[-.12,0,0]}><boxGeometry args={[.65,.16,.65]}/><meshStandardMaterial color={i===1?'#c8b69a':'#b69b7b'} roughness={1}/></mesh>)}
  {[-.9,.9].map(x=><mesh key={x} position={[x,.13,-.25]}><cylinderGeometry args={[.07,.09,.25,10]}/><meshStandardMaterial color={wood}/></mesh>)}
 </group>
}
function SideTable(){return <group position={[2.55,.02,.1]}>
 <mesh position={[0,.62,0]}><cylinderGeometry args={[.55,.58,.13,32]}/><meshStandardMaterial color={paleWood}/></mesh>
 {[[-.34,.31,-.34],[.34,.31,-.34],[-.34,.31,.34],[.34,.31,.34]].map((p,i)=><mesh key={i} position={p as [number,number,number]}><cylinderGeometry args={[.045,.055,.62,8]}/><meshStandardMaterial color={wood}/></mesh>)}
 <mesh position={[0,.91,0]}><cylinderGeometry args={[.17,.17,.38,20]}/><meshStandardMaterial color="#d9c7a8" roughness={.3}/></mesh>
 <mesh position={[0,1.12,0]}><sphereGeometry args={[.23,20,16]}/><meshStandardMaterial color="#ffe1a2" emissive="#ffca72" emissiveIntensity={1.1}/></mesh>
 </group>}
function Bookcase(){return <group position={[4.7,.1,-2.8]}>
 <Box p={[0,1.55,0]} s={[.38,3.1,1.7]} c={wood}/>
 {[.45,1.35,2.25].map(y=><Box key={y} p={[-.23,y,0]} s={[.55,.1,1.68]} c={paleWood}/>)}
 {Array.from({length:10},(_,i)=><mesh key={i} position={[-.22,.7+(i%3)*.9,-.62+Math.floor(i/3)*.35]} rotation={[0,0,(i%2?.08:-.08)]}><boxGeometry args={[.18,.58+(i%3)*.08,.22]}/><meshStandardMaterial color={['#6d7960','#a46f4d','#d0b88f','#7d6650'][i%4]}/></mesh>)}
 </group>}
function Plant({p,scale=1}:{p:[number,number,number];scale?:number}){return <group position={p} scale={scale}><mesh position={[0,.3,0]}><cylinderGeometry args={[.25,.32,.55,16]}/><meshStandardMaterial color="#b47e59"/></mesh>{Array.from({length:7},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*.22,.75+(i%3)*.14,Math.cos(i*2.4)*.18]} rotation={[.3,0,i*.8]} scale={[.16,.55,.07]}><sphereGeometry args={[1,12,10]}/><meshStandardMaterial color={i%2?'#617c56':'#789267'}/></mesh>)}</group>}
function Rug(){return <group position={[0,.035,.9]} rotation={[-Math.PI/2,0,0]}><mesh><circleGeometry args={[2.35,64]}/><meshStandardMaterial color="#b9a88a" roughness={1}/></mesh><mesh position={[0,0,.008]}><ringGeometry args={[1.8,2.05,64]}/><meshStandardMaterial color="#e1d3b7" roughness={1}/></mesh></group>}
function Room(){
 const hour=useStudio(s=>s.hour),weather=useStudio(s=>s.weather),night=hour>=19||hour<7
 const [lampOn,setLampOn]=useState(true)
 const lamp=useRef<THREE.PointLight>(null)
 return <><color attach="background" args={['#b7b6a2']}/><fog attach="fog" args={['#b7b6a2',13,25]}/>
 <RoomShell/><WindowView/><Curtain side={-1}/><Curtain side={1}/>
 <Sofa/><SideTable/><Bookcase/><Rug/><Plant p={[-4.25,.02,1.5]} scale={1.3}/><Plant p={[3.8,.02,2.5]} scale={.9}/>
 <mesh position={[2.55,1.14,.1]} onClick={e=>{e.stopPropagation();setLampOn(v=>!v)}}><sphereGeometry args={[.24,20,16]}/><meshBasicMaterial color={lampOn?'#ffe2a7':'#847f70'}/></mesh>
 <pointLight ref={lamp} position={[2.55,1.15,.1]} intensity={lampOn?1.5:0} color="#ffd99a" distance={5}/>
 <ambientLight intensity={night?.48:.72}/><hemisphereLight args={['#fff1d8','#71624f',1.1]}/>
 <directionalLight position={[-3,7,4]} intensity={night?.32:weather==='rainy'?.65:1.5} color={night?'#a8c7e1':'#ffe7c5'} castShadow shadow-mapSize={[1024,1024]}/>
 <ContactShadows position={[0,.02,.1]} opacity={.3} scale={11} blur={2.5} far={5}/>
 <OrbitControls makeDefault target={[0,2.2,-2.5]} enablePan={false} minDistance={7} maxDistance={13} minPolarAngle={Math.PI*.27} maxPolarAngle={Math.PI*.53} minAzimuthAngle={-.55} maxAzimuthAngle={.55} enableDamping dampingFactor={.07}/>
 </>}
export default function CurtainScene(){return <Canvas shadows camera={{position:[0,2.9,10.7],fov:43}} dpr={[1,1.5]} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}><Room/></Canvas>}
