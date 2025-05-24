"use client"

import { Coffee, CupSoda, GlassWater } from "lucide-react"
import { cn } from "@/lib/utils"
import { coffeeColorMap } from "@/lib/coffee-types"
import { useEffect, useState } from "react"
import { useSound } from "@/contexts/sound-context"

interface CoffeeCupProps {
  fillLevel: number
  size?: "sm" | "md" | "lg"
  className?: string
  coffeeType: string
  animate?: boolean
}

export function CoffeeCup({
  fillLevel,
  size = "md",
  className,
  coffeeType = "Black Coffee",
  animate = false,
}: CoffeeCupProps) {
  const [isPouring, setIsPouring] = useState(false)
  const [showRipple, setShowRipple] = useState(false)
  const [prevFillLevel, setPrevFillLevel] = useState(fillLevel)
  const { playSound } = useSound()

  useEffect(() => {
    if (fillLevel > prevFillLevel && animate) {
      setIsPouring(true)

      // Reproducir sonido de vertido
      playSound("pour")

      // Create ripple effect after a short delay
      setTimeout(() => {
        setShowRipple(true)
        setTimeout(() => setShowRipple(false), 600)
      }, 300)

      // Reset pouring animation after it completes
      setTimeout(() => {
        setIsPouring(false)
      }, 1000)
    }

    setPrevFillLevel(fillLevel)
  }, [fillLevel, prevFillLevel, animate, playSound])

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56",
  }

  const getCoffeeIcon = () => {
    if (coffeeType === "Latte") {
      return (
        <GlassWater
          className="text-amber-800 z-10 transition-transform duration-300 hover:scale-110"
          size={size === "sm" ? 30 : size === "md" ? 48 : 72}
        />
      )
    } else if (coffeeType === "Cappuccino") {
      return (
        <CupSoda
          className="text-amber-800 z-10 transition-transform duration-300 hover:scale-110"
          size={size === "sm" ? 30 : size === "md" ? 48 : 72}
        />
      )
    } else {
      return (
        <Coffee
          className="text-amber-800 z-10 transition-transform duration-300 hover:scale-110"
          size={size === "sm" ? 30 : size === "md" ? 48 : 72}
        />
      )
    }
  }

  return (
    <div
      className={cn(
        "relative coffee-cup rounded-md bg-amber-100 border-2 border-amber-800 flex items-center justify-center hover-lift",
        `filled-${Math.min(5, fillLevel)}`,
        sizeClasses[size],
        className,
      )}
    >
      <div className="steam"></div>
      <div className="steam"></div>
      <div className="steam"></div>

      {/* Coffee liquid */}
      <div
        className={cn(
          "coffee-liquid absolute bottom-0 left-[5%] right-[5%] transition-all duration-500 rounded-b-sm",
          coffeeColorMap[coffeeType as keyof typeof coffeeColorMap] || "bg-amber-900",
          isPouring && "pouring",
        )}
        style={{
          height: `${Math.min(85, fillLevel * 20)}%`,
          opacity: 0.8,
        }}
      ></div>

      {/* Ripple effect */}
      {showRipple && <div className="coffee-ripple animate"></div>}

      {getCoffeeIcon()}
    </div>
  )
}
