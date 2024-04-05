import { UUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { ProductRef } from "./product-ref.entity";

@Entity({ name: 'order_sets' })
export class OrderSet {

    constructor(productRef: ProductRef, quantity: number) {
        this.productRef = productRef
        this.quantity = quantity
    }

    @PrimaryGeneratedColumn()
    id: UUID

    @ManyToOne(() => ProductRef, (productRef) => productRef.id)
    @JoinColumn({ name: 'product_ref_id'})
    productRef: ProductRef

    // Json Ignore
    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: 'order_id' })
    order: Order

    @Column()
    quantity: number



}