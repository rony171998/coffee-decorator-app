"use client"

import type React from "react"
import { type ButtonHTMLAttributes, type ReactNode, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useSound } from "@/contexts/sound-context"
import type { SoundType } from "@/hooks/use-sound-effects"

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "outline" | "disabled"
  className?: string
  soundType?: SoundType
}

export function RippleButton({
  children,
  variant = "default",
  className,
  onClick,
  disabled,
  soundType = "click",
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nextId = useRef(0)
  const { playSound, settings } = useSound()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    // Solo reproducir sonido si está habilitado
    if (settings.enabled) {
      playSound(soundType)
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const id = nextId.current++
      setRipples([...ripples, { x, y, id }])

      setTimeout(() => {
        setRipples((ripples) => ripples.filter((ripple) => ripple.id !== id))
      }, 600)
    }

    if (onClick) {
      onClick(e)
    }
  }

  const variantClasses = {
    default: "bg-amber-600 hover:bg-amber-700 text-white",
    outline: "bg-transparent border border-amber-300 hover:bg-amber-100 text-amber-800",
    disabled: "bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed",
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-md px-4 py-2 transition-all duration-200",
        variantClasses[disabled ? "disabled" : variant],
        className,
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "10px",
            height: "10px",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {children}
    </button>
  )
}
