import { WorkSessionType } from "../enums/work-session-type.enum"

export interface StartSessionDTO {
    type: WorkSessionType
    openTime: number
    closeTime: number
    cookCount: number
    ridersCount: number
}