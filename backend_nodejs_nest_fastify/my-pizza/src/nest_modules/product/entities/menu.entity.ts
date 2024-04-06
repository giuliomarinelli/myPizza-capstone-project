import { UUID } from "crypto";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MenuItem } from "./menu-item.entity";

@Entity({name: 'menu'})
export class Menu {

    constructor(item: MenuItem) {
        this.item = item
    }

    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @OneToOne(() => MenuItem, (menuItem) => menuItem.id)
    @JoinColumn({name: 'item_id'})
    item: MenuItem

}