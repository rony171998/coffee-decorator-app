"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CoffeeCup } from "@/components/coffee-cup"
import { cn } from "@/lib/utils"
import { coffeeTypes } from "@/lib/coffee-types"
import type { ICoffee } from "@/lib/coffee-types"

interface CoffeeSelectorProps {
  onSelect: (coffeeType: string, coffeeInstance: ICoffee) => void
  selectedCoffee: string
}

export function CoffeeSelector({ onSelect, selectedCoffee }: CoffeeSelectorProps) {
  const [hoveredCoffee, setHoveredCoffee] = useState<string | null>(null)

  const handleSelect = (coffeeType: string) => {
    const CoffeeClass = coffeeTypes[coffeeType as keyof typeof coffeeTypes]
    const coffeeInstance = new CoffeeClass()
    onSelect(coffeeType, coffeeInstance)
  }

  return (
    <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">Base Coffee Selection</CardTitle>
        <CardDescription>Choose your base coffee type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.keys(coffeeTypes).map((coffeeType) => {
            const CoffeeClass = coffeeTypes[coffeeType as keyof typeof coffeeTypes]
            const instance = new CoffeeClass()

            return (
              <Button
                key={coffeeType}
                variant={selectedCoffee === coffeeType ? "default" : "outline"}
                className={cn(
                  "h-auto flex-col py-3 gap-2 transition-all",
                  selectedCoffee === coffeeType ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100",
                  hoveredCoffee === coffeeType && "scale-105",
                )}
                onClick={() => handleSelect(coffeeType)}
                onMouseEnter={() => setHoveredCoffee(coffeeType)}
                onMouseLeave={() => setHoveredCoffee(null)}
              >
                <CoffeeCup
                  fillLevel={1}
                  size="sm"
                  coffeeType={coffeeType}
                  className={cn("transition-transform", hoveredCoffee === coffeeType && "animate-float")}
                />
                <div className="flex flex-col items-center">
                  <span className="font-medium">{coffeeType}</span>
                  <span className="text-xs font-mono">${instance.getCost().toFixed(2)}</span>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
