import { Topping } from "./i-product"

export interface AddProduct {
  name: string |null
  basePrice: number |null
  category: string |null
  newCategory: string | null
  toppings: Topping[]
  i: number | null
  isValid: boolean
  deleted: boolean
}
