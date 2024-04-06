import { UUID } from "crypto";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enums/gender.enum";
import { _2FAStrategy } from "../enums/_2fa-strategy.enum";
import { UserScope } from "../enums/user-scope.enum";
import { Address } from "src/nest_modules/address/entities/address.entity";

@Entity({ name: 'users' })
export class User {

    constructor(firstName: string, lastName: string, email: string, hashPassword: string, phoneNumber: string, gender: Gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashPassword = hashPassword;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.scope = [UserScope.USER];
        this.createdAt = new Date().getTime()
        this.lastUpdate = new Date().getTime()
        this.messagingUsername = firstName + " " + lastName;
        this.profileImage = this.generateAvatar();
    }

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'hash_password' })
    hashPassword: string;

    @Column({ name: 'phone_number', unique: true })
    phoneNumber: string;

    @Column()
    gender: Gender;

    @Column({ name: 'profile_image' })
    profileImage: string;

    @Column({ name: 'created_at', type: "bigint" })
    createdAt: number;

    @Column({ name: 'last_update', type: "bigint" })
    lastUpdate: number;

    @Column({ name: 'messaging_username' })
    messagingUsername: string;


    @Column({ name: 'guest_email', nullable: true, default: null })
    guestEmail: string;


    // @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
    // private List<Order> orders = new ArrayList<>();


    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @Column({ default: null })
    _2FA: _2FAStrategy

    @Column("simple-array")
    scope: UserScope[];


    public generateAvatar(): string {
        return "https://ui-avatars.com/api/?name=" + this.firstName + "+" + this.lastName;
    }

}