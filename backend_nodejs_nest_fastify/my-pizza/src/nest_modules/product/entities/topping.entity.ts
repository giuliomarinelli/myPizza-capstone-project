import { UUID } from "crypto";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ToppingType } from "../enums/topping-type.enum";
import { Product } from "./product.entity";


@Entity({ name: 'toppings' })
export class Topping {

    constructor(name: string, price: number, type: ToppingType) {
        this.name = name;
        this.price = price;
        this.type = type;
        this.createdAt = new Date().getTime()
    }

    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @Column({ unique: true })
    name: string

    @Column()
    price: number

    @Column({ name: 'created_at', type: "bigint" })
    createdAt: number

    @Column()
    type: ToppingType

    description: string

    public setDescription(): void {
        this.description = `${this.name} (${this.price.toFixed(2)}€)`
    }

    @ManyToMany(() => Product, (product) => product.toppings)
    products: Product[]


}