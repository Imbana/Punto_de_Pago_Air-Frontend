import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStoreFlight = create(persist((set) => ({
    information: {},
    start_flight: () => set(() => ({
        information: {}
    })),
    info_flight: (flight) => set((state) => ({
        information: { ...state.information, flight  }
    }))
  }), { name: 'flight-storage' }))






