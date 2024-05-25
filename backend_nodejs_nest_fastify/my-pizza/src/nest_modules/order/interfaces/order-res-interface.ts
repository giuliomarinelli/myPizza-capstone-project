import { Order } from "../entities/order.entity";

export type OrderRes = Omit<Order, 'timeInterval'>