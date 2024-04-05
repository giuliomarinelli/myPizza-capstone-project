import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ToppingType } from "../enums/topping-type.enum";

@Entity({ name: 'toppings' })
export class Topping {

    constructor(name: string, price: number, type: ToppingType) {
        this.name = name;
        this.price = price;
        this.type = type;
        this.createdAt = new Date().getTime()
    }

    @PrimaryGeneratedColumn()
    id: UUID

    @Column()
    name: string

    @Column()
    price: number

    @Column()
    createdAt: number

    @Column()
    type: ToppingType

    description: string

    public setDescription(): void {
        this.description = `${this.name} (${this.price.toFixed(2)}€)`
    }

    // lato inverso della ManyToMany con Product. Non credo sia necessario
  

}