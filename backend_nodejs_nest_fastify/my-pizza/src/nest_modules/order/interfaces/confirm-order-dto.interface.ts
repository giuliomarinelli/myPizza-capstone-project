import { UUID } from "crypto";

export interface ConfirmOrderDTO {
    orderId: UUID
    timeIntervalId: UUID
}