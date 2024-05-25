import { UUID } from "crypto";
import { Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
@TableInheritance({ column: { type: "varchar", name: "_type" } })
@Entity({ name: 'menu_items' })
export class MenuItem {

    @PrimaryGeneratedColumn("uuid")
    id: UUID

   

}