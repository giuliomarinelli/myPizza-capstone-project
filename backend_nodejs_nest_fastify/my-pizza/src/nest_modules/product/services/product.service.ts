import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from '../entities/topping.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Menu } from '../entities/menu.entity';
import { ToppingRes } from '../interfaces/topping-res.interface';
import { ToppingType } from '../enums/topping-type.enum';
import { ToppingDTO } from '../interfaces/topping-dto.interface';
import { UUID } from 'crypto';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';


@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Topping) private toppingRepository: Repository<Topping>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Menu) private menuRepository: Repository<Menu>
    ) { }

    // ._._._._._._._._._._._._._._ TOPPINGS ._._._._._._._._._._._._._._

    public async findAllToppings(type?: ToppingType): Promise<ToppingRes[]> {
        return (await this.toppingRepository.find()).filter(topping => {
            if (type) {
                return topping.type === type
            }
            return topping
        }).map(topping => {
            topping.setDescription()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return this.generateToppingResModel(topping)
        })
    }

    private async findAllToppingNames(): Promise<string[]> {
        return (await this.toppingRepository
            .createQueryBuilder('topping')
            .select(['topping.name'])
            .getMany()).map(topping => topping.name)
    }

    private generateToppingResModel(topping: Topping): ToppingRes {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { setDescription, products, ...toppingRes } = topping
        return toppingRes
    }

    private async findToppingById(id: UUID): Promise<Topping> {
        return await this.toppingRepository.findOneBy({ id })
    }

    public async addTopping(toppingDTO: ToppingDTO): Promise<ToppingRes> {
        if ((await this.findAllToppingNames()).includes(toppingDTO.name))
            throw new BadRequestException(`topping with name=${toppingDTO.name} already exist`,
                { cause: new Error(), description: 'Bad Request' })
        const topping = new Topping(toppingDTO.name, toppingDTO.price, toppingDTO.type)
        return await this.toppingRepository.save(topping)
    }

    public async updateToppingByName(oldName: string, toppingDTO: ToppingDTO): Promise<ToppingRes> {
        const topping: Topping | null | undefined = await this.toppingRepository.findOneBy({ name: oldName })
        if (!topping) throw new BadRequestException(`topping with name=${oldName} doesn't exist`,
            { cause: new Error(), description: 'Bad Request' })
        await this.toppingRepository.update({ ...toppingDTO }, topping)
        const newTopping = await this.findToppingById(topping.id)
        newTopping.setDescription()
        return this.generateToppingResModel(newTopping)
    }

    public async deleteToppingByName(name: string): Promise<ConfirmRes> {
        const topping: Topping | null | undefined = await this.toppingRepository.findOne({ where: { name }, relations: { products: true } })
        if (!topping) throw new BadRequestException(`topping with name=${name} doesn't exist`,
            { cause: new Error(), description: 'Bad Request' })
        topping.products.forEach(async (product) => {
            const i: number = product.toppings.indexOf(topping)
            if (i !== - 1) {
                product.toppings.splice(i, 1)
                await this.productRepository.save(product)
            }
        })
        await this.toppingRepository.delete({ id: topping.id })
        return {
            statusCode: HttpStatus.NO_CONTENT,
            timestamp: new Date().getTime(),
            message: `topping with name=${name} deleted successfully`
        }
    }

     // ._._._._._._._._._._._._._._ PRODUCTS ._._._._._._._._._._._._._._

     

}
