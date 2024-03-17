import { User } from "./i-user";

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
}

export interface MessageMng {
  message: Message
  add: boolean
  delete: boolean
}
