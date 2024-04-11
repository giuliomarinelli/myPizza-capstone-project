import { UUID } from "crypto";

export interface OrderSetDTO {
    productId: UUID
    quantity: number
}