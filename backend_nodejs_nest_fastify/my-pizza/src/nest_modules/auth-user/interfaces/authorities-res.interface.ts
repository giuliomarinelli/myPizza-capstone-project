import { UserScope } from "../enums/user-scope.enum";

export interface AuthoritiesRes {
    authorities: UserScope[]
}