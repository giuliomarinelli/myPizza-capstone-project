import { Category, Product } from "./i-product"

export interface Menu {
  id: string
  item: Product | Category
}
