import { UUID } from "crypto";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimeInterval } from "./time-interval.entity";
import { WorkSessionType } from "../enums/work-session-type.enum";

@Entity({ name: 'work_sessions' })
export class WorkSession {

    constructor(type: WorkSessionType, openTime: number, closeTime: number, cookCount: number, ridersCount: number) {
        this.type = type;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.cookCount = cookCount;
        this.ridersCount = ridersCount;
        this.maxAdvicedOrdersPerTimeInterval = cookCount * ridersCount;
    }

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @OneToMany(() => TimeInterval, (timeInterval) => timeInterval.workSession, { eager: true })
    timeIntervals: TimeInterval[]

    @Column()
    active: boolean

    @Column()
    type: WorkSessionType

    @Column({ name: 'open_time', type: 'bigint'})
    openTime: number

    @Column({ name: 'close_time', type: 'bigint'})
    closeTime: number

    @Column({ name: 'cook_count' })
    cookCount: number

    @Column({ name: 'riders_count' })
    ridersCount: number

    @Column({ name: 'max_adviced_orders_per_time_interval' })
    maxAdvicedOrdersPerTimeInterval: number


}