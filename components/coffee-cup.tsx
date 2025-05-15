import { Coffee, CupSoda } from "lucide-react"
import { cn } from "@/lib/utils"
import { coffeeColorMap } from "@/lib/coffee-types"

interface CoffeeCupProps {
  fillLevel: number
  size?: "sm" | "md" | "lg"
  className?: string
  coffeeType: string
}

export function CoffeeCup({ fillLevel, size = "md", className, coffeeType = "Black Coffee" }: CoffeeCupProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  }

  const CoffeeIcon = coffeeType.includes("Latte") || coffeeType.includes("Cappuccino") ? CupSoda : Coffee

  return (
    <div
      className={cn(
        "relative coffee-cup rounded-md bg-amber-100 border-2 border-amber-800 flex items-center justify-center",
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
          "absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-b-sm",
          coffeeColorMap[coffeeType as keyof typeof coffeeColorMap] || "bg-amber-900",
        )}
        style={{
          height: `${Math.min(85, fillLevel * 20)}%`,
          opacity: 0.8,
        }}
      ></div>

      <CoffeeIcon className="text-amber-800 z-10" size={size === "sm" ? 20 : size === "md" ? 32 : 48} />
    </div>
  )
}
