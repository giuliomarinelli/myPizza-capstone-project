import { UUID } from "crypto";
import { Address } from "src/nest_modules/address/entities/address.entity";
import { OrderSet } from "../entities/order-set.entity";
import { OrderStatus } from "../enums/order-status.enum";

export interface OrderCheckoutInfo {
    orderId: UUID
    address: Address
    orderSets: OrderSet[];
    status: OrderStatus;
    deliveryCost: number
    totalAmount: number
}