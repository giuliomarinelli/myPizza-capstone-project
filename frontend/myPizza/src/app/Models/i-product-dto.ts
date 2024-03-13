export interface ProductDTO {
  name: string
  basePrice: number
  toppings: string[]
  category: string
}

export interface ProductErrorMsg {
  name: string
  basePrice: string
  toppings: string
  category: string
  newCategory: string
}

export interface ManyProductsPostDTO {
  products: ProductDTO[]
}


