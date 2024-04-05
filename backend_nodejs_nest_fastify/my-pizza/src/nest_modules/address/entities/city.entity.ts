import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'cities' })
export class City {

    constructor(id: number, name: string, provinceCode: string, provinceName: string, region: string) {
       this.id = id
       this.name = name
       this.provinceCode = provinceCode
       this.provinceName = provinceName
       this.region = region
    }

    @PrimaryColumn()
    id: number

    @Column()
    name: string
    
    @Column({name: 'province_code'})
    provinceCode: string

    @Column({name: 'province_name'})
    provinceName: string

    @Column()
    region: string

}