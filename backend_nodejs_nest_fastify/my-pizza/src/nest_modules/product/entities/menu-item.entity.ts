import { UUID } from "crypto";
import { Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class MenuItem {

    @PrimaryGeneratedColumn("uuid")
    id: UUID

}