import { UUID } from "crypto";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ToppingRef } from "./topping-ref.entity";

@Entity({ name: 'products_ref' })
export class ProductRef {

    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @Column()
    name: string

    @ManyToMany(() => ToppingRef, (toppingRef) => toppingRef.id, { eager: true })
    @JoinTable({
        name: 'products_ref_toppings_ref',
        joinColumn: { name: 'product_ref_id' },
        inverseJoinColumn: { name: 'topping_ref_id' }
    })
    toppingsRef: ToppingRef[]

    price: number
}