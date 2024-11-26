import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStoreFlight = create(persist((set) => ({
    information: {},
    start_flight: () => set(() => ({
        information: {}
    })),
    info_flight: (flight) => set((state) => ({
        information: { ...state,  "origin": flight.origin, "destination": flight.destination, "date": flight.date }
    }))
  }), { name: 'flight-storage' }))






