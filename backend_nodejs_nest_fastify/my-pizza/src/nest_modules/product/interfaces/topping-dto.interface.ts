import { ToppingType } from "../enums/topping-type.enum"

export interface ToppingDTO {
    name: string
    price: number
    type: ToppingType
}