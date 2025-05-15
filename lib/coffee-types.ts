import { Coffee, CupSoda, Milk, CandyIcon as Sugar, Candy, Sparkles } from "lucide-react"

// Coffee interface - Component in Decorator Pattern
export interface ICoffee {
  getDescription(): string
  getCost(): number
  getIcon(): JSX.Element
}

// Concrete Components
export class BlackCoffee implements ICoffee {
  getDescription(): string {
    return "Black Coffee"
  }

  getCost(): number {
    return 2.0
  }

  getIcon(): JSX.Element {
    return <Coffee className="h-5 w-5" />
  }
}

export class Espresso implements ICoffee {
  getDescription(): string {
    return "Espresso"
  }

  getCost(): number {
    return 2.5
  }

  getIcon(): JSX.Element {
    return <Coffee className="h-5 w-5" />
  }
}

export class Latte implements ICoffee {
  getDescription(): string {
    return "Latte"
  }

  getCost(): number {
    return 3.0
  }

  getIcon(): JSX.Element {
    return <CupSoda className="h-5 w-5" />
  }
}

export class Cappuccino implements ICoffee {
  getDescription(): string {
    return "Cappuccino"
  }

  getCost(): number {
    return 3.25
  }

  getIcon(): JSX.Element {
    return <CupSoda className="h-5 w-5" />
  }
}

export class Americano implements ICoffee {
  getDescription(): string {
    return "Americano"
  }

  getCost(): number {
    return 2.25
  }

  getIcon(): JSX.Element {
    return <Coffee className="h-5 w-5" />
  }
}

// Base Decorator
export abstract class CoffeeDecorator implements ICoffee {
  protected coffee: ICoffee

  constructor(coffee: ICoffee) {
    this.coffee = coffee
  }

  getDescription(): string {
    return this.coffee.getDescription()
  }

  getCost(): number {
    return this.coffee.getCost()
  }

  getIcon(): JSX.Element {
    return this.coffee.getIcon()
  }
}

// Concrete Decorators
export class MilkDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()} + Milk`
  }

  getCost(): number {
    return this.coffee.getCost() + 0.5
  }

  getIcon(): JSX.Element {
    return <Milk className="h-5 w-5" />
  }
}

export class SugarDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()} + Sugar`
  }

  getCost(): number {
    return this.coffee.getCost() + 0.3
  }

  getIcon(): JSX.Element {
    return <Sugar className="h-5 w-5" />
  }
}

export class WhippedCreamDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()} + Whipped Cream`
  }

  getCost(): number {
    return this.coffee.getCost() + 0.7
  }

  getIcon(): JSX.Element {
    return <CupSoda className="h-5 w-5" />
  }
}

export class CinnamonDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()} + Cinnamon`
  }

  getCost(): number {
    return this.coffee.getCost() + 0.2
  }

  getIcon(): JSX.Element {
    return <Sparkles className="h-5 w-5" />
  }
}

export class CaramelDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()} + Caramel`
  }

  getCost(): number {
    return this.coffee.getCost() + 0.6
  }

  getIcon(): JSX.Element {
    return <Candy className="h-5 w-5" />
  }
}

// Coffee type mapping
export const coffeeTypes = {
  "Black Coffee": BlackCoffee,
  Espresso: Espresso,
  Latte: Latte,
  Cappuccino: Cappuccino,
  Americano: Americano,
}

// Decorator mapping for visualization
export const decoratorMap = {
  Milk: MilkDecorator,
  Sugar: SugarDecorator,
  "Whipped Cream": WhippedCreamDecorator,
  Cinnamon: CinnamonDecorator,
  Caramel: CaramelDecorator,
}

// Icon mapping for add-ons
export const iconMap = {
  Milk: <Milk className="h-5 w-5" />,
  Sugar: <Sugar className="h-5 w-5" />,
  "Whipped Cream": <CupSoda className="h-5 w-5" />,
  Cinnamon: <Sparkles className="h-5 w-5" />,
  Caramel: <Candy className="h-5 w-5" />,
}

// Price mapping for add-ons
export const priceMap = {
  Milk: 0.5,
  Sugar: 0.3,
  "Whipped Cream": 0.7,
  Cinnamon: 0.2,
  Caramel: 0.6,
}

// Coffee color mapping
export const coffeeColorMap = {
  "Black Coffee": "bg-amber-900",
  Espresso: "bg-amber-950",
  Latte: "bg-amber-300",
  Cappuccino: "bg-amber-200",
  Americano: "bg-amber-800",
}
