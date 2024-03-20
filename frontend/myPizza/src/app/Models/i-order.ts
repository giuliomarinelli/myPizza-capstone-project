import { Product, ProductRef } from "./i-product"
import { Address } from "./i-user"

export interface OrderCheckModel {
  productId: string
  quantity: number | null
  isChecked: boolean
}

export interface OrderSetDTO {
  productId: string
  quantity: number
}

export interface OrderInitDTO {
  orderSetsDTO: OrderSetDTO[]
}

export interface OrderInitRes {
  orderId: string
  status: string
}

export type GetOrderIdRes = Omit<OrderInitRes, 'status'>

export interface OrderSet {
  id: string
  productRef: ProductRef
  quantity: number
}

export interface OrderCheckoutInfo {
  orderId: string
  address: Address
  orderSets: OrderSet[]
  status: string
  deliveryCost: number
  totalAmount: number
}
