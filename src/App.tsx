import { useRef, useState, type PointerEvent } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, Maximize2, MoveHorizontal, RotateCcw, Sun, Wind, X } from 'lucide-react'
import { useStudio, type FabricId } from './store'

const worlds = [
  { name: '山谷来信', en: 'A LETTER FROM THE VALLEY', sky: '#b8d4c5', far: '#a9b994', near: '#718b70', sun: '#f6d99a', copy: '清晨的风，带着青草和远山的气息。' },
  { name: '森林午后', en: 'AFTERNOON IN THE WOODS', sky: '#c9d7b3', far: '#9eae7f', near: '#617d61', sun: '#f4d59a', copy: '阳光穿过树梢，时间慢得刚刚好。' },
  { name: '海边黄昏', en: 'THE LAST LIGHT BY THE SEA', sky: '#b9d0d6', far: '#c4b99b', near: '#789c9b', sun: '#f6c99a', copy: '潮汐轻轻靠岸，风把夏天留在窗边。' },
]
const fabrics: { id: FabricId; name: string; en: string; color: string; price: number; detail: string }[] = [
  { id: 'sheer', name: '晨雾薄纱', en: 'MORNING SHEER', color: '#eee5d3', price: 128, detail: '让光穿过，也让风留下' },
  { id: 'linen', name: '原野亚麻', en: 'WILD LINEN', color: '#bca77f', price: 268, detail: '天然肌理，安静而有分量' },
  { id: 'velvet', name: '苔色绒布', en: 'MOSS VELVET', color: '#74836b', price: 328, detail: '柔软包裹，收藏一室宁静' },
  { id: 'blackout', name: '暮色棉布', en: 'DUSK COTTON', color: '#596d69', price: 198, detail: '把夜晚留给自己' },
]
const windNames = ['无风', '微风', '和风', '山风']

function Scene({ world, fabric, opening, wind, onPull }: { world: number; fabric: FabricId; opening: number; wind: number; onPull: (e: PointerEvent<SVGGElement>, side: 'left' | 'right') => void }) {
  const w = worlds[world]
  const cloth = fabrics.find(f => f.id === fabric) ?? fabrics[1]
  return <svg className={`storybook-scene wind-level-${wind}`} viewBox="0 0 1000 700" role="img" aria-label="可拖动的童话窗帘场景">
    <defs>
      <linearGradient id="room" x2="0" y2="1"><stop stopColor="#f8f1e4"/><stop offset="1" stopColor="#e7d8bd"/></linearGradient>
      <linearGradient id="sunbeam"><stop stopColor="#fff5d8" stopOpacity=".7"/><stop offset="1" stopColor="#fff5d8" stopOpacity="0"/></linearGradient>
      <pattern id="clothgrain" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M2 0V12M8 0V12" stroke="#fff" strokeOpacity=".18" strokeWidth="1.5"/></pattern>
      <clipPath id="view"><rect x="210" y="100" width="580" height="455" rx="2"/></clipPath>
    </defs>
    <rect width="1000" height="700" fill="url(#room)"/>
    <path d="M0 590Q240 570 490 600T1000 580V700H0Z" fill="#c5a782"/>
    <g clipPath="url(#view)">
      <rect x="210" y="100" width="580" height="455" fill={w.sky}/>
      <circle cx="670" cy="200" r="55" fill={w.sun}/>
      <path d="M170 405Q340 230 500 395T850 370V580H170Z" fill={w.far}/>
      <path d="M170 465Q370 330 540 455T850 420V580H170Z" fill={w.near}/>
      {Array.from({length:15},(_,i)=><g key={i} className="land-tree" style={{animationDelay:`${i*.11}s`}} transform={`translate(${235+i*39},${465+(i%3)*12})`}><path d="M0 0V-110" stroke="#5e775b" strokeWidth="7"/><circle cx="-15" cy="-105" r="25" fill={i%2?'#79936b':'#91a477'}/><circle cx="15" cy="-127" r="29" fill={i%2?'#8ca078':'#6f8a65'}/></g>)}
      <path d="M210 100L410 100L280 555H210Z" fill="url(#sunbeam)"/>
      <path d="M500 100V555M210 327H790" stroke="#f3e8d2" strokeWidth="13"/>
    </g>
    <rect x="190" y="80" width="620" height="495" rx="8" fill="none" stroke="#8c6d4c" strokeWidth="20"/>
    <path d="M165 72Q500 55 835 72" stroke="#75583d" strokeWidth="13" strokeLinecap="round" fill="none"/>
    <g className="drape left-drape" style={{ transform: `translateX(${-opening*145}px)` }} onPointerDown={e=>onPull(e,'left')} onPointerMove={e=>{}}><path d="M185 75Q250 95 365 80Q385 265 345 575L185 590Z" fill={cloth.color}/><path d="M185 75Q250 95 365 80Q385 265 345 575L185 590Z" fill="url(#clothgrain)"/><path d="M235 88Q270 260 235 580M292 85Q325 270 295 580" stroke="#fff" strokeOpacity=".35" strokeWidth="12" fill="none"/><path d="M185 75Q250 95 365 80" stroke="#8b7457" strokeWidth="5" fill="none"/><circle cx="274" cy="100" r="9" fill="#d7c29b"/></g>
    <g className="drape right-drape" style={{ transform: `translateX(${opening*145}px)` }} onPointerDown={e=>onPull(e,'right')}><path d="M815 75Q750 95 635 80Q615 265 655 575L815 590Z" fill={cloth.color}/><path d="M815 75Q750 95 635 80Q615 265 655 575L815 590Z" fill="url(#clothgrain)"/><path d="M765 88Q730 260 765 580M708 85Q675 270 705 580" stroke="#fff" strokeOpacity=".35" strokeWidth="12" fill="none"/><path d="M815 75Q750 95 635 80" stroke="#8b7457" strokeWidth="5" fill="none"/><circle cx="726" cy="100" r="9" fill="#d7c29b"/></g>
    <path d="M175 590Q500 610 825 590L850 620H150Z" fill="#a78159"/>
    <g className="room-plant" transform="translate(95 550)"><path d="M0 0Q-15 -115 5 -195M4 -85Q-55 -130 -68 -175M6 -105Q65 -140 75 -200" stroke="#6d835e" strokeWidth="9" fill="none"/><ellipse cx="-68" cy="-177" rx="17" ry="34" fill="#879c70" transform="rotate(-35 -68 -177)"/><ellipse cx="76" cy="-201" rx="18" ry="36" fill="#9baa79" transform="rotate(35 76 -201)"/><path d="M-36 0H45L35 82H-25Z" fill="#b77e59"/></g>
    <text x="500" y="665" textAnchor="middle" fill="#927b5a" fontSize="13" letterSpacing="5">PULL THE CURTAINS · LET THE STORY BEGIN</text>
  </svg>
}

