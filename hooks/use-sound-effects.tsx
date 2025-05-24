"use client"

import { useState, useEffect, useCallback } from "react"

// Tipos de sonidos disponibles
export type SoundType = "click" | "add" | "remove" | "error" | "select" | "pour"

// Configuración de sonidos
export interface SoundSettings {
  enabled: boolean
  volume: number
}

// Hook para gestionar los efectos de sonido
export function useSoundEffects() {
  // Estado para la configuración de sonido
  const [settings, setSettings] = useState<SoundSettings>(() => {
    // Intentar cargar la configuración desde localStorage
    if (typeof window !== "undefined") {
      try {
        const savedSettings = localStorage.getItem("soundSettings")
        if (savedSettings) {
          return JSON.parse(savedSettings)
        }
      } catch (err) {
        console.error("Error loading sound settings:", err)
      }
    }
    // Configuración predeterminada
    return { enabled: true, volume: 0.5 }
  })

  // Estado para simular que los sonidos están cargados
  const [soundsLoaded, setSoundsLoaded] = useState<Record<SoundType, boolean>>({
    click: true,
    add: true,
    remove: true,
    error: true,
    select: true,
    pour: true,
  })

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("soundSettings", JSON.stringify(settings))
      } catch (err) {
        console.error("Error saving sound settings:", err)
      }
    }
  }, [settings])

  // Función para simular la reproducción de un sonido
  const playSound = useCallback(
    (type: SoundType) => {
      if (!settings.enabled) return

      // Simulamos la reproducción del sonido
      console.log(`Playing sound: ${type} (volume: ${settings.volume})`)

      // Crear un oscilador para generar un sonido simple
      if (typeof window !== "undefined" && window.AudioContext) {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          // Configurar el tipo y frecuencia según el tipo de sonido
          switch (type) {
            case "click":
              oscillator.type = "sine"
              oscillator.frequency.value = 800
              gainNode.gain.value = 0.1 * settings.volume
              break
            case "add":
              oscillator.type = "sine"
              oscillator.frequency.value = 600
              gainNode.gain.value = 0.2 * settings.volume
              break
            case "remove":
              oscillator.type = "sine"
              oscillator.frequency.value = 400
              gainNode.gain.value = 0.2 * settings.volume
              break
            case "error":
              oscillator.type = "square"
              oscillator.frequency.value = 200
              gainNode.gain.value = 0.3 * settings.volume
              break
            case "select":
              oscillator.type = "sine"
              oscillator.frequency.value = 700
              gainNode.gain.value = 0.2 * settings.volume
              break
            case "pour":
              oscillator.type = "sine"
              oscillator.frequency.value = 300
              gainNode.gain.value = 0.15 * settings.volume
              break
          }

          // Conectar nodos
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          // Configurar duración
          const duration = type === "error" ? 0.3 : 0.1

          // Iniciar y detener el oscilador
          oscillator.start()
          oscillator.stop(audioContext.currentTime + duration)

          // Limpiar después de reproducir
          setTimeout(
            () => {
              gainNode.disconnect()
              audioContext.close().catch(console.error)
            },
            duration * 1000 + 100,
          )
        } catch (err) {
          console.warn("Error generating sound:", err)
        }
      }
    },
    [settings.enabled, settings.volume],
  )

  // Función para actualizar la configuración
  const updateSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  return {
    playSound,
    settings,
    updateSettings,
    soundsLoaded,
  }
}
