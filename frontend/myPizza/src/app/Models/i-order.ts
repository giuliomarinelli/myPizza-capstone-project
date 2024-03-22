import { Product, ProductRef } from "./i-product"
import { Address, User } from "./i-user"
import { TimeInterval } from "./i_session"

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

export interface Order {
  id: string
  orderSets: OrderSet[]
  address: Address
  orderTime: number
  expectedDeliveryTime: number
  deliveryTime: number
  asap: boolean
  status: string
  deliveryCost: number
  timeInterval: TimeInterval
  user: User
}

export interface SendOrderDTO {
  orderId: string
  asap: boolean
  expectedDeliveryTime: number
  address: Address
}
