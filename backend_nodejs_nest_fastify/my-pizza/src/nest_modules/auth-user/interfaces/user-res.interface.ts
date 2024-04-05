import { User } from "../entities/user.entity";
import { Authority } from "./authority.interface";

type UserOmits = Omit<User, 'scope' | 'hashPassword' | 'generateAvatar' | 'addresses'>

interface Authorities {
    authorities: Authority[]
}

export type UserRes = UserOmits & Authorities