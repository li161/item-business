import { useMemo, useState, type CSSProperties } from 'react'
import { ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Ruler, Sun, X } from 'lucide-react'

const scenes = [
  { id:'sunlit', title:'光落在亚麻之间', en:'THE SOFT DAYLIGHT', description:'自然光透过轻柔织物，留下层次丰富的明暗与温度。', credit:'Kevin Lieder / Unsplash', href:'https://unsplash.com/photos/cozy-living-room-with-sunlight-streaming-through-sheer-curtains-5T_XETRABHs', image:'https://images.unsplash.com/photo-1783110688413-77aadea9e511?auto=format&fit=crop&w=2600&q=90', position:'center 53%', tag:'客厅 · 自然光' },
  { id:'linen', title:'让空间慢下来', en:'A QUIETER INTERIOR', description:'落地窗与柔和的中性色，让窗帘成为空间安静的边界。', credit:'EZcurtain Life / Unsplash', href:'https://unsplash.com/photos/a-bright-living-room-with-neutral-curtains-G8jWN3-S6XE', image:'https://images.unsplash.com/photo-1754613389131-ea9b5f234cda?auto=format&fit=crop&w=2600&q=90', position:'center 50%', tag:'现代 · 亚麻' },
  { id:'shadow', title:'光影有了形状', en:'LIGHT BECOMES TEXTURE', description:'让窗边的光线与织物纹理，成为房间最自然的装饰。', credit:'Sara / Unsplash', href:'https://unsplash.com/photos/light-streams-through-sheer-curtains-in-a-room-cc_l1L3bsbU', image:'https://images.unsplash.com/photo-1746273246916-9dc919dd136d?auto=format&fit=crop&w=2600&q=90', position:'center 50%', tag:'卧室 · 透光' },
]
const fabrics = [
  {id:'linen',name:'天然亚麻',en:'NATURAL LINEN',color:'#c7b99f',texture:'linen',price:268,note:'天然肌理 · 柔和垂坠 · 半透光',level:'轻柔自然'},
  {id:'cotton',name:'棉麻混纺',en:'COTTON BLEND',color:'#b6aa9b',texture:'cotton',price:198,note:'细腻亲肤 · 日常耐用 · 柔光',level:'日常百搭'},
  {id:'velvet',name:'绒面遮光',en:'VELVET BLACKOUT',color:'#77756d',texture:'velvet',price:328,note:'厚实垂感 · 强遮光 · 静谧感',level:'沉稳私密'},
  {id:'sheer',name:'柔光纱帘',en:'LIGHT SHEER',color:'#e6e1d6',texture:'sheer',price:128,note:'高透光 · 轻盈飘逸 · 柔化直射光',level:'通透轻盈'},
]
type Layer='sheer'|'double'|'blackout'
export default function App(){
 const [activeScene,setActiveScene]=useState(0),[fabric,setFabric]=useState('linen'),[layer,setLayer]=useState<Layer>('double'),[width,setWidth]=useState('280'),[height,setHeight]=useState('260'),[tab,setTab]=useState<'fabric'|'measure'>('fabric'),[showQuote,setShowQuote]=useState(false),[copied,setCopied]=useState(false)
 const scene=scenes[activeScene],selected=fabrics.find(item=>item.id===fabric)??fabrics[0]
 const area=Math.max(0,Number(width)||0)*Math.max(0,Number(height)||0)/10000,layerFactor=layer==='double'?1.7:1
 const estimate=Math.round(area*selected.price*layerFactor*2.1/10)*10
 const layerName=layer==='double'?'纱帘 + 布帘':layer==='sheer'?'单层纱帘':'单层遮光布帘'
 const requestText=`CURTAIN LAB 定制意向\n空间参考：${scene.title}\n面料：${selected.name}\n搭配：${layerName}\n窗宽：${width||'待测量'} cm\n窗高：${height||'待测量'} cm\n演示估算：¥${estimate.toLocaleString('zh-CN')}（非真实报价，需按实际面料与工艺重新核价）`
 const priceLabel=useMemo(()=>estimate>0?`¥${estimate.toLocaleString('zh-CN')}`:'待测量',[estimate])
 const copyRequest=async()=>{try{await navigator.clipboard.writeText(requestText);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{setShowQuote(true)}}
 const prev=()=>setActiveScene(v=>(v+scenes.length-1)%scenes.length),next=()=>setActiveScene(v=>(v+1)%scenes.length)
 return <main className="curtain-app">
  <div className="room-visual">
   {scenes.map((item,index)=><img key={item.id} className={index===activeScene?'room-image is-active':'room-image'} src={item.image} alt={item.title+'真实室内摄影'} style={{objectPosition:item.position}} loading={index===0?'eager':'lazy'}/>)}
   <div className="room-shade"/>
   <header className="topbar">
    <a className="wordmark" href="#" aria-label="Curtain Lab 首页"><span className="wordmark-icon">C</span><span><b>CURTAIN LAB</b><small>WINDOW ATELIER · EST. 2026</small></span></a>
    <nav className="top-nav"><a href="#experience">灵感空间</a><a href="#materials">面料图鉴</a><a href="#process">定制流程</a></nav>
    <button className="top-contact" onClick={()=>setShowQuote(true)}>预约设计 <ArrowRight size={14}/></button>
   </header>
   <section className="hero-message" key={scene.id}><span className="hero-kicker"><i/> {scene.en}</span><h1>{scene.title}</h1><p>{scene.description}</p><div className="hero-bottomline"><span>{scene.tag}</span><span className="hero-index">0{activeScene+1} <i/> 0{scenes.length}</span></div></section>
   <div className="scene-controls"><button onClick={prev} aria-label="上一个空间"><ChevronLeft/></button><div className="scene-pips">{scenes.map((item,index)=><button key={item.id} onClick={()=>setActiveScene(index)} className={activeScene===index?'active':''} aria-label={item.tag}/>)}</div><button onClick={next} aria-label="下一个空间"><ChevronRight/></button></div>
   <div className="photo-credit">REAL INTERIOR PHOTOGRAPHY <span>·</span> <a href={scene.href} target="_blank" rel="noreferrer">{scene.credit}</a></div>
  </div>
  <aside className="design-panel" id="experience">
   <div className="panel-topline"><span>YOUR WINDOW, YOUR WAY</span><span className="live-dot">STUDIO OPEN</span></div>
   <div className="panel-heading"><div><span className="section-number">01 / CONFIGURE</span><h2>定制你的窗边</h2></div><span className="panel-mark">窗</span></div>
   <div className="panel-tabs"><button className={tab==='fabric'?'selected':''} onClick={()=>setTab('fabric')}>01 面料与搭配</button><button className={tab==='measure'?'selected':''} onClick={()=>setTab('measure')}>02 窗户尺寸</button></div>
   {tab==='fabric'?<div className="panel-content" id="materials">
    <div className="field-heading"><span>选择面料</span><small>FABRIC SELECTION</small></div>
    <div className="fabric-list">{fabrics.map(item=><button key={item.id} onClick={()=>setFabric(item.id)} className={fabric===item.id?'fabric-option chosen':'fabric-option'}><span className={'fabric-swatch '+item.texture} style={{'--swatch':item.color} as CSSProperties}>{fabric===item.id&&<Check size={14}/>}</span><span className="fabric-copy"><b>{item.name}</b><small>{item.en}</small></span><span className="fabric-price">¥{item.price}<small>/㎡</small></span></button>)}</div>
    <div className="fabric-note"><span className="note-chip">SELECTED</span><div><b>{selected.level}</b><p>{selected.note}</p></div></div>
    <div className="field-heading layer-heading"><span>窗帘组合</span><small>CURTAIN LAYERS</small></div>
    <div className="layer-options">
     <button className={layer==='sheer'?'layer-option chosen':'layer-option'} onClick={()=>setLayer('sheer')}><span className="layer-icon sheer-icon"/><b>单层纱帘</b><small>保留自然采光</small></button>
     <button className={layer==='double'?'layer-option chosen':'layer-option'} onClick={()=>setLayer('double')}><span className="layer-icon double-icon"/><b>纱布双层</b><small>采光与遮光兼顾</small></button>
     <button className={layer==='blackout'?'layer-option chosen':'layer-option'} onClick={()=>setLayer('blackout')}><span className="layer-icon blackout-icon"/><b>单层遮光</b><small>增强私密与遮光</small></button>
    </div>
    <div className="panel-hint"><Sun size={15}/><span>当前照片用于空间风格参考。面料选择会加入定制清单，不会伪装成照片级实时换布效果。</span></div>
   </div>:<div className="panel-content measure-content">
    <div className="field-heading"><span>输入窗户尺寸</span><small>WINDOW MEASUREMENTS</small></div>
    <div className="measure-visual"><Ruler size={24}/><span>建议测量窗帘轨道宽度与离地高度。暂时没有尺寸也可以先提交咨询。</span></div>
    <label className="measure-field"><span>窗帘宽度 <small>WIDTH</small></span><div><input inputMode="decimal" type="number" min="0" max="2000" value={width} onChange={e=>setWidth(e.target.value)}/><b>cm</b></div></label>
    <label className="measure-field"><span>窗帘高度 <small>HEIGHT</small></span><div><input inputMode="decimal" type="number" min="0" max="1000" value={height} onChange={e=>setHeight(e.target.value)}/><b>cm</b></div></label>
    <div className="measure-tip">尺寸仅用于生成初步预算参考，最终以现场复尺为准。</div>
   </div>}
   <div className="estimate-card"><div><span>ESTIMATED PROJECT PRICE</span><small>交互演示估算 · 非实际报价</small></div><strong>{priceLabel}</strong></div>
   <button className="submit-design" onClick={()=>setShowQuote(true)}>生成我的定制方案 <ArrowRight size={16}/></button>
   <button className="copy-design" onClick={copyRequest}><Copy size={13}/>{copied?'已复制定制清单':'复制当前配置'}</button>
   <div className="panel-foot"><span>MADE FOR YOUR HOME</span><span>01 — 03</span></div>
  </aside>
  <section className="below-content" id="process"><div className="below-intro"><span className="section-number">02 / THE DETAILS</span><h2>好窗帘，不止是好看。</h2><p>从面料触感、光线过滤到安装细节，让每一处选择都回到真实的生活需求。</p></div><div className="detail-cards"><article><span>01</span><h3>真实面料</h3><p>从亚麻肌理到柔光纱线，先看纹理，再决定触感。</p></article><article><span>02</span><h3>光线管理</h3><p>根据朝向与使用习惯，选择透光、半遮光或全遮光组合。</p></article><article><span>03</span><h3>尺寸定制</h3><p>按窗户宽高与安装方式复尺，兼顾褶皱比例和落地效果。</p></article></div></section>
  {showQuote&&<div className="quote-overlay" onClick={()=>setShowQuote(false)}><section className="quote-modal" onClick={event=>event.stopPropagation()}><button className="quote-close" onClick={()=>setShowQuote(false)} aria-label="关闭"><X/></button><span className="section-number">YOUR CURTAIN PLAN</span><h2>你的窗边方案已准备好。</h2><p>这是根据当前选项生成的初步配置。复制清单后，可发送给设计顾问进一步确认面料、尺寸和安装方式。</p><pre>{requestText}</pre><button className="submit-design" onClick={copyRequest}><Copy size={15}/>{copied?'已复制':'复制方案清单'}</button><a href={`mailto:hello@curtainlab.studio?subject=CURTAIN%20LAB%20定制咨询&body=${encodeURIComponent(requestText)}`}>通过邮件咨询 <ArrowRight size={14}/></a></section></div>}
 </main>
}