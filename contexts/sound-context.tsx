"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import type { SoundType, SoundSettings } from "@/hooks/use-sound-effects"

// Tipo para el contexto
interface SoundContextType {
  playSound: (type: SoundType) => void
  settings: SoundSettings
  updateSettings: (newSettings: Partial<SoundSettings>) => void
  soundsLoaded: Record<SoundType, boolean>
}

// Crear el contexto
const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Proveedor del contexto
export function SoundProvider({ children }: { children: ReactNode }) {
  const soundEffects = useSoundEffects()

  return <SoundContext.Provider value={soundEffects}>{children}</SoundContext.Provider>
}

// Hook para usar el contexto
export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
