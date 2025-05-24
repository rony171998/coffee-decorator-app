"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CoffeeSelector } from "@/components/coffee-selector"
import { CoffeeCard } from "@/components/coffee-card"
import { type ICoffee, BlackCoffee, decoratorMap, iconMap, priceMap, coffeeTypes } from "@/lib/coffee-types"
import { Coffee, CupSoda, GlassWater, AlertCircle, Ban } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CoffeeCup } from "@/components/coffee-cup"
import { RippleButton } from "@/components/ripple-button"
import { SoundProvider } from "@/contexts/sound-context"
import { SoundSettings } from "@/components/sound-settings"
import { useSound } from "@/contexts/sound-context"

function CoffeeCustomizerContent() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [baseCoffeeType, setBaseCoffeeType] = useState<string>("Black Coffee")
  const [coffee, setCoffee] = useState<ICoffee>(new BlackCoffee())
  const [animateAddOn, setAnimateAddOn] = useState<string | null>(null)
  const [animateRemove, setAnimateRemove] = useState<string | null>(null)
  const [codeVisible, setCodeVisible] = useState(false)
  const [animateCup, setAnimateCup] = useState(false)
  const prevAddOnsRef = useRef<string[]>([])
  const { playSound } = useSound()

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
    // Reproducir sonido de selección
    playSound("select")

    // Animate cup when changing coffee type
    setAnimateCup(true)
    setTimeout(() => setAnimateCup(false), 1000)

    setBaseCoffeeType(coffeeType)

    // Rebuild the coffee with decorators
    let newCoffee: ICoffee = coffeeInstance

    // Filter out incompatible decorators when changing coffee type
    let compatibleAddOns = [...selectedAddOns]
    if (coffeeType === "Black Coffee") {
      compatibleAddOns = selectedAddOns.filter((addon) => addon !== "Whipped Cream")

      // Show notification if decorators were removed
      if (compatibleAddOns.length < selectedAddOns.length) {
        // Reproducir sonido de error
        playSound("error")

        toast({
          title: "Decorador incompatible",
          description: "La crema batida no se puede añadir al café negro.",
          variant: "destructive",
        })
      }
    }

    setSelectedAddOns(compatibleAddOns)

    compatibleAddOns.forEach((addon) => {
      const DecoratorClass = decoratorMap[addon as keyof typeof decoratorMap]
      newCoffee = new DecoratorClass(newCoffee)
    })

    setCoffee(newCoffee)
  }

  // Add or remove an add-on with animations
  const toggleAddOn = (addOn: string) => {
    // Check for incompatible combinations
    if (addOn === "Whipped Cream" && baseCoffeeType === "Black Coffee") {
      // Reproducir sonido de error
      playSound("error")

      toast({
        title: "Combinación incompatible",
        description: "No se puede añadir crema batida al café negro.",
        variant: "destructive",
      })

      // Animate the button to show it's not allowed
      setAnimateRemove(addOn)
      setTimeout(() => setAnimateRemove(null), 500)

      return
    }

    let newAddOns: string[]

    if (selectedAddOns.includes(addOn)) {
      // Reproducir sonido de eliminación
      playSound("remove")

      // Animate removal
      setAnimateRemove(addOn)
      setTimeout(() => setAnimateRemove(null), 500)

      // Remove this add-on and all add-ons after it
      const index = selectedAddOns.indexOf(addOn)
      newAddOns = selectedAddOns.slice(0, index)
    } else {
      // Reproducir sonido de adición
      playSound("add")

      // Animate addition
      setAnimateAddOn(addOn)
      setTimeout(() => setAnimateAddOn(null), 800)

      // Animate cup when adding decorator
      setAnimateCup(true)
      setTimeout(() => setAnimateCup(false), 1000)

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
    // We iterate through the array normally (from first to last added)
    selectedAddOns.forEach((addon, index) => {
      const indentation = "  ".repeat(index + 1)
      const closingIndentation = "  ".repeat(index)
      code = `new ${addon.replace(/\s+/g, "")}Decorator(\n${indentation}${code}\n${closingIndentation})`
    })

    return code
  }

  // Check if an add-on is disabled
  const isAddOnDisabled = (addOn: string) => {
    return addOn === "Whipped Cream" && baseCoffeeType === "Black Coffee"
  }

  // Create particles effect
  const createParticles = (count: number, colors: string[]) => {
    const particles = []
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 2
      const color = colors[Math.floor(Math.random() * colors.length)]
      particles.push(
        <span
          key={i}
          className="particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random(),
            animation: `float ${Math.random() * 3 + 2}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />,
      )
    }
    return particles
  }

  return (
    <div className="min-h-screen bg-gradient-animated bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-900 animate-float">
            Coffee Customization
            <span className="block text-lg md:text-xl font-normal text-amber-700 mt-2">
              Decorator Pattern Demonstration
            </span>
          </h1>

          {/* Configuración de sonido */}
          <div className="relative">
            <SoundSettings />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Coffee Selection & Add-ons */}
          <div className="space-y-6">
            {/* Base Coffee Selection */}
            <CoffeeSelector onSelect={handleCoffeeSelect} selectedCoffee={baseCoffeeType} />

            {/* Add-ons Card */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <span className="animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700">
                    Add-ons (Decorators)
                  </span>
                </CardTitle>
                <CardDescription>Select items to add to your coffee</CardDescription>
              </CardHeader>

              {/* Restriction Alert - Only show when Black Coffee is selected */}
              {baseCoffeeType === "Black Coffee" && (
                <div className="px-6 mb-4 animate-fadeIn">
                  <Alert className="bg-amber-50 border-amber-300">
                    <AlertCircle className="h-4 w-4 text-amber-800" />
                    <AlertDescription className="text-amber-800">
                      El café negro no es compatible con crema batida.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <CardContent className="space-y-3">
                {Object.keys(decoratorMap).map((addOn) => {
                  const disabled = isAddOnDisabled(addOn)
                  const isSelected = selectedAddOns.includes(addOn)

                  return (
                    <div key={addOn} className="relative overflow-hidden rounded-md">
                      <RippleButton
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "w-full justify-start gap-2 text-left transition-all",
                          isSelected && "selected-glow",
                          animateAddOn === addOn && "animate-pulse-once",
                          animateRemove === addOn && "animate-shake",
                          disabled && "opacity-60 bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-500",
                          isSelected ? "hover:bg-amber-700" : "hover:bg-amber-100",
                        )}
                        onClick={() => toggleAddOn(addOn)}
                        disabled={disabled}
                        title={disabled ? "No se puede añadir crema batida al café negro" : ""}
                        soundType={isSelected ? "remove" : "add"}
                      >
                        <span className={cn("transition-transform duration-300", isSelected && "animate-bounce")}>
                          {iconMap[addOn as keyof typeof iconMap]}
                        </span>
                        <span className="flex-1">{addOn}</span>
                        <span className="font-mono">+${priceMap[addOn as keyof typeof priceMap].toFixed(2)}</span>
                      </RippleButton>

                      {/* Diagonal line and ban icon for disabled options */}
                      {disabled && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[95%] h-0.5 bg-red-500/70 rotate-12 transform origin-center"></div>
                          </div>
                          <Ban className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500/80" />
                        </>
                      )}
                    </div>
                  )
                })}

                {/* Explanation text for incompatible combinations */}
                {baseCoffeeType === "Black Coffee" && (
                  <div className="text-xs text-amber-700 mt-2 italic animate-fadeIn">
                    * La crema batida solo se puede añadir a cafés con leche como base.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Result Display */}
          <div className="space-y-6">
            {/* Coffee Card - New Visual Representation */}
            <div className="relative">
              <CoffeeCard
                coffee={coffee}
                baseCoffeeType={baseCoffeeType}
                decorators={selectedAddOns}
                className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md animate-scaleIn hover-lift"
              />

              {/* Floating particles around the coffee card */}
              {selectedAddOns.length > 0 && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {createParticles(selectedAddOns.length * 3, ["#f59e0b", "#d97706", "#92400e"])}
                </div>
              )}
            </div>

            {/* Decorator Visualization Card */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover-lift">
              <CardHeader>
                <CardTitle>Decorator Structure</CardTitle>
                <CardDescription>Visual representation of the pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium flex items-center">
                    <span>Decorator Tree:</span>
                    <CoffeeCup
                      fillLevel={Math.min(5, selectedAddOns.length + 1)}
                      size="sm"
                      coffeeType={baseCoffeeType}
                      className="ml-2"
                      animate={animateCup}
                    />
                  </div>
                  <div className="relative pl-6 space-y-2">
                    {selectedAddOns.length > 0 ? (
                      <>
                        {/* Reverse the order of decorators to show proper nesting */}
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
                            <div className="flex items-center gap-2 bg-amber-100 px-2 py-1 rounded hover:bg-amber-200 transition-colors hover-scale">
                              {iconMap[addOn as keyof typeof iconMap]}
                              <span>{addOn} Decorator</span>
                            </div>
                          </div>
                        ))}
                        {/* Base coffee at the bottom (innermost component) */}
                        <div
                          className="relative border-l-2 border-amber-800 pl-4 py-1 animate-slideRight"
                          style={{
                            marginLeft: `${selectedAddOns.length * 12}px`,
                            animationDelay: `${selectedAddOns.length * 0.1}s`,
                          }}
                        >
                          <div className="absolute w-3 h-0.5 bg-amber-800 left-0 top-1/2 transform -translate-y-1/2"></div>
                          <div className="flex items-center gap-2 bg-amber-200 px-2 py-1 rounded hover:bg-amber-300 transition-colors hover-scale">
                            {baseCoffeeType === "Latte" ? (
                              <GlassWater className="h-6 w-6 text-amber-800" />
                            ) : baseCoffeeType === "Cappuccino" ? (
                              <CupSoda className="h-6 w-6 text-amber-800" />
                            ) : (
                              <Coffee className="h-6 w-6 text-amber-800" />
                            )}
                            <span>{baseCoffeeType}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 bg-amber-200 px-2 py-1 rounded hover:bg-amber-300 transition-colors animate-scaleIn hover-scale">
                        {baseCoffeeType === "Latte" ? (
                          <GlassWater className="h-6 w-6 text-amber-800" />
                        ) : baseCoffeeType === "Cappuccino" ? (
                          <CupSoda className="h-6 w-6 text-amber-800" />
                        ) : (
                          <Coffee className="h-6 w-6 text-amber-800" />
                        )}
                        <span>{baseCoffeeType}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

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
                      {generateCode()
                        .split(/($$|$$)/)
                        .map((part, index) => {
                          // Add line breaks and indentation for better visualization
                          if (part === ")") {
                            return (
                              <span key={index} className="text-amber-300">
                                {part}
                              </span>
                            )
                          } else if (part === "(") {
                            return (
                              <span key={index} className="text-amber-300">
                                {part}
                              </span>
                            )
                          } else if (part.includes("new")) {
                            return (
                              <span key={index}>
                                <span className="text-green-400">new </span>
                                <span className="text-blue-400">{part.replace("new ", "")}</span>
                              </span>
                            )
                          }
                          return part
                        })}
                    </pre>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Representación del patrón Decorador en código TypeScript
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

// Componente principal con el proveedor de sonido
export default function CoffeeCustomizer() {
  return (
    <SoundProvider>
      <CoffeeCustomizerContent />
    </SoundProvider>
  )
}
