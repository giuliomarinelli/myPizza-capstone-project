import { UUID } from "crypto";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class MenuItem {
    
    @PrimaryGeneratedColumn()
    id: UUID
    
}