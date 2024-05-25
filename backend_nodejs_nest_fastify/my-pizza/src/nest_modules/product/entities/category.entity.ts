import { ChildEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { ItemType } from "../enums/item-type.enum";
import { UUID } from "crypto";


@ChildEntity()
export class Category extends MenuItem {

    @PrimaryGeneratedColumn("uuid")
    id: UUID

    constructor(name: string) {
        super()
        this.name = name
    }

   

   

    @Column({ unique: true })
    name: string

    @Column()
    type: ItemType = ItemType.CATEGORY

}