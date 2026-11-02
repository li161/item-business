import { Suspense, useMemo, useState } from 'react'
import { Loader } from '@react-three/drei'
import { ArrowUpRight, Minus, Plus, ShoppingBag, Sun, Wind, X, Sparkles, Leaf } from 'lucide-react'
import CurtainScene from './scene/CurtainScene'
import { useStudio, type FabricId } from './store'

const fabrics: Array<{ id: FabricId; name: string; zh: string; price: number; color: string; note: string }> = [
  { id: 'sheer', name: 'MIST VEIL', zh: '云朵薄纱', price: 268, color: '#eee9dc', note: '让晨光轻轻穿过' },
  { id: 'linen', name: 'FOREST LINEN', zh: '森林亚麻', price: 368, color: '#c7b99d', note: '自然、温柔、有呼吸感' },
  { id: 'velvet', name: 'DUSK VELVET', zh: '暮色绒布', price: 528, color: '#766b59', note: '把黄昏留在房间里' },
  { id: 'blackout', name: 'MOON SHADOW', zh: '月影遮光', price: 428, color: '#85877a', note: '为夜晚留一份安静' },
]
const winds = ['无风', '微风', '清风', '大风']
const money = (n: number) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(n)

export default function App() {
  const fabric = useStudio(s => s.fabric), wind = useStudio(s => s.wind), hour = useStudio(s => s.hour)
  const opening = useStudio(s => s.opening), width = useStudio(s => s.width), height = useStudio(s => s.height)
  const quantity = useStudio(s => s.quantity), bag = useStudio(s => s.bag)
  const setFabric = useStudio(s => s.setFabric), setWind = useStudio(s => s.setWind), setHour = useStudio(s => s.setHour)
  const setOpening = useStudio(s => s.setOpening), setWidth = useStudio(s => s.setWidth), setHeight = useStudio(s => s.setHeight)
  const setQuantity = useStudio(s => s.setQuantity), addToBag = useStudio(s => s.addToBag), removeFromBag = useStudio(s => s.removeFromBag)
  const [panel, setPanel] = useState<'materials' | 'custom' | null>(null)
  const [bagOpen, setBagOpen] = useState(false)
  const active = fabrics.find(f => f.id === fabric)!
  const area = width * height / 10000
  const total = useMemo(() => area * active.price * quantity, [area, active.price, quantity])
  const bagTotal = bag.reduce((sum, item) => sum + item.price, 0)
  const period = hour < 10 ? '清晨' : hour < 15 ? '午后' : hour < 19 ? '黄昏' : '星夜'

  return <main className="storybook">
    <div className="scene-layer"><Suspense fallback={<div className="scene-loading">小小的世界正在醒来…</div>}><CurtainScene /></Suspense></div>
    <div className="paint-wash" />
    <header className="story-header">
      <a className="story-brand" href="#" aria-label="风之窗首页"><span className="brand-mark">✳</span><span>WIND GARDEN<small>THE LITTLE WORLD BEHIND YOUR WINDOW</small></span></a>
      <nav><button onClick={() => setPanel(panel === 'materials' ? null : 'materials')}>织物图鉴</button><button onClick={() => setPanel(panel === 'custom' ? null : 'custom')}>为你定制</button></nav>
      <button className="bag-button" onClick={() => setBagOpen(true)} aria-label="打开收藏篮"><ShoppingBag size={17}/><span>{bag.length}</span></button>
    </header>

    <section className="story-copy">
      <div className="chapter"><span>✦</span> 森林里的第一缕风 · CHAPTER 01</div>
      <h1>让风，住进<br/><em>你的窗户。</em></h1>
      <p>推开窗，森林就醒了。<br/>选一片喜欢的云，让阳光替你挑选窗帘。</p>
      <button className="discover" onClick={() => setPanel('materials')}>去森林里挑一匹布 <ArrowUpRight size={16}/></button>
      <div className="story-caption"><span>01 / 04</span><i/> A WINDOW TO A SMALLER WORLD</div>
    </section>

    <div className="sprite-note"><span className="sparkle">✧</span><div><b>森林守护者在这里</b><small>找到灰色小精灵，点击它试试</small></div></div>

    <section className="storybook-dock">
      <div className="dock-material">
        <div className="dock-label"><Leaf size={13}/> 今日的布料 <small>FABRIC</small></div>
        <div className="fabric-pills">{fabrics.map((f,i)=><button key={f.id} onClick={()=>setFabric(f.id)} className={fabric===f.id?'fabric-pill active':'fabric-pill'} title={f.zh}><i style={{background:f.color}}/><span>{['薄纱','亚麻','绒布','遮光'][i]}</span></button>)}</div>
      </div>
      <div className="dock-divider"/>
      <div className="dock-control wind-dock"><div className="dock-label"><Wind size={13}/> 风的方向 <small>WIND</small></div><div className="wind-pills">{winds.map((w,i)=><button key={w} onClick={()=>setWind(i as 0|1|2|3)} className={wind===i?'active':''}>{w}</button>)}</div></div>
      <div className="dock-divider"/>
      <div className="dock-control time-dock"><div className="dock-label"><Sun size={13}/> 一天的颜色 <small>TIME</small></div><div className="time-line"><input aria-label="调节时间" type="range" min="8" max="22" step=".5" value={hour} onChange={e=>setHour(Number(e.target.value))}/><b>{String(Math.floor(hour)).padStart(2,'0')}:{hour%1?'30':'00'}</b><small>{period}</small></div></div>
      <div className="dock-divider"/>
      <div className="dock-control opening-dock"><div className="dock-label">窗帘开合 <small>OPEN</small></div><div className="time-line"><input aria-label="调节窗帘开合" type="range" min="0" max="1" step=".01" value={opening} onChange={e=>setOpening(Number(e.target.value))}/><b>{Math.round(opening*100)}%</b></div></div>
      <button className="custom-round" onClick={()=>setPanel('custom')} aria-label="定制窗帘"><Sparkles size={18}/><span>定制</span></button>
    </section>

    <aside className={panel?'storybook-panel open':'storybook-panel'} aria-hidden={!panel}>
      <button className="close-panel" onClick={()=>setPanel(null)} aria-label="关闭"><X size={18}/></button>
      {panel==='materials'?<><div className="panel-kicker">A LITTLE FABRIC ATLAS</div><h2>森林的<br/><em>四种颜色。</em></h2><p className="panel-intro">每一匹布，都藏着一种天气。选中它，看看光会变成什么模样。</p>
        <div className="storybook-fabrics">{fabrics.map((f,i)=><button key={f.id} className={fabric===f.id?'storybook-fabric chosen':'storybook-fabric'} onClick={()=>setFabric(f.id)}><span className="fabric-number">0{i+1}</span><i style={{background:f.color}}/><span className="fabric-desc"><b>{f.zh}</b><small>{f.note}</small></span><strong>¥{f.price}<small>/㎡</small></strong></button>)}</div>
        <div className="fairy-tip">✧ 小提示：抓住窗帘试试，薄纱会比绒布更容易随风起舞。</div><button className="wood-button" onClick={()=>setPanel('custom')}>量一量我的窗户 <ArrowUpRight size={16}/></button>
      </>:<><div className="panel-kicker">MADE FOR YOUR LITTLE HOME</div><h2>量一量，<br/><em>刚刚好。</em></h2><p className="panel-intro">告诉我们窗户的尺寸，为你的房间织一片合适的风景。</p>
        <label className="measure-field"><span>窗户宽度 <small>WIDTH</small></span><div><input type="number" min="60" max="800" value={width} onChange={e=>setWidth(Number(e.target.value))}/><b>厘米</b></div></label>
        <label className="measure-field"><span>窗户高度 <small>HEIGHT</small></span><div><input type="number" min="80" max="500" value={height} onChange={e=>setHeight(Number(e.target.value))}/><b>厘米</b></div></label>
        <div className="estimate"><span>布料面积 <b>{area.toFixed(2)} ㎡</b></span><span>当前布料 <b>{active.zh}</b></span></div>
        <div className="quantity"><span>想做几套？</span><div><button onClick={()=>setQuantity(quantity-1)}><Minus size={13}/></button><b>{quantity}</b><button onClick={()=>setQuantity(quantity+1)}><Plus size={13}/></button></div></div>
        <div className="total"><span>预计价格</span><b>¥{money(total)}</b></div><button className="wood-button" onClick={()=>{addToBag(total);setBagOpen(true)}}>放进我的收藏篮 <ShoppingBag size={16}/></button><p className="fine-print">* 此处为面料估算价，实际价格以测量和工艺确认为准。</p>
      </>}
    </aside>

    <footer className="story-footer"><span>TAKE A BREATH · FOLLOW THE WIND</span><span>一扇窗，就是一个小小的世界。</span></footer>

    {bagOpen&&<div className="bag-scrim" onClick={()=>setBagOpen(false)}><section className="bag-panel" onClick={e=>e.stopPropagation()}><div className="bag-title"><div><small>YOUR LITTLE COLLECTION</small><h2>我的收藏篮 <i>({bag.length})</i></h2></div><button onClick={()=>setBagOpen(false)}><X/></button></div>{bag.length?<><div className="bag-items">{bag.map(item=>{const f=fabrics.find(x=>x.id===item.fabric)!;return <div className="bag-item" key={item.id}><i style={{background:f.color}}/><div><b>{f.zh}</b><small>{item.width} × {item.height} cm · {item.quantity} 套</small><button onClick={()=>removeFromBag(item.id)}>从篮子里拿出</button></div><strong>¥{money(item.price)}</strong></div>})}</div><div className="bag-total"><span>合计</span><b>¥{money(bagTotal)}</b></div><p className="fine-print">收藏篮暂存于当前页面，尚未接入在线支付。</p></>:<div className="empty-bag"><span>✧</span><p>篮子里还没有喜欢的布料。</p><button onClick={()=>{setBagOpen(false);setPanel('materials')}}>去森林里看看</button></div>}</section></div>}
    <Loader/>
  </main>
}
