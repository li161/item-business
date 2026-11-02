import { create } from 'zustand'

export type FabricId = 'sheer' | 'linen' | 'velvet' | 'blackout'
export type WindLevel = 0 | 1 | 2 | 3
export type WeatherMode = 'sunny' | 'rainy'

type StudioState = {
  fabric: FabricId
  wind: WindLevel
  weather: WeatherMode
  hour: number
  opening: number
  width: number
  height: number
  quantity: number
  bag: Array<{ id: number; fabric: FabricId; width: number; height: number; quantity: number; price: number }>
  setFabric: (fabric: FabricId) => void
  setWind: (wind: WindLevel) => void
  setWeather: (weather: WeatherMode) => void
  setHour: (hour: number) => void
  setOpening: (opening: number) => void
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  setQuantity: (quantity: number) => void
  addToBag: (price: number) => void
  removeFromBag: (id: number) => void
}

export const useStudio = create<StudioState>((set) => ({
  fabric: 'linen',
  wind: 1,
  weather: 'sunny',
  hour: 15,
  opening: 0.08,
  width: 280,
  height: 260,
  quantity: 1,
  bag: [],
  setFabric: (fabric) => set({ fabric }),
  setWind: (wind) => set({ wind }),
  setWeather: (weather) => set({ weather }),
  setHour: (hour) => set({ hour: Math.max(8, Math.min(22, hour)) }),
  setOpening: (opening) => set({ opening: Math.max(0, Math.min(1, opening)) }),
  setWidth: (width) => set({ width: Math.max(60, Math.min(800, width)) }),
  setHeight: (height) => set({ height: Math.max(80, Math.min(500, height)) }),
  setQuantity: (quantity) => set({ quantity: Math.max(1, Math.min(20, quantity)) }),
  addToBag: (price) => set((state) => ({
    bag: [...state.bag, {
      id: Date.now(),
      fabric: state.fabric,
      width: state.width,
      height: state.height,
      quantity: state.quantity,
      price,
    }],
  })),
  removeFromBag: (id) => set((state) => ({ bag: state.bag.filter((item) => item.id !== id) })),
}))
