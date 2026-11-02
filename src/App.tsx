import { Suspense, useMemo, useState } from 'react'
import { Loader } from '@react-three/drei'
import { ArrowDownRight, ArrowUpRight, ShoppingBag, SlidersHorizontal, Wind, Sun, Moon, MoveHorizontal, Plus, Minus, Check } from 'lucide-react'
import CurtainScene from './scene/CurtainScene'
import { useStudio, type FabricId } from './store'

const fabrics: { id: FabricId; name: string; label: string; price: number; light: string }[] = [
  { id: 'sheer', name: 'AIRY SHEER', label: '轻盈透光纱', price: 268, light: '#e8e5dc' },
  { id: 'linen', name: 'NATURAL LINEN', label: '亚麻肌理', price: 368, light: '#b9ad98' },
  { id: 'velvet', name: 'SOFT VELVET', label: '柔雾绒面', price: 528, light: '#555047' },
  { id: 'blackout', name: 'TOTAL BLACKOUT', label: '全遮光织物', price: 428, light: '#77756d' },
]
const windNames = ['静止', '微风', '清风', '强风']
const money = (n: number) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(n)

export default function App() {
  const fabric = useStudio((s) => s.fabric)
  const wind = useStudio((s) => s.wind)
  const hour = useStudio((s) => s.hour)
  const open = useStudio((s) => s.open)
  const width = useStudio((s) => s.width)
  const height = useStudio((s) => s.height)
  const quantity = useStudio((s) => s.quantity)
  const bagCount = useStudio((s) => s.bagCount)
  const setFabric = useStudio((s) => s.setFabric)
  const setWind = useStudio((s) => s.setWind)
  const setHour = useStudio((s) => s.setHour)
  const setOpen = useStudio((s) => s.setOpen)
  const setWidth = useStudio((s) => s.setWidth)
  const setHeight = useStudio((s) => s.setHeight)
  const setQuantity = useStudio((s) => s.setQuantity)
  const addToBag = useStudio((s) => s.addToBag)
  const [panel, setPanel] = useState<'material' | 'custom' | null>('material')
  const [bagOpen, setBagOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const active = fabrics.find((f) => f.id === fabric)!
  const area = width * height / 10000
  const total = useMemo(() => area * active.price * quantity, [area, active.price, quantity])
  const timeLabel = hour < 10 ? '早晨' : hour < 15 ? '日光' : hour < 19 ? '黄昏' : '夜晚'

  return (
    <main className="app-shell">
      <div className="scene-wrap"><Suspense fallback={null}><CurtainScene /></Suspense></div>
      <div className="scene-vignette" />
      <header className="topbar">
        <a className="wordmark" href="#"><span>CURTAIN</span><i>LAB</i><small>FABRIC IN MOTION · 2026</small></a>
        <nav className="main-nav">
          <button className={panel === 'material' ? 'active' : ''} onClick={() => setPanel(panel === 'material' ? null : 'material')}>COLLECTION <span>01</span></button>
          <button className={panel === 'custom' ? 'active' : ''} onClick={() => setPanel(panel === 'custom' ? null : 'custom')}>CUSTOM <span>02</span></button>
          <button onClick={() => setBagOpen(true)}>BAG <span>{String(bagCount).padStart(2, '0')}</span></button>
        </nav>
        <button className="bag-icon" onClick={() => setBagOpen(true)} aria-label="打开购物袋"><ShoppingBag size={18} /><b>{bagCount}</b></button>
      </header>

      <section className="hero-copy">
        <div className="eyebrow"><span className="live-dot" /> THE ART OF NATURAL LIGHT</div>
        <h1>Let light<br /><em>find its form.</em></h1>
        <p>让光，找到它的形状。<br />触摸织物，感受光线与空间的关系。</p>
        <div className="hero-index"><span>01 / 04</span><div /><span>INTERACTIVE FABRIC STUDIO</span></div>
      </section>

      <div className="drag-hint"><MoveHorizontal size={15} /><span>按住窗帘并拖动</span><small>DRAG TO FEEL THE FABRIC</small></div>

      <section className="control-dock" aria-label="窗帘交互控制">
        <div className="dock-group fabric-group">
          <div className="dock-label">FABRIC <span>面料</span></div>
          <div className="swatches">
            {fabrics.map((item, i) => <button key={item.id} className={fabric === item.id ? 'swatch selected' : 'swatch'} onClick={() => setFabric(item.id)} title={item.label}>
              <span style={{ background: item.light }} />
              <small>0{i + 1}</small>
            </button>)}
          </div>
          <div className="fabric-caption"><b>{active.name}</b><span>{active.label}</span></div>
        </div>
        <div className="dock-separator" />
        <div className="dock-group wind-group">
          <div className="dock-label"><Wind size={13} /> WIND <span>风感</span></div>
          <div className="wind-options">{windNames.map((name, i) => <button key={name} className={wind === i ? 'chosen' : ''} onClick={() => setWind(i as 0 | 1 | 2 | 3)}>{name}</button>)}</div>
          <div className="wind-meter">{[0,1,2,3,4,5,6,7,8,9,10,11].map((n) => <i key={n} className={n < wind * 3 ? 'lit' : ''} />)}</div>
        </div>
        <div className="dock-separator" />
        <div className="dock-group light-group">
          <div className="dock-label"><Sun size={13} /> DAYLIGHT <span>光线</span></div>
          <div className="time-row"><Moon size={13} /><input aria-label="调节时间" type="range" min="8" max="22" step=".5" value={hour} onChange={(e) => setHour(Number(e.target.value))} /><Sun size={14} /></div>
          <div className="time-caption"><b>{String(Math.floor(hour)).padStart(2,'0')}:{hour % 1 ? '30' : '00'}</b><span>{timeLabel}</span></div>
        </div>
        <div className="dock-separator" />
        <div className="dock-group open-group">
          <div className="dock-label">OPENING <span>开合</span></div>
          <div className="time-row"><span className="tiny-label">CLOSE</span><input aria-label="调节窗帘开合" type="range" min="0" max=".78" step=".01" value={open} onChange={(e) => setOpen(Number(e.target.value))} /><span className="tiny-label">OPEN</span></div>
          <div className="time-caption"><b>{Math.round(open * 100)}%</b><span>左右同步</span></div>
        </div>
      </section>

      <aside className={panel ? 'side-panel visible' : 'side-panel'}>
        <button className="panel-close" onClick={() => setPanel(null)}>×</button>
        {panel === 'material' ? <>
          <div className="panel-kicker">01 — MATERIAL LIBRARY</div>
          <h2>Choose your<br /><em>texture.</em></h2>
          <p className="panel-intro">不同织物，拥有不同的重量、透光与垂坠。</p>
          <div className="material-list">{fabrics.map((f, i) => <button key={f.id} className={fabric === f.id ? 'material-row current' : 'material-row'} onClick={() => setFabric(f.id)}>
            <span className="material-no">0{i + 1}</span><span className="material-chip" style={{ background: f.light }} /><span className="material-info"><b>{f.name}</b><small>{f.label}</small></span><span className="material-price">¥{f.price}<small>/㎡</small></span>{fabric === f.id && <Check size={15} />}
          </button>)}</div>
          <div className="panel-note"><span>✳</span> 材质切换会同步改变布料的质感与动态表现。</div>
          <button className="panel-action" onClick={() => setPanel('custom')}>配置我的窗帘 <ArrowUpRight size={16} /></button>
        </> : <>
          <div className="panel-kicker">02 — MADE FOR YOUR SPACE</div>
          <h2>Made to<br /><em>measure.</em></h2>
          <p className="panel-intro">输入窗户尺寸，实时计算专属方案。</p>
          <div className="measure-field"><label>WIDTH <span>宽度 / cm</span></label><div><input type="number" min="60" max="800" value={width} onChange={(e) => setWidth(Math.max(60, Number(e.target.value)))} /><span>CM</span></div></div>
          <div className="measure-field"><label>HEIGHT <span>高度 / cm</span></label><div><input type="number" min="80" max="500" value={height} onChange={(e) => setHeight(Math.max(80, Number(e.target.value)))} /><span>CM</span></div></div>
          <div className="measure-summary"><div><span>ESTIMATED AREA</span><b>{area.toFixed(2)} <small>㎡</small></b></div><div><span>FABRIC</span><b>{active.name}</b></div></div>
          <div className="quantity-row"><span>数量 / 套</span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={13} /></button><b>{quantity}</b><button onClick={() => setQuantity(Math.min(20, quantity + 1))}><Plus size={13} /></button></div></div>
          <div className="total-price"><span>ESTIMATED TOTAL</span><b>¥{money(total)}</b></div>
          <button className="panel-action" onClick={() => { addToBag(); setAdded(true); setBagOpen(true) }}>{added ? '已加入购物袋' : '加入购物袋'} <ArrowUpRight size={16} /></button>
          <p className="fine-print">* 价格为面料估算价，最终报价以实际测量及工艺确认为准。</p>
        </>}
      </aside>

      <footer className="bottom-meta"><span>DESIGNED AROUND YOU</span><span>SCROLL LESS. FEEL MORE.</span><button onClick={() => setPanel('custom')}>START YOUR CONFIGURATION <ArrowDownRight size={14} /></button></footer>

      {bagOpen && <div className="drawer-backdrop" onClick={() => setBagOpen(false)}><section className="bag-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head"><div><span>YOUR SELECTION</span><h2>Shopping bag <i>({bagCount})</i></h2></div><button onClick={() => setBagOpen(false)}>×</button></div>
        {bagCount ? <><div className="bag-item"><span className="bag-fabric" style={{ background: active.light }} /><div><b>{active.name}</b><small>{width} × {height} cm · {bagCount} 套</small></div><strong>¥{money(total)}</strong></div><div className="bag-total"><span>ESTIMATED TOTAL</span><b>¥{money(total)}</b></div><button className="panel-action" onClick={() => setBagOpen(false)}>继续探索 <ArrowUpRight size={16} /></button></> : <div className="empty-bag"><ShoppingBag size={28} /><p>你的购物袋还是空的</p><button onClick={() => { setBagOpen(false); setPanel('custom') }}>开始定制 <ArrowUpRight size={15} /></button></div>}
      </section></div>}
      <Loader />
    </main>
  )
}