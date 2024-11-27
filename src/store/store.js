import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStoreFlight = create(persist((set) => ({
    information: {},
    start_flight: () => set(() => ({
        information: {}
    })),
    info_flight: (flight) => set((state) => ({
        information: { ...state.information, flight  }
    })),
    // Nuevo estado para manejar datos del formulario de consulta
    consultationFormData: null, // Estado inicial
    setConsultationFormData: (data) => set(() => ({
        consultationFormData: data // Guardar datos del formulario de reserva
    })),
    clearConsultationFormData: () => set(() => ({
        consultationFormData: null // Limpiar datos al acceder manualmente
    })),
  }), { name: 'flight-storage' }))






