export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profileImage: string
  createdAt: Date
  lastUpdate: Date
  messagingUsername: string
  _2FA: string | null
  authorities: Autority[]
  gender: string
}

export interface Autority {
  authority: string
}

export interface AuthoritiesRes {
  authorities: string[]
}
