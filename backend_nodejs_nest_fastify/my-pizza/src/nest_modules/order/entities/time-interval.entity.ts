import { UUID } from "crypto";
import { Column, Entity,  ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { WorkSession } from "./work-session.entity";

@Entity({ name: 'time_intervals' })
export class TimeInterval {

    private constructor(startsAt: number, endsAt: number) {
        this.startsAt = startsAt
        this.endsAt = endsAt
    }

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @OneToMany(() => Order, (order) => order.id, { eager: true })
    orders: Order[]

    @Column({ name: 'starts_at', type: "bigint" })
    startsAt: number

    @Column({ name: 'ends_at', type: "bigint" })
    endsAt: number

    @ManyToOne(() => WorkSession, (workSession) => workSession.timeIntervals, { lazy: true })
    workSession: WorkSession

    public static getTimeIntervals(startsAllAt: number, endsAllAt: number): TimeInterval[] {
        const timeIntervals: TimeInterval[] = []
        const startTime = new Date()
        const endTime = new Date()
        startTime.setTime(startsAllAt)
        startTime.setMinutes(Math.floor(startTime.getMinutes() / 15) * 15)
        endTime.setTime(endsAllAt)
        endTime.setMinutes(Math.floor(startTime.getMinutes() / 15) * 15)

        while (startTime.getTime() < endTime.getTime()) {
            const tempEndTime = new Date()
            tempEndTime.setTime(startTime.getTime() + 15 * 60000)
            const timeInterval = new TimeInterval(startTime.getTime(), tempEndTime.getTime())
            startTime.setTime(tempEndTime.getTime())
            timeIntervals.push(timeInterval)
        }

        return timeIntervals

    }

}