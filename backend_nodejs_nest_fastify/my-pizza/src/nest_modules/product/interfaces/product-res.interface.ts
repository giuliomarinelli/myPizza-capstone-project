import { UUID } from "crypto";
import { Category } from "../entities/category.entity";
import { ItemType } from "../enums/item-type.enum";
import { ToppingRes } from "./topping-res.interface";


export interface ProductRes {
    id: UUID
    name: string;
    type: ItemType;
    toppings: ToppingRes[];
    basePrice: number;
    category: Category;
    createdAt: number;
    price: number;
}