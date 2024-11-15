import { create } from 'zustand'

type Store = {
  log: null | {}
  setLog: (value: any) => void
}

export const useDiologLog = create<Store>()((set) => ({
  log: null,
  setLog: (value: any) => set((state) => ({ log: value })),
}))