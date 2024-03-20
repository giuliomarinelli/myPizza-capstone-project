import { User } from "./i-user";

export interface RestoreMessageDTO {
  restore: boolean
}

export interface MessageDTO {
  recipientUserId: string
  order?: any // da implementare
  message: string
}

export interface Message {

  id: string

  senderUser: User

  recipientUser: User

  order: null // da aggiornare

  _from: string

  _to: string

  message: string

  sentAt: number

  wasUserOnLine: boolean

  read: boolean

  restore: boolean
}

export interface MessageMng {
  message: Message
  add: boolean
  delete: boolean
}
