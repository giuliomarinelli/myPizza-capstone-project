import { UUID } from "crypto";
import { ItemType } from "../enums/item-type.enum";
import { ToppingRes } from "./topping-res.interface";
import { Category } from "../entities/category.entity";

export interface MenuItemRes {
    id: UUID
    name: string;
    type: ItemType;
    toppings?: ToppingRes[];
    basePrice?: number;
    category?: Category;
    createdAt?: number;
    price?: number;
}