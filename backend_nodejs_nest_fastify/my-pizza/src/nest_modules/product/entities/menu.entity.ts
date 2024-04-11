import { UUID } from "crypto";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MenuItem } from "./menu-item.entity";

@Entity({ name: 'menu' })
export class Menu {

    constructor(item: MenuItem) {
        this.item = item
        this.ord = 1
    }

    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @Column()
    ord: number

    @OneToOne(() => MenuItem, (menuItem) => menuItem.id, { eager: true })
    @JoinColumn({ name: 'item_id' })
    item: MenuItem

    

}