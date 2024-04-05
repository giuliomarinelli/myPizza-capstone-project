import { UUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderSet } from "./order-set.entity";
import { Address } from "src/nest_modules/address/entities/address.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { TimeInterval } from "./time-interval.entity";
import { User } from "src/nest_modules/auth-user/entities/user.entity";

@Entity({ name: 'orders' })
export class Order {


    @PrimaryGeneratedColumn()
    id: UUID

    @OneToMany(() => OrderSet, (orderSet) => orderSet.order, { eager: true })
    orderSets: OrderSet[]

    @ManyToOne(() => Address, (address) => address.id)
    @JoinColumn({ name: 'address_id' })
    address: Address

    @Column({ name: 'order_time' })
    orderTime: number;

    @Column({ name: 'expected_delivery_time' })
    expectedDeliveryTime: number;

    @Column({ name: 'delivery_time' })
    deliveryTime: number;

    @Column()
    asap: boolean;

    @Column()
    status: OrderStatus

    @Column({ name: 'delivery_cost' })
    deliveryCost: number = 1.5

    //JsonIgnore
    @ManyToOne(() => TimeInterval, (timeInterval) => timeInterval.id)
    @JoinColumn({ name: 'time_interval_id' })
    TimeInterval: TimeInterval
    
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({name: 'completed_at'})
    completedAt: number

    @Column()
    guest: boolean



}