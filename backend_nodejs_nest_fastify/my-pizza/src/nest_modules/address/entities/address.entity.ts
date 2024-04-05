import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { City } from "./city.entity";
import { User } from "src/nest_modules/auth-user/entities/user.entity";

@Entity({ name: 'addresses' })
export class Address {

    constructor(road: string, civic: string, city: City, user: User, _default: boolean) {
        this.road = road;
        this.civic = civic;
        this.city = city;
        this.user = user;
        this._default = _default;
    }

    @PrimaryGeneratedColumn()
    id: UUID;
    
    @Column()
    road: string;
    
    @Column()
    civic: string;

    @ManyToOne(() => City, (city) => city.id, { eager: true })
    @JoinColumn({ name: "city_id" })
    city: City;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: "user_id" })
    user: User;

    _default: boolean;

}