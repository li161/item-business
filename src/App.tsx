import { Suspense, useMemo, useState } from 'react'
import { Loader } from '@react-three/drei'
import { ArrowDownRight, ArrowUpRight, Check, Minus, Plus, ShoppingBag, Sun, Wind, X } from 'lucide-react'
import CurtainScene from './scene/CurtainScene'
import { useStudio, type FabricId } from './store'

const fabrics: Array<{ id: FabricId; name: string; zh: string; price: number; color: string; light: string }> = [
  { id: 'sheer', name: 'SHEER', zh: '云雾轻纱', price: 268, color: 'rgba(235,231,220,.86)', light: '#e9e5dc' },
  { id: 'linen', name: 'LINEN', zh: '天然亚麻', price: 368, color: '#c8bba4', light: '#b9ad98' },
  { id: 'velvet', name: 'VELVET', zh: '柔雾天鹅绒', price: 528, color: '#62594e', light: '#62594e' },
  { id: 'blackout', name: 'BLACKOUT', zh: '全遮光织物', price: 428, color: '#858176', light: '#858176' },
]
const windLabels = ['静风', '微风', '清风', '强风']
const formatPrice = (value: number) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)

export default function App() {
  const fabric = useStudio((s) => s.fabric)
  const wind = useStudio((s) => s.wind)
  const hour = useStudio((s) => s.hour)
  const opening = useStudio((s) => s.opening)
  const width = useStudio((s) => s.width)
  const height = useStudio((s) => s.height)
  const quantity = useStudio((s) => s.quantity)
  const bag = useStudio((s) => s.bag)
  const setFabric = useStudio((s) => s.setFabric)
  const setWind = useStudio((s) => s.setWind)
  const setHour = useStudio((s) => s.setHour)
  const setOpening = useStudio((s) => s.setOpening)
  const setWidth = useStudio((s) => s.setWidth)
  const setHeight = useStudio((s) => s.setHeight)
  const setQuantity = useStudio((s) => s.setQuantity)
  const addToBag = useStudio((s) => s.addToBag)
  const removeFromBag = useStudio((s) => s.removeFromBag)
  const [panel, setPanel] = useState<'materials' | 'custom' | null>(null)
  const [bagOpen, setBagOpen] = useState(false)
  const active = fabrics.find((item) => item.id === fabric)!
  const area = width * height / 10000
  const total = useMemo(() => area * active.price * quantity, [area, active.price, quantity])
  const bagTotal = bag.reduce((sum, item) => sum + item.price, 0)
  const timeName = hour < 10 ? '清晨' : hour < 15 ? '日光' : hour < 19 ? '黄昏' : '夜晚'

  return (
    <main className="studio">
      <div className="scene-layer">
        <Suspense fallback={<div className="scene-loading">正在构建空间光场…</div>}>
          <CurtainScene />
        </Suspense>
      </div>
      <div className="atmosphere" />
      <header className="header">
        <a className="brand" href="#" aria-label="CURTAIN LAB 首页">
          <span>CURTAIN</span><i>LAB</i><small>FABRIC IN MOTION</small>
        </a>
        <nav className="navigation">
          <button className={panel === 'materials' ? 'nav-active' : ''} onClick={() => setPanel(panel === 'materials' ? null : 'materials')}>COLLECTION <sup>01</sup></button>
          <button className={panel === 'custom' ? 'nav-active' : ''} onClick={() => setPanel(panel === 'custom' ? null : 'custom')}>MADE TO MEASURE <sup>02</sup></button>
        </nav>
        <button className="bag-trigger" onClick={() => setBagOpen(true)} aria-label="打开购物袋">
          <ShoppingBag size={17} /><span>{String(bag.length).padStart(2, '0')}</span>
        </button>
      </header>

      <section className="intro">
        <div className="eyebrow"><span /> A STUDY OF LIGHT & TEXTURE</div>
        <h1>Light, shaped<br /><em>by fabric.</em></h1>
        <p>让光，穿过织物，成为空间的一部分。<br />抓住窗帘，亲手感受每一寸布料的回应。</p>
        <div className="intro-foot"><b>01</b><span /> INTERACTIVE CURTAIN STUDIO</div>
      </section>

      <div className="gesture-hint"><span className="gesture-icon">↔</span><div><b>触摸并拖动窗帘</b><small>GRAB THE FABRIC · MOVE IT FREELY</small></div></div>

      <section className="control-bar">
        <div className="control-block material-control">
          <div className="control-heading">MATERIAL <span>材质探索</span></div>
          <div className="material-swatches">
            {fabrics.map((item, index) => (
              <button key={item.id} className={fabric === item.id ? 'swatch active' : 'swatch'} onClick={() => setFabric(item.id)} aria-label={item.zh} title={item.zh}>
                <span style={{ background: item.color }} /><small>0{index + 1}</small>
              </button>
            ))}
          </div>
          <div className="material-current"><b>{active.name}</b><span>{active.zh}</span></div>
        </div>
        <div className="control-rule" />
        <div className="control-block wind-control">
          <div className="control-heading"><Wind size={13} /> WIND <span>风感</span></div>
          <div className="wind-choices">{windLabels.map((label, index) => <button key={label} className={wind === index ? 'selected' : ''} onClick={() => setWind(index as 0 | 1 | 2 | 3)}>{label}</button>)}</div>
          <div className="wind-lines">{Array.from({ length: 12 }, (_, index) => <i key={index} className={index < wind * 3 ? 'lit' : ''} />)}</div>
        </div>
        <div className="control-rule" />
        <div className="control-block daylight-control">
          <div className="control-heading"><Sun size={13} /> DAYLIGHT <span>昼夜</span></div>
          <div className="range-line"><span>08</span><input type="range" min="8" max="22" step=".5" value={hour} onChange={(event) => setHour(Number(event.target.value))} aria-label="调节昼夜时间" /><span>22</span></div>
          <div className="range-value"><b>{String(Math.floor(hour)).padStart(2, '0')}:{hour % 1 ? '30' : '00'}</b><span>{timeName}</span></div>
        </div>
        <div className="control-rule" />
        <div className="control-block opening-control">
          <div className="control-heading">OPENING <span>窗帘开合</span></div>
          <div className="range-line"><span>闭</span><input type="range" min="0" max="1" step=".01" value={opening} onChange={(event) => setOpening(Number(event.target.value))} aria-label="调节窗帘开合程度" /><span>开</span></div>
          <div className="range-value"><b>{Math.round(opening * 100)}%</b><span>双侧同步</span></div>
        </div>
      </section>

      <aside className={panel ? 'side-panel shown' : 'side-panel'} aria-hidden={!panel}>
        <button className="panel-x" onClick={() => setPanel(null)} aria-label="关闭面板"><X size={17} /></button>
        {panel === 'materials' ? (
          <>
            <div className="panel-eyebrow">01 / THE MATERIAL LIBRARY</div>
            <h2>Find your<br /><em>texture.</em></h2>
            <p className="panel-desc">织物不只是颜色。重量、纤维与透光，共同决定它如何回应光线。</p>
            <div className="fabric-list">
              {fabrics.map((item, index) => (
                <button key={item.id} className={fabric === item.id ? 'fabric-option chosen' : 'fabric-option'} onClick={() => setFabric(item.id)}>
                  <span className="fabric-number">0{index + 1}</span><span className="fabric-sample" style={{ background: item.color }} />
                  <span className="fabric-name"><b>{item.name}</b><small>{item.zh}</small></span>
                  <span className="fabric-price">¥{item.price}<small>/㎡</small></span>{fabric === item.id && <Check size={14} />}
                </button>
              ))}
            </div>
            <div className="panel-footnote">✳ 选择材质后，场景中的布料质感与运动参数会同步更新。</div>
            <button className="dark-action" onClick={() => setPanel('custom')}>开始尺寸定制 <ArrowUpRight size={16} /></button>
          </>
        ) : (
          <>
            <div className="panel-eyebrow">02 / MADE FOR YOUR SPACE</div>
            <h2>Made to<br /><em>measure.</em></h2>
            <p className="panel-desc">输入窗户尺寸，生成你的专属窗帘方案。</p>
            <label className="dimension-field"><span>WIDTH <small>宽度</small></span><div><input type="number" min="60" max="800" value={width} onChange={(event) => setWidth(Number(event.target.value))} /><b>CM</b></div></label>
            <label className="dimension-field"><span>HEIGHT <small>高度</small></span><div><input type="number" min="80" max="500" value={height} onChange={(event) => setHeight(Number(event.target.value))} /><b>CM</b></div></label>
            <div className="estimate-row"><div><span>ESTIMATED AREA</span><b>{area.toFixed(2)} <small>㎡</small></b></div><div><span>FABRIC</span><b>{active.name}</b></div></div>
            <div className="quantity-row"><span>数量 / 套</span><div><button onClick={() => setQuantity(quantity - 1)}><Minus size={13} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={13} /></button></div></div>
            <div className="price-total"><span>ESTIMATED TOTAL</span><b>¥{formatPrice(total)}</b></div>
            <button className="dark-action" onClick={() => { addToBag(total); setBagOpen(true) }}>加入购物袋 <ArrowUpRight size={16} /></button>
            <p className="disclaimer">* 当前为面料估算价，最终价格以现场测量和工艺确认为准。</p>
          </>
        )}
      </aside>

      <footer className="footer">
        <span>DESIGNED AROUND YOU</span><span>LESS INTERFACE. MORE EXPERIENCE.</span>
        <button onClick={() => setPanel('custom')}>CONFIGURE YOUR CURTAIN <ArrowDownRight size={14} /></button>
      </footer>

      {bagOpen && (
        <div className="drawer-scrim" onClick={() => setBagOpen(false)}>
          <section className="bag-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-heading"><div><span>YOUR SELECTION</span><h2>Shopping bag <i>({bag.length})</i></h2></div><button onClick={() => setBagOpen(false)}><X size={19} /></button></div>
            {bag.length ? <>
              <div className="bag-lines">{bag.map((item) => {
                const product = fabrics.find((f) => f.id === item.fabric)!
                return <div className="bag-line" key={item.id}><span className="bag-swatch" style={{ background: product.color }} /><div><b>{product.name}</b><small>{item.width} × {item.height} cm · {item.quantity} 套</small><button onClick={() => removeFromBag(item.id)}>移除</button></div><strong>¥{formatPrice(item.price)}</strong></div>
              })}</div>
              <div className="drawer-total"><span>ESTIMATED TOTAL</span><b>¥{formatPrice(bagTotal)}</b></div>
              <p className="disclaimer">购物袋仅保存当前浏览器会话中的定制方案，暂不包含在线支付。</p>
            </> : <div className="empty-bag"><ShoppingBag size={27} /><p>你的购物袋还是空的</p><button onClick={() => { setBagOpen(false); setPanel('custom') }}>开始定制 <ArrowUpRight size={15} /></button></div>}
          </section>
        </div>
      )}
      <Loader />
    </main>
  )
}
