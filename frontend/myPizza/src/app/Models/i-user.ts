export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profileImage: string
  createdAt: number
  lastUpdate: number
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

export interface AdminUserIdRes {
  adminUserId: string
}

export interface Address {
  id: string
  road: string
  civic: string
  city: City
  _default: boolean
}

export interface City {
  id: number
  name: string
  provinceCode: string
  provinceName: string
  region: string
}

export interface AddressesRes {
  addresses: Address[]
}
