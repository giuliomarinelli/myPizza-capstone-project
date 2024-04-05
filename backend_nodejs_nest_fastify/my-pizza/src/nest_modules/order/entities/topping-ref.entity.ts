import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'toppings_ref'})
export class ToppingRef {

    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }

    @PrimaryGeneratedColumn()
    id: UUID

    @Column()
    name: string

    @Column()
    price: number

}