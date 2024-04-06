import { ChildEntity, Column, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { ItemType } from "../enums/item-type.enum";
import { Topping } from "./topping.entity";
import { Category } from "./category.entity";

@ChildEntity()
export class Product extends MenuItem {

    constructor(name: string, basePrice: number, category: Category) {
        super()
        this.name = name;
        this.basePrice = basePrice;
        this.category = category;
        this.createdAt = new Date().getTime()
    }

    @Column({ unique: true })
    name: string

    @Column()
    type: ItemType = ItemType.PRODUCT;

    @ManyToMany(() => Topping, (topping) => topping.id, { eager: true })
    @JoinTable({
        name: 'products_toppings',
        joinColumn: { name: 'product_id' },
        inverseJoinColumn: { name: 'topping_id' }
    })
    toppings: Topping[]

    @Column({ name: 'base_price' })
    basePrice: number

    @ManyToOne(() => Category, (category) => category.id, { eager: true })
    @JoinColumn({ name: "category_id" })
    category: Category

    @Column({ name: 'created_at', type: 'bigint' })
    createdAt: number

    price: number


    public setProductTotalAmount(): void {
        this.price = this.toppings.map(topping => topping.price).reduce((c, p) => c + p) + this.basePrice;
    }

}