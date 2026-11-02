import { useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, Sun, X } from 'lucide-react'

const scenes = [
  {
    id: 'warm',
    title: '午后柔光',
    subtitle: 'AFTERNOON LIGHT',
    detail: '阳光穿过轻薄纱帘，在木地板上留下温柔的光影。',
    photographer: 'Kevin Lieder',
    photo: 'https://images.unsplash.com/photo-1783110688413-77aadea9e511?auto=format&fit=crop&w=2400&q=88',
    position: 'center 52%',
  },
  {
    id: 'green',
    title: '窗边晨雾',
    subtitle: 'MORNING VEIL',
    detail: '让自然光经过织物过滤，保留空间的明亮与私密。',
    photographer: '王大洪',
    photo: 'https://images.unsplash.com/photo-1768577908037-bbc3da95c1cf?auto=format&fit=crop&w=2400&q=88',
    position: 'center 50%',
  },
  {
    id: 'quiet',
    title: '安静的午后',
    subtitle: 'A QUIET MOMENT',
    detail: '细腻的窗边光线与真实织物纹理，构成房间的情绪。',
    photographer: 'Gunther Samson',
    photo: 'https://images.unsplash.com/photo-1768815151819-14de3e105b66?auto=format&fit=crop&w=2400&q=88',
    position: 'center 50%',
  },
]

export default function App() {
  const [active, setActive] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [zoom, setZoom] = useState(100)
  const [showInfo, setShowInfo] = useState(false)
  const scene = scenes[active]

  const previous = () => setActive((v) => (v + scenes.length - 1) % scenes.length)
  const next = () => setActive((v) => (v + 1) % scenes.length)

  return (
    <main className="photo-studio">
      <div className="photo-stage">
        {scenes.map((item, index) => (
          <img
            key={item.id}
            className={index === active ? 'room-photo active' : 'room-photo'}
            src={item.photo}
            alt={item.title + '，真实室内窗帘摄影'}
            style={{ objectPosition: item.position, filter: `brightness(${brightness}%)`, transform: `scale(${zoom / 100})` }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="photo-vignette" />
      </div>

      <header className="photo-header">
        <a className="photo-brand" href="#" aria-label="CURTAIN LAB 首页">
          <span className="brand-mark">C.</span>
          <span><b>CURTAIN LAB</b><small>WINDOW DESIGN STUDIO</small></span>
        </a>
        <div className="header-center">REAL ROOMS · REAL LIGHT · REAL TEXTURE</div>
        <button className="header-cta" onClick={() => setShowInfo(true)}>预约窗帘设计 <ArrowUpRight size={15} /></button>
      </header>

      <section className="photo-copy" key={scene.id}>
        <div className="eyebrow"><i /> {scene.subtitle}</div>
        <h1>{scene.title}</h1>
        <p>{scene.detail}</p>
        <div className="photo-count"><b>0{active + 1}</b><span />0{scenes.length}</div>
      </section>

      <div className="scene-switcher">
        <button className="switch-arrow" onClick={previous} aria-label="上一张实景"><ChevronLeft /></button>
        <div className="scene-thumbs">
          {scenes.map((item, index) => (
            <button key={item.id} className={index === active ? 'scene-thumb selected' : 'scene-thumb'} onClick={() => setActive(index)} aria-label={item.title}>
              <img src={item.photo} alt="" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
        <button className="switch-arrow" onClick={next} aria-label="下一张实景"><ChevronRight /></button>
      </div>

      <aside className="photo-tools">
        <div className="tools-head"><span>SCENE ADJUSTMENT</span><button onClick={() => { setBrightness(100); setZoom(100) }} aria-label="重置画面"><X size={14}/></button></div>
        <label><span><Sun size={14}/> 自然光强度</span><b>{brightness}%</b></label>
        <input aria-label="自然光强度" type="range" min="70" max="125" value={brightness} onChange={e => setBrightness(Number(e.target.value))}/>
        <label><span><Expand size={14}/> 画面视角</span><b>{zoom}%</b></label>
        <input aria-label="画面视角" type="range" min="100" max="118" value={zoom} onChange={e => setZoom(Number(e.target.value))}/>
        <small>仅调整照片观感，不改变原始窗帘材质。</small>
      </aside>

      <footer className="photo-footer">
        <span>CURTAIN LAB / PHOTO STUDY 0{active + 1}</span>
        <button onClick={() => setShowInfo(true)}>从真实空间开始定制 <ArrowUpRight size={14}/></button>
        <span>摄影：{scene.photographer} · Unsplash</span>
      </footer>

      {showInfo && <div className="info-backdrop" onClick={() => setShowInfo(false)}>
        <section className="info-dialog" onClick={e => e.stopPropagation()}>
          <button className="dialog-close" onClick={() => setShowInfo(false)} aria-label="关闭"><X/></button>
          <span className="eyebrow">PERSONAL WINDOW DESIGN</span>
          <h2>让窗帘回到真实的生活里。</h2>
          <p>告诉我们你的窗户尺寸、空间风格与采光需求，我们将从真实面料与实际空间出发，为你搭配窗帘方案。</p>
          <a href="mailto:hello@curtainlab.studio?subject=CURTAIN%20LAB%20窗帘定制咨询">发送定制咨询 <ArrowUpRight size={15}/></a>
        </section>
      </div>}
    </main>
  )
}
