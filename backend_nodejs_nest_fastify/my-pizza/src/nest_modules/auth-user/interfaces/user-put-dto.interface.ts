import { Gender } from "../enums/gender.enum"
export interface UserPutDTO {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    gender: Gender
}
