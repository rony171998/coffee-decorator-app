"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CoffeeCup } from "@/components/coffee-cup"
import { CoffeeSelector } from "@/components/coffee-selector"
import { AnimatedNumber } from "@/components/animated-number"
import { type ICoffee, BlackCoffee, decoratorMap, iconMap, priceMap, coffeeTypes } from "@/lib/coffee-types"

export default function CoffeeCustomizer() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [baseCoffeeType, setBaseCoffeeType] = useState<string>("Black Coffee")
  const [coffee, setCoffee] = useState<ICoffee>(new BlackCoffee())
  const [animateAddOn, setAnimateAddOn] = useState<string | null>(null)
  const [animateRemove, setAnimateRemove] = useState<string | null>(null)
  const [codeVisible, setCodeVisible] = useState(false)
  const prevAddOnsRef = useRef<string[]>([])

  useEffect(() => {
    // Show code with a delay for animation
    setCodeVisible(false)
    const timer = setTimeout(() => {
      setCodeVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [selectedAddOns, baseCoffeeType])

  // Handle base coffee selection
  const handleCoffeeSelect = (coffeeType: string, coffeeInstance: ICoffee) => {
    setBaseCoffeeType(coffeeType)

    // Rebuild the coffee with decorators
    let newCoffee: ICoffee = coffeeInstance
    selectedAddOns.forEach((addon) => {
      const DecoratorClass = decoratorMap[addon as keyof typeof decoratorMap]
      newCoffee = new DecoratorClass(newCoffee)
    })

    setCoffee(newCoffee)
  }

  // Add or remove an add-on with animations
  const toggleAddOn = (addOn: string) => {
    let newAddOns: string[]

    if (selectedAddOns.includes(addOn)) {
      // Animate removal
      setAnimateRemove(addOn)
      setTimeout(() => setAnimateRemove(null), 500)

      // Remove this add-on and all add-ons after it
      const index = selectedAddOns.indexOf(addOn)
      newAddOns = selectedAddOns.slice(0, index)
    } else {
      // Animate addition
      setAnimateAddOn(addOn)
      setTimeout(() => setAnimateAddOn(null), 800)

      // Add this add-on
      newAddOns = [...selectedAddOns, addOn]
    }

    prevAddOnsRef.current = selectedAddOns
    setSelectedAddOns(newAddOns)

    // Rebuild the coffee with decorators
    const BaseCoffeeClass = coffeeTypes[baseCoffeeType as keyof typeof coffeeTypes]
    let newCoffee: ICoffee = new BaseCoffeeClass()

    newAddOns.forEach((addon) => {
      const DecoratorClass = decoratorMap[addon as keyof typeof decoratorMap]
      newCoffee = new DecoratorClass(newCoffee)
    })

    setCoffee(newCoffee)
  }

  // Generate code representation with proper formatting
  const generateCode = () => {
    if (selectedAddOns.length === 0) {
      return `new ${baseCoffeeType.replace(/\s+/g, "")}()`
    }

    // Start with the base coffee
    let code = `new ${baseCoffeeType.replace(/\s+/g, "")}()`

    // Add each decorator with proper indentation
    selectedAddOns.forEach((addon, index) => {
      const indentation = "  ".repeat(index + 1)
      const closingIndentation = "  ".repeat(index)
      code = `new ${addon.replace(/\s+/g, "")}Decorator(\n${indentation}${code}\n${closingIndentation})`
    })

    return code
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-8 animate-float">
          Coffee Customization
          <span className="block text-lg md:text-xl font-normal text-amber-700 mt-2">
            Decorator Pattern Demonstration
          </span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Coffee Selection & Add-ons */}
          <div className="space-y-6">
            {/* Base Coffee Selection */}
            <CoffeeSelector onSelect={handleCoffeeSelect} selectedCoffee={baseCoffeeType} />

            {/* Add-ons Card */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle>Add-ons (Decorators)</CardTitle>
                <CardDescription>Select items to add to your coffee</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.keys(decoratorMap).map((addOn) => (
                  <Button
                    key={addOn}
                    variant={selectedAddOns.includes(addOn) ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start gap-2 text-left transition-all",
                      selectedAddOns.includes(addOn) ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100",
                      animateAddOn === addOn && "animate-pulse-once",
                      animateRemove === addOn && "animate-shake",
                    )}
                    onClick={() => toggleAddOn(addOn)}
                  >
                    {iconMap[addOn as keyof typeof iconMap]}
                    <span className="flex-1">{addOn}</span>
                    <span className="font-mono">+${priceMap[addOn as keyof typeof priceMap].toFixed(2)}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Result Display */}
          <div className="space-y-6">
            {/* Current Coffee Card */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Your Coffee</CardTitle>
                <CardDescription>Current customized coffee</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-amber-800 text-white border-none animate-scaleIn">
                      <span className="flex items-center gap-1">
                        {coffee.getIcon()}
                        <span>{baseCoffeeType}</span>
                      </span>
                    </Badge>

                    {selectedAddOns.map((addOn, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-amber-600 text-white border-none animate-scaleIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="flex items-center gap-1">
                          {iconMap[addOn as keyof typeof iconMap]}
                          <span>{addOn}</span>
                        </span>
                      </Badge>
                    ))}
                  </div>

                  <CoffeeCup
                    fillLevel={Math.min(5, selectedAddOns.length + 1)}
                    size="md"
                    className="animate-scaleIn"
                    coffeeType={baseCoffeeType}
                  />
                </div>

                <div className="pt-2 animate-slideDown">
                  <div className="font-medium">Description:</div>
                  <div className="text-lg animate-typeIn overflow-hidden whitespace-nowrap">
                    {coffee.getDescription()}
                  </div>
                </div>

                <div className="animate-slideDown" style={{ animationDelay: "0.2s" }}>
                  <div className="font-medium">Total Cost:</div>
                  <div className="text-2xl font-bold text-amber-800">
                    $<AnimatedNumber value={coffee.getCost()} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decorator Visualization Card */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Decorator Structure</CardTitle>
                <CardDescription>Visual representation of the pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-amber-700 font-medium">Estructura del código</div>
                    <div className="text-xs text-amber-600">TypeScript</div>
                  </div>
                  <div
                    className={cn(
                      "bg-slate-900 text-amber-100 p-5 rounded-md font-mono text-sm overflow-x-auto transition-opacity duration-300 border border-slate-700 max-h-[300px]",
                      codeVisible ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <pre className="relative">
                      <code>{generateCode()}</code>
                    </pre>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Representación del patrón Decorador en código TypeScript
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="font-medium">Decorator Tree:</div>
                  <div className="relative pl-6 space-y-2">
                    {selectedAddOns.length > 0 ? (
                      <>
                        {[...selectedAddOns].reverse().map((addOn, index) => (
                          <div
                            key={index}
                            className="relative border-l-2 border-amber-400 pl-4 py-1 animate-slideRight"
                            style={{
                              marginLeft: `${index * 12}px`,
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <div className="absolute w-3 h-0.5 bg-amber-400 left-0 top-1/2 transform -translate-y-1/2"></div>
                            <div className="flex items-center gap-2 bg-amber-100 px-2 py-1 rounded hover:bg-amber-200 transition-colors">
                              {iconMap[addOn as keyof typeof iconMap]}
                              <span>{addOn} Decorator</span>
                            </div>
                          </div>
                        ))}
                        <div
                          className="relative border-l-2 border-amber-800 pl-4 py-1 animate-slideRight"
                          style={{
                            marginLeft: `${selectedAddOns.length * 12}px`,
                            animationDelay: `${selectedAddOns.length * 0.1}s`,
                          }}
                        >
                          <div className="absolute w-3 h-0.5 bg-amber-800 left-0 top-1/2 transform -translate-y-1/2"></div>
                          <div className="flex items-center gap-2 bg-amber-200 px-2 py-1 rounded hover:bg-amber-300 transition-colors">
                            {coffee.getIcon()}
                            <span>{baseCoffeeType}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 bg-amber-200 px-2 py-1 rounded hover:bg-amber-300 transition-colors animate-scaleIn">
                        {coffee.getIcon()}
                        <span>{baseCoffeeType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Each decorator wraps the previous coffee object, adding new behavior.
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
