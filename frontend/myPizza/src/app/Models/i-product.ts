import { ProductDTO } from "./i-product-dto"

export interface Topping {
  name: string
  price: number
  description: string
  createdAt: number
  type: string
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

export interface Category {
  id: string
  name: string
  type: string

}

export interface Product {
  id: string
  name: string
  toppings: Topping[]
  type: string
  basePrice: number
  category: Category
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

export interface ToppingRef {
  id: string
  name: string
  price: number
}

export interface ProductRef {
  id: string
  name: string
  price: number
  toppingsRef: ToppingRef[]
}
