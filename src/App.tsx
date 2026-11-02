import { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react'

const rooms = [
  { id: 'living', name: 'THE LIVING ROOM', label: '客厅 · 柔和日光', title: '让光，慢一点。', copy: '一层轻纱，过滤刺眼的日光。让空间保留明亮，也保留松弛。', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=90', position: 'center 55%' },
  { id: 'bedroom', name: 'THE BEDROOM', label: '卧室 · 安静私密', title: '把夜晚，留给自己。', copy: '柔软的织物与恰到好处的遮光，让休息成为一种被认真对待的体验。', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=90', position: 'center 50%' },
  { id: 'studio', name: 'THE STUDIO', label: '工作室 · 清透自然', title: '光线，也有秩序。', copy: '控制眩光，保留自然光。为工作、阅读和创造找到合适的亮度。', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90', position: 'center 55%' },
]
const materials = [
  { id: 'linen', name: '原生亚麻', en: 'PURE LINEN', price: 268, light: '柔和漫射', weight: '中等垂感', detail: '保留天然纤维的不规则肌理，越看越有温度。', image: 'https://images.pexels.com/photos/15679399/pexels-photo-15679399/free-photo-of-beige-wrinkled-fabric.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'sheer', name: '雾感纱', en: 'MIST SHEER', price: 128, light: '高透柔光', weight: '轻薄飘逸', detail: '轻盈、通透，让自然光在房间里慢慢散开。', image: 'https://images.pexels.com/photos/16260995/pexels-photo-16260995.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'velvet', name: '绒面遮光', en: 'VELVET DIMOUT', price: 328, light: '低透光', weight: '厚实饱满', detail: '细密绒面与稳定垂坠，适合需要安静的空间。', image: 'https://images.pexels.com/photos/1487821/pexels-photo-1487821.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'cotton', name: '棉麻混纺', en: 'COTTON BLEND', price: 198, light: '温和滤光', weight: '轻中克重', detail: '日常、耐看、容易打理，是空间里的长期主义。', image: 'https://images.pexels.com/photos/5908313/pexels-photo-5908313.jpeg?auto=compress&cs=tinysrgb&w=900' },
]
type Layer = 'single' | 'double' | 'blackout'
const layerOptions: { id: Layer; label: string; en: string; factor: number }[] = [
  { id: 'single', label: '单层纱帘', en: 'SHEER ONLY', factor: 1 },
  { id: 'double', label: '纱 + 布双层', en: 'SHEER + DRAPE', factor: 1.75 },
  { id: 'blackout', label: '单层遮光', en: 'BLACKOUT', factor: 1.25 },
]

export default function App() {
  const [roomIndex, setRoomIndex] = useState(0)
  const [materialId, setMaterialId] = useState('linen')
  const [layer, setLayer] = useState<Layer>('double')
  const [width, setWidth] = useState(280)
  const [height, setHeight] = useState(260)
  const [copied, setCopied] = useState(false)
  const [showBrief, setShowBrief] = useState(false)
  const room = rooms[roomIndex]
  const material = materials.find(item => item.id === materialId) ?? materials[0]
  const selectedLayer = layerOptions.find(item => item.id === layer) ?? layerOptions[1]
  const area = width * height / 10000
  const estimate = Math.round(area * material.price * selectedLayer.factor * 2.1 / 10) * 10
  const brief = useMemo(() => [
    'CURTAIN LAB / DESIGN BRIEF',
    '空间：' + room.label,
    '面料：' + material.name + ' / ' + material.en,
    '组合：' + selectedLayer.label,
    '尺寸：宽 ' + width + ' cm × 高 ' + height + ' cm',
    '参考预算：¥' + estimate.toLocaleString('zh-CN') + '（仅作演示，非正式报价）',
  ].join('\n'), [room, material, selectedLayer, width, height, estimate])
  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setShowBrief(true)
    }
  }
  const changeRoom = (step: number) => setRoomIndex(current => (current + step + rooms.length) % rooms.length)

  return <main className="atelier">
    <section className="hero" style={{ backgroundImage: 'url(' + room.image + ')', backgroundPosition: room.position }}>
      <div className="hero-wash" />
      <header className="masthead">
        <a className="brand" href="#" aria-label="Curtain Lab 首页"><span className="brand-symbol">C.</span><span><b>CURTAIN LAB</b><small>WINDOW ATELIER / 2026</small></span></a>
        <nav><a href="#atelier">设计工作台</a><a href="#materials">面料档案</a><a href="#method">我们的方式</a></nav>
        <button className="masthead-cta" onClick={() => setShowBrief(true)}>开始定制 <ArrowRight size={15}/></button>
      </header>
      <div className="hero-index"><span>01</span><i /> <span>03</span><small>SPACES TO FEEL</small></div>
      <div className="hero-copy" key={room.id}>
        <span className="eyebrow"><i /> {room.name}</span>
        <h1>{room.title}</h1>
        <p>{room.copy}</p>
        <a className="hero-link" href="#atelier">探索窗边方案 <ArrowDown size={14}/></a>
      </div>
      <div className="hero-bottom">
        <div className="room-switcher">
          <button aria-label="上一个空间" onClick={() => changeRoom(-1)}><ChevronLeft size={17}/></button>
          {rooms.map((item, index) => <button key={item.id} className={roomIndex === index ? 'room-dot active' : 'room-dot'} onClick={() => setRoomIndex(index)} aria-label={item.label}><span>0{index + 1}</span><i>{item.label}</i></button>)}
          <button aria-label="下一个空间" onClick={() => changeRoom(1)}><ChevronRight size={17}/></button>
        </div>
        <span className="photo-note">INTERIOR STUDY <i>·</i> IMAGE FOR MOOD REFERENCE</span>
      </div>
      <div className="hero-vertical">LIGHT / TEXTURE / HOME</div>
    </section>

    <section className="workbench" id="atelier">
      <div className="workbench-intro">
        <span className="section-tag">02 / BUILD YOUR CURTAIN</span>
        <h2>从一块布开始，<br/><em>重新安排光。</em></h2>
        <p>不是挑选一个商品，而是为你的窗户找到合适的光线、质感与比例。</p>
        <div className="selected-material">
          <div className="selected-image"><img src={material.image} alt={material.name + '面料实拍'}/><span>SELECTED TEXTURE</span></div>
          <div className="selected-info"><small>当前面料 / {material.en}</small><b>{material.name}</b><p>{material.detail}</p><div><span>{material.light}</span><span>{material.weight}</span></div></div>
        </div>
      </div>
      <div className="configurator">
        <div className="config-head"><div><span className="section-tag">THE MATERIAL BAR</span><h3>选择你的材质</h3></div><span className="step-count">01 <i>/</i> 03</span></div>
        <div className="material-grid" id="materials">
          {materials.map((item, index) => <button key={item.id} className={materialId === item.id ? 'material-tile active' : 'material-tile'} onClick={() => setMaterialId(item.id)}>
            <span className="tile-photo"><img src={item.image} alt={item.name}/>{materialId === item.id && <i><Check size={15}/></i>}<small>0{index + 1}</small></span>
            <span className="tile-name"><b>{item.name}</b><small>{item.en}</small></span><span className="tile-price">¥{item.price}<small>/㎡</small></span>
          </button>)}
        </div>
        <div className="config-divider"/>
        <div className="config-head compact"><div><span className="section-tag">CURTAIN COMPOSITION</span><h3>决定空间的层次</h3></div><span className="step-count">02 <i>/</i> 03</span></div>
        <div className="layer-picker">
          {layerOptions.map(item => <button key={item.id} className={layer === item.id ? 'layer-choice active' : 'layer-choice'} onClick={() => setLayer(item.id)}><span className="layer-lines"><i/><i/></span><b>{item.label}</b><small>{item.en}</small>{layer === item.id && <Check size={13}/>}</button>)}
        </div>
        <div className="config-divider"/>
        <div className="config-head compact"><div><span className="section-tag">WINDOW MEASUREMENTS</span><h3>输入窗户尺寸</h3></div><span className="step-count">03 <i>/</i> 03</span></div>
        <div className="measure-grid">
          <label><span>窗宽 <small>WIDTH</small></span><div><input type="number" min="60" max="1200" value={width} onChange={event => setWidth(Math.max(60, Math.min(1200, Number(event.target.value) || 60)))}/><b>cm</b></div><input className="range" type="range" min="60" max="600" step="10" value={Math.min(width, 600)} onChange={event => setWidth(Number(event.target.value))}/></label>
          <label><span>窗高 <small>HEIGHT</small></span><div><input type="number" min="80" max="600" value={height} onChange={event => setHeight(Math.max(80, Math.min(600, Number(event.target.value) || 80)))}/><b>cm</b></div><input className="range" type="range" min="120" max="400" step="10" value={Math.min(height, 400)} onChange={event => setHeight(Number(event.target.value))}/></label>
        </div>
        <div className="estimate-row"><div><span>ESTIMATED RANGE</span><small>根据面料与尺寸生成 · 非正式报价</small></div><strong>¥{estimate.toLocaleString('zh-CN')}</strong></div>
        <button className="brief-button" onClick={copyBrief}>{copied ? '方案已复制' : '复制我的定制方案'} {copied ? <Check size={16}/> : <ArrowRight size={16}/>}</button>
      </div>
    </section>

    <section className="manifesto" id="method">
      <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85" alt="自然材质与光影交织的室内空间"/><span>THE BEAUTY OF THE EVERYDAY</span></div>
      <div className="manifesto-copy"><span className="section-tag">03 / A MORE THOUGHTFUL WINDOW</span><h2>窗帘不是背景。<br/><em>它决定光如何进入生活。</em></h2><p>我们从空间、朝向、生活习惯和面料本身出发。先理解你需要怎样的光，再决定窗帘应该是什么样子。</p><div className="manifesto-points"><div><b>01</b><span>看空间</span><small>光线方向与室内比例</small></div><div><b>02</b><span>选材质</span><small>触感、垂感与透光表现</small></div><div><b>03</b><span>做定制</span><small>尺寸、褶皱与安装方式</small></div></div></div>
    </section>
    <footer className="footer"><a className="brand dark" href="#"><span className="brand-symbol">C.</span><span><b>CURTAIN LAB</b><small>WINDOW ATELIER / 2026</small></span></a><span>DESIGNED AROUND THE LIGHT.</span><button onClick={() => setShowBrief(true)}>带着你的窗户来 <ArrowRight size={14}/></button></footer>
    {showBrief && <div className="brief-overlay" onClick={() => setShowBrief(false)}><section className="brief-modal" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setShowBrief(false)}>×</button><span className="section-tag">YOUR WINDOW BRIEF</span><h2>把你的想法带走。</h2><p>复制这份配置，继续与设计顾问沟通。实际用料、工艺和价格需现场复尺后确认。</p><pre>{brief}</pre><button className="brief-button" onClick={copyBrief}>{copied ? '已复制' : '复制定制清单'} <Copy size={15}/></button></section></div>}
  </main>
}
