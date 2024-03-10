export interface UserRegister {
  firstName: string
  lastName: string
  email: string
  prefix: string
  phoneNumber: string
  gender: string
  password: string
  confirmPassword: string
  address: AddressRegisterDTO
}

export type UserPostDTO = Omit<UserRegister, 'confirmPassword'>

export interface AddressRegisterDTO {
  road: string
  civic: string
  cityAutocomplete: string
  city: string
  province: string
}

export type AddressDTO = Omit<AddressRegisterDTO, 'cityAutocomplete'>

export interface UserLogin {
  email: string
  password: string
}
