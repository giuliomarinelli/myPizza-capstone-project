import { Topping } from "../entities/topping.entity";

export type ToppingRes = Omit<Topping, 'setDescription' | 'products'>