import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { City } from '../entities/city.entity';
import { CityAutoComplete } from '../interfaces/city-autocomplete.interface';
import { AddressDTO } from '../interfaces/address-dto.interface';
import { User } from 'src/nest_modules/auth-user/entities/user.entity';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressService {

    constructor(private dataSource: DataSource) { }

    private logger = new Logger("AddressService")

    private fixAccentInWord(word: string): string {
        if (word.endsWith("'")) {
            const ind: number = word.indexOf("'");
            switch (word.charAt(word.length - 2)) {
                case 'a': word = word.substring(0, ind - 1) + "à";
                case 'e': word = word.substring(0, ind - 1) + "è";
                case 'i': word = word.substring(0, ind - 1) + "ì";
                case 'o': word = word.substring(0, ind - 1) + "ò";
                case 'u': word = word.substring(0, ind - 1) + "ù";
            }
        }
        word = word.toLowerCase()
        return word.length > 3 ? word.charAt(0).toUpperCase() + word.substring(1) : word
    }

    private fixAccentAndCaseInName(name: string): string {
        const parts1: string[] = name.split(" ")
        const res: string = parts1.map(part => this.fixAccentInWord(part)).join(" ")
        return res.split("-").map(part => this.fixAccentInWord(part)).join("-")
    }

    public async fillCityTableFromDataSets(): Promise<void> {

        const cityRepository = this.dataSource.getRepository(City)

        if (await cityRepository.count() !== 0) throw new Error("cities table is not empty and is likely to have been already filled")

        try {

            const comuniItaliani: string = readFileSync('./src/nest_modules/address/data-sets/comuni-italiani.csv', 'utf-8')
            const provinceItaliane: string = readFileSync('./src/nest_modules/address/data-sets/province-italiane.csv', 'utf-8')

            const cRows: string[] = comuniItaliani.split("\n")
            const pRows: string[] = provinceItaliane.split("\n")

            // eslint-disable-next-line prefer-const
            for (let [i, cRow] of cRows.entries()) {
                if (i === 0) continue
                cRow = cRow.replaceAll(';;', ';')
                const cRowParts = cRow.split(';')
                const name: string = this.fixAccentAndCaseInName(cRowParts[1])
                let provinceName: string = ''
                const provinceCode: string = cRowParts[2]
                let region: string = ''
                for (const [j, pRow] of pRows.entries()) {
                    if (j === 0) continue
                    const pRowParts: string[] = pRow.split(';')
                    if (pRowParts[0] === provinceCode) {
                        provinceName = pRowParts[1]
                        region = pRowParts[2]
                        break
                    }
                }

                cityRepository.save(new City(i, name, provinceCode, provinceName, region))
                this.logger.log(`Saved new city => ${name}`)
            }

        } catch (err) {
            this.logger.error('Error => ' + err)
        }

    }

    public async cityAutoComplete(q: string, limit?: number): Promise<CityAutoComplete[]> {
        const _limit = limit || 10
        const foundCities: City[] = await this.dataSource
            .getRepository(City)
            .createQueryBuilder('city')
            .where('LOWER(city.name) LIKE LOWER(:name)', { name: `%${q}%` })
            .limit(_limit)
            .getMany()
        const autocompletes: CityAutoComplete[] = []
        foundCities.forEach(city => autocompletes.push({
            autocomplete: `${city.name} (${city.provinceCode})`,
            name: city.name,
            provinceCode: city.provinceCode
        }))
        return autocompletes
    }

    public async createAddress(addressDTO: AddressDTO, user: User): Promise<Address> {

        const addressRepository = this.dataSource.getRepository(Address)
        const cityRepository = this.dataSource.getRepository(City)

        const defaultAddresses: number = await addressRepository
            .createQueryBuilder('address')
            .where('address._default = true')
            .andWhere('address.user = :userId', { userId: user.id })
            .getCount()
        

        if (defaultAddresses > 1) throw new InternalServerErrorException('There are many default addresses',
            { cause: new Error(), description: 'Internal Server Error' })

        const _default: boolean = !defaultAddresses

        const city: City | null | undefined = await cityRepository
            .createQueryBuilder('city')
            .where('city.name = :name', { name: addressDTO.city })
            .andWhere('city.provinceCode = :code', { code: addressDTO.province })
            .getOne()

        if (!city) throw new BadRequestException(`City with name=${addressDTO.city} and province=${addressDTO.province} doesn't exist`,
            { cause: new Error(), description: 'Bad Request' })

        const address = new Address(addressDTO.road, addressDTO.civic, city, user, _default)

        return await addressRepository.save(address)

    }

}
