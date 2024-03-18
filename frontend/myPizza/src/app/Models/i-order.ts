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
