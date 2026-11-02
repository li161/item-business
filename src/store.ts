import { create } from 'zustand'

export type FabricId = 'sheer' | 'linen' | 'velvet' | 'blackout'
export type WindLevel = 0 | 1 | 2 | 3

type StudioState = {
  fabric: FabricId
  wind: WindLevel
  hour: number
  open: number
  width: number
  height: number
  quantity: number
  bagCount: number
  setFabric: (fabric: FabricId) => void
  setWind: (wind: WindLevel) => void
  setHour: (hour: number) => void
  setOpen: (open: number) => void
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  setQuantity: (quantity: number) => void
  addToBag: () => void
}

export const useStudio = create<StudioState>((set) => ({
  fabric: 'linen',
  wind: 0,
  hour: 15,
  open: 0.12,
  width: 280,
  height: 260,
  quantity: 1,
  bagCount: 0,
  setFabric: (fabric) => set({ fabric }),
  setWind: (wind) => set({ wind }),
  setHour: (hour) => set({ hour }),
  setOpen: (open) => set({ open }),
  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setQuantity: (quantity) => set({ quantity }),
  addToBag: () => set((s) => ({ bagCount: s.bagCount + s.quantity })),
}))