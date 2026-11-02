import { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Check, Leaf, Sparkles, Wind } from 'lucide-react'
import { useStudio, type FabricId } from './store'

const fabrics: { id: FabricId; name: string; en: string; price: number; color: string; note: string }[] = [
  { id: 'sheer', name: '晨雾纱', en: 'MORNING MIST', price: 128, color: '#f4ead6', note: '轻盈透光，像清晨的薄雾' },
  { id: 'linen', name: '麦田亚麻', en: 'GOLDEN LINEN', price: 268, color: '#c4ad83', note: '天然肌理，柔软而有分量' },
  { id: 'velvet', name: '苔原绒', en: 'MOSS VELVET', price: 328, color: '#748267', note: '细腻厚实，让空间安静下来' },
  { id: 'blackout', name: '暮色棉', en: 'DUSK COTTON', price: 198, color: '#64716b', note: '柔和遮光，把夜晚留给自己' },
]
const scenes = [
  { name: '山间小屋', en: 'THE HILL HOUSE', line: '风从山谷来，带着青草和阳光的气息。', sky: '#b9d7ce', hill: '#819e78', back: '#a9b98e', sun: '#f7d99a' },
  { name: '森林邮局', en: 'THE FOREST POST', line: '树影摇晃，午后的信还没有写完。', sky: '#c6d7b9', hill: '#718e68', back: '#9daf84', sun: '#f4d79a' },
  { name: '海边阁楼', en: 'THE SEASIDE LOFT', line: '海风穿过窗纱，房间里有咸咸的夏天。', sky: '#b8d6df', hill: '#8aada5', back: '#c2c99f', sun: '#ffe0a5' },
]
function WindowIllustration({ scene, wind, opening, fabric }: { scene: number; wind: number; opening: number; fabric: FabricId }) {
 const s = scenes[scene], cloth = fabrics.find(f => f.id === fabric) ?? fabrics[1]
 return <div className={`window-art wind-${wind}`} style={{ '--cloth': cloth.color, '--open': opening } as React.CSSProperties}>
  <svg viewBox="0 0 900 590" role="img" aria-label="童话房间窗户与随风摆动的窗帘">
   <defs>
    <linearGradient id="paperwall" x2="0" y2="1"><stop stopColor="#f8eedb"/><stop offset="1" stopColor="#e8d6b8"/></linearGradient>
    <linearGradient id="light" x2="1" y2="1"><stop stopColor="#fff6d6" stopOpacity=".8"/><stop offset="1" stopColor="#fff6d6" stopOpacity="0"/></linearGradient>
    <pattern id="weave" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M3 0V14M9 0V14" stroke="#fff" strokeOpacity=".24" strokeWidth="1.5"/></pattern>
    <clipPath id="outside"><rect x="205" y="82" width="490" height="360"/></clipPath>
   </defs>
   <rect width="900" height="590" fill="url(#paperwall)"/>
   <path d="M0 490Q220 465 430 500T900 485V590H0Z" fill="#c4a47d"/>
   <path d="M0 507Q260 480 510 515T900 502" fill="none" stroke="#a98661" strokeWidth="4" opacity=".45"/>
   <rect x="174" y="48" width="552" height="416" rx="9" fill="#876747"/>
   <rect x="188" y="62" width="524" height="388" fill="#f4e6c9"/>
   <g clipPath="url(#outside)">
    <rect x="205" y="82" width="490" height="360" fill={s.sky}/>
    <circle cx="590" cy="160" r="48" fill={s.sun}/>
    <path d="M180 330Q300 220 420 330T720 300V460H180Z" fill={s.back}/>
    <path d="M180 380Q310 285 440 370T720 355V460H180Z" fill={s.hill}/>
    {Array.from({length:12},(_,i)=><g key={i} className="tree" style={{animationDelay:`${i*.13}s`}} transform={`translate(${220+i*42},${355+(i%3)*10})`}><path d="M0 0Q-8 -75 0 -125" stroke="#647a55" strokeWidth="6" fill="none"/><circle cx="-12" cy="-112" r="25" fill={i%2?'#6e8c62':'#849b6d'}/><circle cx="14" cy="-135" r="29" fill={i%2?'#82986d':'#9eae7c'}/></g>)}
    <path d="M205 82L360 82L245 442H205Z" fill="url(#light)"/>
    <path d="M205 262H695M450 82V442" stroke="#f4e7ce" strokeWidth="10"/>
    <path d="M205 262H695M450 82V442" stroke="#9b7c58" strokeWidth="2" opacity=".55"/>
   </g>
   <path d="M165 55Q450 40 735 55" stroke="#75583d" strokeWidth="10" fill="none" strokeLinecap="round"/>
   <g className="curtain-left"><path d="M185 55Q225 65 292 58Q310 180 286 455L185 468Z" fill="var(--cloth)"/><path d="M185 55Q225 65 292 58Q310 180 286 455L185 468Z" fill="url(#weave)"/><path d="M220 65Q250 210 225 460M255 61Q282 220 265 456" stroke="#fff" strokeOpacity=".32" strokeWidth="9" fill="none"/></g>
   <g className="curtain-right"><path d="M715 55Q675 65 608 58Q590 180 614 455L715 468Z" fill="var(--cloth)"/><path d="M715 55Q675 65 608 58Q590 180 614 455L715 468Z" fill="url(#weave)"/><path d="M680 65Q650 210 675 460M645 61Q618 220 635 456" stroke="#fff" strokeOpacity=".32" strokeWidth="9" fill="none"/></g>
   <path d="M158 468Q450 482 742 468L760 492H140Z" fill="#a78058"/>
   <g transform="translate(90 405)"><path d="M0 0Q-15 -100 18 -170M10 -65Q-40 -110 -60 -155M18 -90Q62 -125 70 -175" stroke="#71845d" strokeWidth="8" fill="none"/><ellipse cx="-60" cy="-160" rx="15" ry="31" fill="#8ca174" transform="rotate(-35 -60 -160)"/><ellipse cx="72" cy="-175" rx="16" ry="33" fill="#8ca174" transform="rotate(35 72 -175)"/><path d="M-28 0H48L38 72H-18Z" fill="#b9825c"/></g>
   <g transform="translate(790 430)"><path d="M0 0Q-5 -80 20 -150M8 -55Q-40 -100 -55 -140M18 -75Q60 -110 70 -155" stroke="#71845d" strokeWidth="8" fill="none"/><circle cx="-54" cy="-143" r="23" fill="#81966b"/><circle cx="70" cy="-158" r="26" fill="#9aaa79"/><circle cx="20" cy="-166" r="29" fill="#6e895e"/><path d="M-30 0H45L35 62H-22Z" fill="#c18c67"/></g>
   <text x="450" y="550" textAnchor="middle" fill="#8a7151" fontSize="14" letterSpacing="5">A LITTLE WIND, A LITTLE WONDER</text>
  </svg>
  <span className="art-label">✳ {s.en}</span>
 </div>
}
export default function App() {
 const [scene,setScene]=useState(0),[copied,setCopied]=useState(false)
 const {fabric,wind,opening,width,height,setFabric,setWind,setOpening,setWidth,setHeight}=useStudio()
 const selected=fabrics.find(f=>f.id===fabric)??fabrics[1]
 const estimate=Math.round(width*height/10000*selected.price*1.9/10)*10
 const plan=useMemo(()=>[`CURTAIN TALES / ${scenes[scene].name}`,`面料：${selected.name} / ${selected.en}`,`尺寸：宽 ${width}cm × 高 ${height}cm`,`风感：${['无风','微风','和风','山风'][wind]} · 开窗 ${Math.round(opening*100)}%`,`参考预算：¥${estimate.toLocaleString('zh-CN')}`].join('\n'),[scene,selected,width,height,wind,opening,estimate])
 const copy=async()=>{try{await navigator.clipboard.writeText(plan);setCopied(true);window.setTimeout(()=>setCopied(false),1600)}catch{setCopied(false)}}
 return <main className="tales">
  <header className="topbar"><a className="wordmark" href="#"><span className="mark">✳</span><span>CURTAIN <i>TALES</i><small>THE LITTLE WINDOW STORY</small></span></a><nav><a href="#world">故事场景</a><a href="#fabric">布料花园</a><a href="#measure">定制窗户</a></nav><a className="top-cta" href="#fabric">开始一段故事 <ArrowRight size={15}/></a></header>
  <section className="opening" id="world">
   <div className="opening-copy"><span className="chapter"><Sparkles size={13}/> CHAPTER 01 · THE WIND ARRIVES</span><h1>风来了，<br/><em>窗帘开始讲故事。</em></h1><p>把一点山野、一束阳光和轻轻的风，<br/>带进每天醒来的房间。</p><a className="discover" href="#play">去窗边看看 <ArrowDown size={15}/></a><span className="hand-note">手绘窗边 · 可交互的风之体验</span></div>
   <div className="hero-art" id="play"><WindowIllustration scene={scene} wind={wind} opening={opening} fabric={fabric}/><div className="scene-caption"><span>0{scene+1} / 03</span><b>{scenes[scene].name}</b><small>{scenes[scene].en}</small></div><div className="stamp">A DAY<br/>IN THE<br/>WIND <span>✳</span></div></div>
   <div className="bottom-note">✳ LET THE WIND IN <i>—</i> KEEP THE WONDER CLOSE</div>
  </section>
  <section className="scene-picker"><div className="section-intro"><small>CHOOSE YOUR LITTLE WORLD</small><h2>今天，想住进哪个故事？</h2></div><div className="scene-options">{scenes.map((s,i)=><button key={s.name} className={scene===i?'scene-option active':'scene-option'} onClick={()=>setScene(i)}><span>0{i+1}</span><b>{s.name}</b><small>{s.en}</small></button>)}</div><p>{scenes[scene].line}</p></section>
  <section className="wind-studio"><div><span className="chapter">CHAPTER 02 · PLAY WITH THE BREEZE</span><h2>让风，经过你的窗。</h2><p>拖动风力与开窗幅度，窗帘会用自己的舞步回应。</p></div><div className="wind-controls"><label><span><Wind size={17}/> 风的大小 <b>{['静风','微风','和风','山风'][wind]}</b></span><input type="range" min="0" max="3" step="1" value={wind} onChange={e=>setWind(Number(e.target.value) as 0|1|2|3)}/><small>从安静的呼吸，到森林里的风</small></label><label><span><Leaf size={17}/> 窗户打开 <b>{Math.round(opening*100)}%</b></span><input type="range" min="0" max="1" step=".01" value={opening} onChange={e=>setOpening(Number(e.target.value))}/><small>给风留一条刚刚好的路</small></label></div></section>
  <section className="fabric-garden" id="fabric"><div className="section-intro"><span className="chapter">CHAPTER 03 · THE FABRIC GARDEN</span><h2>摸一摸，风喜欢哪一种。</h2><p>每一块布，都有自己的光泽、重量和舞步。</p></div><div className="fabric-cards">{fabrics.map((f,i)=><button key={f.id} className={fabric===f.id?'fabric-card selected':'fabric-card'} onClick={()=>setFabric(f.id)}><span className="swatch" style={{backgroundColor:f.color}}><i/><i/><i/><b>{fabric===f.id?<Check size={17}/>:String(i+1).padStart(2,'0')}</b></span><span className="fabric-meta"><b>{f.name}</b><small>{f.en}</small><p>{f.note}</p><strong>¥{f.price}<small> / ㎡</small></strong></span></button>)}</div><div className="selected-note">✳ 当前选中：<b>{selected.name}</b>　—　{selected.note}</div></section>
  <section className="measure-section" id="measure"><div className="measure-copy"><span className="chapter">CHAPTER 04 · MADE FOR YOUR WINDOW</span><h2>最后，写下窗的尺寸。</h2><p>让这个故事，刚好落在你的窗边。</p><div className="measure-inputs"><label>窗户宽度 <span>WIDTH</span><div><input type="number" min="60" max="800" value={width} onChange={e=>setWidth(Math.max(60,Math.min(800,Number(e.target.value)||60)))}/> cm</div></label><label>窗户高度 <span>HEIGHT</span><div><input type="number" min="80" max="500" value={height} onChange={e=>setHeight(Math.max(80,Math.min(500,Number(e.target.value)||80)))}/> cm</div></label></div><div className="estimate"><span>一扇窗的参考预算<small>演示估算 · 现场复尺后确认</small></span><b>¥{estimate.toLocaleString('zh-CN')}</b></div><button className="save-plan" onClick={copy}>{copied?'方案已复制':'收藏这扇窗的故事'} {copied?<Check size={17}/>:<ArrowRight size={17}/>}</button></div><div className="postcard"><div className="postcard-art"><div className="post-sun"/><div className="post-hill a"/><div className="post-hill b"/><div className="post-house"><span/></div><div className="post-wind">～　～　～</div></div><span>POSTCARD FROM YOUR WINDOW</span><b>愿每一次风起，<br/>都有柔软的回应。</b><small>CURTAIN TALES · EST. 2026</small></div></section>
  <footer><a className="wordmark" href="#"><span className="mark">✳</span><span>CURTAIN <i>TALES</i><small>THE LITTLE WINDOW STORY</small></span></a><p>让风进来，让日子慢下来。</p><span>© 2026 CURTAIN TALES</span></footer>
 </main>
}
