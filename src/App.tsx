import { Suspense, useState } from 'react'
import { CloudRain, CloudSun, Moon, Sun, Wind, X, SlidersHorizontal, Sofa, ChevronUp, ChevronDown } from 'lucide-react'
import CurtainScene from './scene/CurtainScene'
import { useStudio, type FabricId } from './store'
const fabrics:Array<{id:FabricId;name:string;zh:string;color:string;note:string}>=[
{id:'sheer',name:'MORNING MIST',zh:'晨雾薄纱',color:'#eee5d1',note:'柔光透入，轻盈朦胧'},
{id:'linen',name:'FOREST LINEN',zh:'森林亚麻',color:'#b9a98c',note:'自然肌理，温暖松弛'},
{id:'velvet',name:'MOSS VELVET',zh:'苔色绒布',color:'#626c59',note:'厚实柔软，沉静有质感'},
{id:'blackout',name:'NIGHT SHADE',zh:'夜幕遮光',color:'#3d5149',note:'收住光线，留一室安宁'}]
export default function App(){
 const [panel,setPanel]=useState(false),[fabricOpen,setFabricOpen]=useState(false)
 const fabric=useStudio(s=>s.fabric),wind=useStudio(s=>s.wind),weather=useStudio(s=>s.weather),hour=useStudio(s=>s.hour),opening=useStudio(s=>s.opening)
 const setFabric=useStudio(s=>s.setFabric),setWind=useStudio(s=>s.setWind),setWeather=useStudio(s=>s.setWeather),setHour=useStudio(s=>s.setHour),setOpening=useStudio(s=>s.setOpening)
 const active=fabrics.find(f=>f.id===fabric)!
 return <main className="room-app">
  <div className="room-canvas"><Suspense fallback={<div className="loading">正在推开木屋的门…</div>}><CurtainScene/></Suspense></div>
  <header className="room-top"><a className="room-logo" href="#"><span>⌂</span><div><b>FOREST WINDOW</b><small>THE LITTLE HOUSE IN THE WOODS</small></div></a><div className="room-top-actions"><span className="room-live"><i/> ROOM 01 · YOUR SPACE</span><button onClick={()=>setWeather(weather==='sunny'?'rainy':'sunny')}>{weather==='sunny'?<CloudRain/>:<CloudSun/>}{weather==='sunny'?'窗外下雨':'雨停了'}</button></div></header>
  <div className="room-instruction"><span>拖动视角，看看房间的每个角落</span><span>DRAG TO EXPLORE</span></div>
  <button className="room-panel-toggle" onClick={()=>setPanel(v=>!v)}><SlidersHorizontal size={15}/><span>房间设置</span>{panel?<ChevronDown size={15}/>:<ChevronUp size={15}/>}</button>
  <section className={panel?'room-panel expanded':'room-panel'}>
   <div className="panel-heading"><div><small>MAKE YOURSELF AT HOME</small><b>调整房间的光与风</b></div><button onClick={()=>setPanel(false)}><X size={17}/></button></div>
   <div className="room-controls">
    <div className="room-control fabric-control"><label>窗帘织物 <small>FABRIC</small></label><button className="fabric-current" onClick={()=>setFabricOpen(v=>!v)}><i style={{background:active.color}}/><span><b>{active.zh}</b><small>{active.name}</small></span><span>⌄</span></button></div>
    <div className="room-control"><label><Wind/> 风的力度</label><div className="wind-choices">{['静止','微风','林风','强风'].map((v,i)=><button key={v} className={wind===i?'active':''} onClick={()=>setWind(i as 0|1|2|3)}>{v}</button>)}</div></div>
    <div className="room-control"><label>{hour>=19?<Moon/>:<Sun/>} 时间与光线</label><div className="range-wrap"><input aria-label="时间与光线" type="range" min="8" max="22" step=".5" value={hour} onChange={e=>setHour(Number(e.target.value))}/><b>{String(Math.floor(hour)).padStart(2,'0')}:{hour%1?'30':'00'}</b></div></div>
    <div className="room-control"><label><Sofa/> 窗帘开合</label><div className="range-wrap"><input aria-label="窗帘开合" type="range" min="0" max="1" step=".01" value={opening} onChange={e=>setOpening(Number(e.target.value))}/><b>{Math.round(opening*100)}%</b></div></div>
   </div>
   {fabricOpen&&<div className="fabric-popover">{fabrics.map(f=><button key={f.id} className={fabric===f.id?'active':''} onClick={()=>{setFabric(f.id);setFabricOpen(false)}}><i style={{background:f.color}}/><span><b>{f.zh}</b><small>{f.note}</small></span>{fabric===f.id?'✓':'+'}</button>)}</div>}
  </section>
  <footer className="room-footer"><span>TAKE YOUR TIME</span><span>木屋里的每一束光，都可以由你决定。</span></footer>
 </main>
}
