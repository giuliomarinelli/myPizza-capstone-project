import { ProductDTO } from "./i-product-dto"

export interface Topping {
  name: string
  price: number
  description: string
  createdAt: number
}

export type _Toppings = Topping | boolean

export type ToppingDTO = Omit<Topping, 'createdAt' | 'description'>

export interface OnToppingUpdate {
  topping: Topping
  i: number
}

export type OnToppingCreate = OnToppingUpdate

export interface ToppingRes {
  toppings: Topping[]
}

export interface Product {
  name: string
  toppings: Topping[]
  basePrice: number
  category: string
  price: number
  createdAt: number
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

export interface OnProductUpdate {
  i: number
  product: ProductDTO
}