export default function App() {
  const { fabric, wind, opening, width, height, setFabric, setWind, setOpening, setWidth, setHeight } = useStudio()
  const [world,setWorld]=useState(0)
  const [chapter,setChapter]=useState<'window'|'fabric'|'measure'>('window')
  const [showMeasure,setShowMeasure]=useState(false)
  const [copied,setCopied]=useState(false)
  const drag=useRef<{x:number;opening:number;side:'left'|'right'}|null>(null)
  const selected=fabrics.find(f=>f.id===fabric)??fabrics[1]
  const estimate=Math.round(width*height/10000*selected.price*1.9/10)*10
  const startPull=(e:PointerEvent<SVGGElement>,side:'left'|'right')=>{
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current={x:e.clientX,opening,side}
  }
  const movePull=(e:PointerEvent<HTMLDivElement>)=>{
    if(!drag.current)return
    const delta=(e.clientX-drag.current.x)/Math.max(260,e.currentTarget.clientWidth)*2.1
    setOpening(Math.max(0,Math.min(1,drag.current.opening+(drag.current.side==='left'? -delta:delta))))
  }
  const finishPull=()=>{drag.current=null}
  const copyPlan=async()=>{
    const content=`CURTAIN TALES / ${worlds[world].name}\n面料：${selected.name}\n尺寸：${width} × ${height} cm\n预算参考：¥${estimate}`
    try{await navigator.clipboard.writeText(content);setCopied(true);window.setTimeout(()=>setCopied(false),1500)}catch{setCopied(false)}
  }
  return <main className="tales-new">
    <header className="nav-new"><a className="brand-new" href="#top"><span>✳</span> CURTAIN TALES <small>WINDOWS INTO WONDER</small></a><div className="nav-chapters"><button className={chapter==='window'?'active':''} onClick={()=>{setChapter('window');document.getElementById('experience')?.scrollIntoView({behavior:'smooth'})}}>01 窗边</button><button className={chapter==='fabric'?'active':''} onClick={()=>{setChapter('fabric');document.getElementById('materials')?.scrollIntoView({behavior:'smooth'})}}>02 面料</button><button className={chapter==='measure'?'active':''} onClick={()=>{setChapter('measure');setShowMeasure(true)}}>03 定制</button></div><button className="nav-action" onClick={()=>setShowMeasure(true)}>设计我的窗 <ArrowRight size={15}/></button></header>
    <section className="hero-new" id="top">
      <div className="hero-topline"><span>AN INTERACTIVE CURTAIN ATELIER</span><span>VOL. 01 — THE WIND COLLECTION</span></div>
      <div className="hero-title"><span className="eyebrow">✳ 一扇窗，就是一个小小的世界</span><h1>把风，<em>请进来。</em></h1><p>不是挑选一块窗帘，而是亲手编排光、风与房间的关系。</p></div>
      <div className="experience" id="experience">
        <div className="scene-head"><div><span>YOUR WINDOW / 0{world+1}</span><h2>{worlds[world].name}</h2><p>{worlds[world].copy}</p></div><div className="world-switch"><button aria-label="上一个场景" onClick={()=>setWorld((world+2)%3)}><ArrowLeft/></button><span>0{world+1} <i>/ 03</i></span><button aria-label="下一个场景" onClick={()=>setWorld((world+1)%3)}><ArrowRight/></button></div></div>
        <div className="stage-wrap" onPointerMove={movePull} onPointerUp={finishPull} onPointerCancel={finishPull}>
          <Scene world={world} fabric={fabric} opening={opening} wind={wind} onPull={startPull}/>
          <div className="stage-hint"><MoveHorizontal size={14}/> 按住窗帘边缘，向两侧拉开</div>
          <div className="stage-side-label">{worlds[world].en}</div>
          <div className="wind-indicator"><span className="wind-dot"/><span>{windNames[wind]}</span><small>WIND / LIVE</small></div>
        </div>
        <div className="stage-controls"><div className="wind-control"><span><Wind size={16}/> 风的力度</span><div className="wind-steps">{windNames.map((name,i)=><button key={name} onClick={()=>setWind(i as 0|1|2|3)} className={wind===i?'active':''}><i/>{name}</button>)}</div></div><div className="opening-control"><span>窗帘开合</span><input aria-label="窗帘开合" type="range" min="0" max="1" step=".01" value={opening} onChange={e=>setOpening(Number(e.target.value))}/><b>{Math.round(opening*100)}%</b><button aria-label="重置窗帘" onClick={()=>setOpening(.28)}><RotateCcw size={14}/></button></div></div>
      </div>
      <div className="hero-foot"><span>SCROLL TO COMPOSE YOUR SPACE</span><ArrowDown size={16}/><span>01 / 03</span></div>
    </section>
    <section className="materials-new" id="materials">
      <div className="section-kicker">02 — TOUCH THE TEXTURE</div><div className="material-heading"><h2>让光，落在不同的质地上。</h2><p>选择面料，窗边的整个世界都会随之改变。</p></div>
      <div className="material-layout"><div className="fabric-list">{fabrics.map((f,i)=><button key={f.id} className={fabric===f.id?'fabric-row chosen':'fabric-row'} onClick={()=>setFabric(f.id)}><span className="fabric-number">0{i+1}</span><span className="fabric-chip" style={{'--fabric':f.color} as React.CSSProperties}/><span className="fabric-name"><b>{f.name}</b><small>{f.en}</small></span><span className="fabric-detail">{f.detail}</span><span className="fabric-price">¥{f.price}<small>/㎡</small></span>{fabric===f.id&&<Check size={17}/>}</button>)}</div><div className="material-note"><div className="fabric-large" style={{'--fabric':selected.color} as React.CSSProperties}><span/><span/><span/><i>TEXTURE STUDY / 0{fabrics.findIndex(f=>f.id===fabric)+1}</i></div><div><small>NOW IN YOUR WINDOW</small><h3>{selected.name}</h3><p>{selected.detail}。让材质本身，成为空间的情绪。</p></div></div></div>
    </section>
    <section className="measure-new" id="measure"><div><span className="section-kicker">03 — MADE FOR YOUR WINDOW</span><h2>给这段风景，<br/><em>一个刚好的尺寸。</em></h2><p>输入窗户尺寸，生成你的专属窗边提案。</p><button className="measure-open" onClick={()=>setShowMeasure(true)}>打开尺寸工作台 <Maximize2 size={15}/></button></div><div className="measure-preview"><div className="mini-window"><div className="mini-sun"/><div className="mini-hill"/><div className="mini-curtain"/></div><span>YOUR WINDOW, YOUR WEATHER.</span><b>{width} × {height} <small>CM</small></b><small>ESTIMATED FROM ¥{estimate.toLocaleString('zh-CN')}</small></div></section>
    <footer className="footer-new"><span>✳ CURTAIN TALES</span><p>让风进来，让日子慢下来。</p><small>AN OPEN WINDOW TO A SMALLER, SOFTER WORLD · 2026</small></footer>
    {showMeasure&&<div className="measure-overlay" onClick={()=>setShowMeasure(false)}><section className="measure-drawer" onClick={e=>e.stopPropagation()}><button className="drawer-close" onClick={()=>setShowMeasure(false)} aria-label="关闭"><X/></button><span className="section-kicker">YOUR WINDOW / CUSTOM STUDIO</span><h2>把尺寸，交给这扇窗。</h2><p>我们会根据面料与尺寸，给出一份初步预算。</p><div className="dimension-fields"><label>宽度 / WIDTH<input type="number" min="60" max="800" value={width} onChange={e=>setWidth(Math.max(60,Math.min(800,Number(e.target.value)||60)))}/> <small>CM</small></label><label>高度 / HEIGHT<input type="number" min="80" max="500" value={height} onChange={e=>setHeight(Math.max(80,Math.min(500,Number(e.target.value)||80)))}/> <small>CM</small></label></div><div className="drawer-summary"><span>当前面料 <b>{selected.name}</b></span><span>参考预算 <strong>¥{estimate.toLocaleString('zh-CN')}</strong></span></div><button className="copy-proposal" onClick={copyPlan}>{copied?<><Check size={16}/> 提案已复制</>:<>复制我的窗边提案 <ArrowRight size={16}/></>}</button><small className="estimate-disclaimer">演示估算，最终价格以现场测量与方案确认为准。</small></section></div>}
    <button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><ChevronDown size={16}/></button>
  </main>
}
