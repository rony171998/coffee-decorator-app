"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, CupSoda, GlassWater, Milk, CandyIcon as Sugar, Candy, Sparkles } from "lucide-react"
import { AnimatedNumber } from "@/components/animated-number"
import { cn } from "@/lib/utils"
import type { ICoffee } from "@/lib/coffee-types"

interface CoffeeCardProps {
  coffee: ICoffee
  baseCoffeeType: string
  decorators: string[]
  className?: string
}

export function CoffeeCard({ coffee, baseCoffeeType, decorators, className }: CoffeeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mapa de colores para el fondo según el tipo de café
  const coffeeColorMap: Record<string, string> = {
    "Black Coffee": "from-amber-900/20 to-amber-950/30",
    Espresso: "from-amber-950/20 to-amber-950/40",
    Latte: "from-amber-200/30 to-amber-300/40",
    Cappuccino: "from-amber-100/30 to-amber-200/40",
    Americano: "from-amber-800/20 to-amber-900/30",
  }

  // Mapa de iconos para decoradores
  const decoratorIconMap: Record<string, JSX.Element> = {
    Milk: <Milk className="h-4 w-4" />,
    Sugar: <Sugar className="h-4 w-4" />,
    "Whipped Cream": <CupSoda className="h-4 w-4" />,
    Cinnamon: <Sparkles className="h-4 w-4" />,
    Caramel: <Candy className="h-4 w-4" />,
  }

  // Función para obtener el ícono según el tipo de café base
  const getCoffeeIcon = () => {
    if (baseCoffeeType === "Latte") {
      return <GlassWater className={cn("h-16 w-16 transition-all duration-300", isHovered && "text-amber-600")} />
    } else if (baseCoffeeType === "Cappuccino") {
      return <CupSoda className={cn("h-16 w-16 transition-all duration-300", isHovered && "text-amber-600")} />
    } else {
      return <Coffee className={cn("h-16 w-16 transition-all duration-300", isHovered && "text-amber-600")} />
    }
  }

  return (
    <Card
      className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-300",
          coffeeColorMap[baseCoffeeType] || "from-amber-900/20 to-amber-950/30",
          isHovered && "opacity-60",
        )}
      />

      <CardHeader className="relative">
        <CardTitle className="text-xl">{coffee.getDescription()}</CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <div className="text-2xl font-bold">
              $<AnimatedNumber value={coffee.getCost()} />
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="bg-amber-800 text-white border-none">
                {baseCoffeeType}
              </Badge>

              {decorators.map((decorator, index) => (
                <Badge key={index} variant="outline" className="bg-amber-600 text-white border-none">
                  {decoratorIconMap[decorator] || null}
                  <span className="ml-1">{decorator}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">{getCoffeeIcon()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
