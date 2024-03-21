import { Order } from "./i-order"

export interface TimeInterval {
  id: string
  startsAt: number
  endsAt: number
}

export interface IsThereAnActiveSessionRes {
  thereAnActiveSession: boolean
}

export interface StartSessionDTO {
  type: string
  openTime: number
  closeTime: number
  cookCount: number
  ridersCount: number
}

export interface _Session {
  id: string
  timeIntervals: TimeInterval[]
  active: boolean

}
