import { UUID } from "crypto";
import { Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity({ name: 'menu_items' })
@TableInheritance({ column: { type: "varchar", name: "_type" } })
export abstract class MenuItem {

    @PrimaryGeneratedColumn("uuid")
    id: UUID

}