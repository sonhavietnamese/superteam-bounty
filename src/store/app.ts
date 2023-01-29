import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  isModalOpen: boolean
  changeIsModalOpen: (isModalOpen: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isModalOpen: false,
      changeIsModalOpen: (isModalOpen: boolean) => set(() => ({ isModalOpen })),
    }),
    {
      name: 'app-storage',
    },
  ),
)
