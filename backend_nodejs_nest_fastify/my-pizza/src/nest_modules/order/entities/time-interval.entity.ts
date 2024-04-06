import { UUID } from "crypto";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: 'time_intervals' })
export class TimeInterval {

    private constructor(startsAt: number, endsAt: number) {
        this.startsAt = startsAt
        this.endsAt = endsAt
    }

    @PrimaryGeneratedColumn()
    id: UUID

    @OneToMany(() => Order, (order) => order.id, { eager: true })
    orders: Order[]

    @Column({ name: 'starts_at' })
    startsAt: number

    @Column({ name: 'ends_at' })
    endsAt: number

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