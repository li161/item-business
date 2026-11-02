import { Suspense, useState } from 'react'
import { ArrowUpRight, CloudRain, CloudSun, Leaf, Moon, Sun, Wind, X, Sparkles } from 'lucide-react'
import CurtainScene from './scene/CurtainScene'
import { useStudio, type FabricId } from './store'

const fabrics: Array<{id:FabricId;name:string;zh:string;color:string;note:string}> = [
 {id:'sheer',name:'MORNING MIST',zh:'晨雾薄纱',color:'#f4ead5',note:'让森林的晨光轻轻落进来'},
 {id:'linen',name:'FOREST LINEN',zh:'森林亚麻',color:'#c8b99b',note:'温暖、自然，带一点树木气息'},
 {id:'velvet',name:'MOSS VELVET',zh:'苔色绒布',color:'#756b60',note:'把黄昏的安静留在房间里'},
 {id:'blackout',name:'NIGHT SHADE',zh:'夜幕遮光',color:'#596b63',note:'给月光留一条小小的缝'},
]
const windLabels=['静止','微风','林间风','山谷风']
export default function App(){
 const [panel,setPanel]=useState<'fabric'|'about'|null>(null)
 const fabric=useStudio(s=>s.fabric),wind=useStudio(s=>s.wind),weather=useStudio(s=>s.weather),hour=useStudio(s=>s.hour),opening=useStudio(s=>s.opening)
 const setFabric=useStudio(s=>s.setFabric),setWind=useStudio(s=>s.setWind),setWeather=useStudio(s=>s.setWeather),setHour=useStudio(s=>s.setHour),setOpening=useStudio(s=>s.setOpening)
 const active=fabrics.find(f=>f.id===fabric)!
 const timeLabel=hour<10?'清晨':hour<15?'午后':hour<19?'黄昏':'星夜'
 return <main className="world">
  <div className="world-scene"><Suspense fallback={<div className="loading-world">森林正在苏醒…</div>}><CurtainScene/></Suspense></div>
  <div className="scene-grain"/>
  <header className="topbar">
   <a className="wordmark" href="#" aria-label="Forest Window"><span className="mark">✳</span><span><b>FOREST WINDOW</b><small>THE WORLD BEHIND THE CURTAIN</small></span></a>
   <div className="top-actions">
    <button className="weather-button" onClick={()=>setWeather(weather==='sunny'?'rainy':'sunny')}>{weather==='sunny'?<CloudRain size={15}/>:<CloudSun size={15}/>}<span>{weather==='sunny'?'下起森林的雨':'雨停了，天晴了'}</span></button>
    <button className="text-button" onClick={()=>setPanel(panel==='fabric'?null:'fabric')}>布料图鉴</button>
    <button className="text-button" onClick={()=>setPanel(panel==='about'?null:'about')}>关于这个世界</button>
   </div>
  </header>
  <section className="intro">
   <div className="eyebrow"><span/> A LITTLE WORLD IN THE WOODS</div>
   <h1>把森林，<br/><em>留在窗边。</em></h1>
   <p>风穿过树梢，也穿过一匹柔软的布。<br/>拉开窗帘，今天的森林正在等你。</p>
   <button className="explore-button" onClick={()=>setPanel('fabric')}>探索窗边的布料 <ArrowUpRight size={16}/></button>
   <div className="chapter-mark"><b>01</b><i/> THE FOREST ROOM</div>
  </section>
  <div className="visitor-tag"><span className="visitor-dot"/><div><b>森林里的朋友</b><small>它正在树下打盹，试着向它问好</small></div><Sparkles size={16}/></div>
  <section className="control-deck">
   <div className="deck-fabric">
    <div className="deck-label"><Leaf size={14}/> 当前织物 <small>FABRIC</small></div>
    <button className="fabric-current" onClick={()=>setPanel('fabric')}><i style={{background:active.color}}/><span><b>{active.zh}</b><small>{active.name}</small></span><ArrowUpRight size={15}/></button>
   </div>
   <div className="deck-separator"/>
   <div className="deck-wind">
    <div className="deck-label"><Wind size={14}/> 风的力度 <small>WIND</small></div>
    <div className="wind-options">{windLabels.map((label,i)=><button key={label} onClick={()=>setWind(i as 0|1|2|3)} className={wind===i?'selected':''}>{label}</button>)}</div>
   </div>
   <div className="deck-separator"/>
   <div className="deck-time">
    <div className="deck-label">{hour>=19||hour<7?<Moon size={14}/>:<Sun size={14}/>} 一天的光线 <small>LIGHT</small></div>
    <div className="range-line"><input aria-label="调整时间" type="range" min="8" max="22" step=".5" value={hour} onChange={e=>setHour(Number(e.target.value))}/><b>{String(Math.floor(hour)).padStart(2,'0')}:{hour%1?'30':'00'}</b><small>{timeLabel}</small></div>
   </div>
   <div className="deck-separator"/>
   <div className="deck-opening">
    <div className="deck-label">窗帘开合 <small>CURTAIN</small></div>
    <div className="range-line"><input aria-label="调整窗帘开合" type="range" min="0" max="1" step=".01" value={opening} onChange={e=>setOpening(Number(e.target.value))}/><b>{Math.round(opening*100)}%</b></div>
   </div>
  </section>
  <div className="bottom-note"><span>TAKE A BREATH · FOLLOW THE WIND</span><span>一扇窗，就是一个小小的世界。</span></div>
  <aside className={panel?'side-panel visible':'side-panel'} aria-hidden={!panel}>
   <button className="panel-close" onClick={()=>setPanel(null)} aria-label="关闭"><X size={18}/></button>
   {panel==='fabric'?<><div className="panel-eyebrow">A TOUCH OF THE FOREST</div><h2>挑一匹布，<br/><em>收藏一种天气。</em></h2><p className="panel-description">不同的织物，会用不同的方式接住阳光、微风和森林的声音。</p>
    <div className="fabric-list">{fabrics.map((f,i)=><button key={f.id} className={fabric===f.id?'fabric-option active':'fabric-option'} onClick={()=>setFabric(f.id)}><span className="fabric-index">0{i+1}</span><i style={{background:f.color}}/><span className="fabric-info"><b>{f.zh}</b><small>{f.note}</small><em>{f.name}</em></span><span className="fabric-check">{fabric===f.id?'✓':'↗'}</span></button>)}</div>
    <div className="panel-tip">✧ 小提示：试着调节风力，看看不同织物如何回应风。</div>
   </>:<><div className="panel-eyebrow">A WINDOW TO ANOTHER WORLD</div><h2>这里没有<br/><em>匆忙的时间。</em></h2><p className="panel-description">这是一个原创的森林童话空间。你可以拉开窗帘、改变天气、等待夜色降临，也可以静静看森林里的朋友醒来。</p><div className="world-facts"><div><CloudSun/><span><b>四时光线</b><small>从清晨到星夜</small></span></div><div><CloudRain/><span><b>天气变化</b><small>晴天与森林细雨</small></span></div><div><Wind/><span><b>真实反馈</b><small>风力影响布料摆动</small></span></div></div><p className="copyright-note">角色与场景采用原创 3D 设计，致敬经典森林童话的温柔氛围，不包含电影原始素材。</p></>}
  </aside>
 </main>
}
