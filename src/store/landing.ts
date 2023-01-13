import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RoleType = 'provider' | 'hunter'

interface LandingState {
  role: RoleType
  changeRole: (newRole: RoleType) => void
}

export const useLandingStore = create<LandingState>()(
  persist(
    (set) => ({
      role: 'hunter',
      changeRole: (newRole: RoleType) => set(() => ({ role: newRole })),
    }),
    {
      name: 'landing-storage',
    },
  ),
)
