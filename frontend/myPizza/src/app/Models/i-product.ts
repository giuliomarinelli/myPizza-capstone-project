export interface Topping {
  name: string
  price: number
  description: string
}

export interface ToppingRes {
  toppings: Topping[]
}

export interface Product {
  id: string
  toppings: Topping[]
  basePrice: number
  category: string
  price: number
}

export interface ProductNamesRes {
  productNames: string[]
}

export interface CategoriesRes {
  categories: string[]
}

export interface ProductValidation {
  isValid: boolean
  i: number
}
