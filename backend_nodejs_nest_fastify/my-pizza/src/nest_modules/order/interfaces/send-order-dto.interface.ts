import { UUID } from "crypto"
import { Address } from "src/nest_modules/address/entities/address.entity"

export interface SendOrderDTO {
    orderId: UUID
    asap: boolean
    expectedDeliveryTime: number
    address: Address
}