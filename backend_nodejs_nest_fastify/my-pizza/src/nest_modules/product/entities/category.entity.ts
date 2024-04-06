import { ChildEntity, Column } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { ItemType } from "../enums/item-type.enum";

@ChildEntity()
export class Category extends MenuItem {

    constructor(name: string) {
        super()
        this.name = name
    }

    @Column()
    name: string

    @Column()
    type: ItemType = ItemType.CATEGORY

}