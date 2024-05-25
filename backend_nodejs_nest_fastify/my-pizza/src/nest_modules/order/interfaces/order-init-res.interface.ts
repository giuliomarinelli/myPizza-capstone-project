import { UUID } from "crypto";
import { OrderStatus } from "../enums/order-status.enum";

export interface OrderInitRes {
    orderId: UUID
    status: OrderStatus
}