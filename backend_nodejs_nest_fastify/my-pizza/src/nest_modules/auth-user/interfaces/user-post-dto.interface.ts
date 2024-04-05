import { AddressDTO } from './../../address/interfaces/address-dto.interface';
import { Gender } from "../enums/gender.enum"
export interface UserPostDTO {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    password: string
    gender: Gender
    address: AddressDTO
}