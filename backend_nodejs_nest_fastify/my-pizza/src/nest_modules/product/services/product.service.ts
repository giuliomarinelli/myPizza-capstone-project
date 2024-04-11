import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from '../entities/topping.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Menu } from '../entities/menu.entity';
import { ToppingRes } from '../interfaces/topping-res.interface';
import { ToppingType } from '../enums/topping-type.enum';
import { ToppingDTO } from '../interfaces/topping-dto.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ManyproductsPostDTO } from '../interfaces/many-products-post-dto.interface';
import { ProductRes } from '../interfaces/product-res.interface';
import { ProductDTO } from '../interfaces/product-dto.interface';


@Injectable()
export class ProductService {

    private logger = new Logger('ProductService')

    constructor(
        @InjectRepository(Topping) private toppingRepository: Repository<Topping>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Menu) private menuRepository: Repository<Menu>,
        private dataSource: DataSource
    ) { }

    // ._._._._._._._._._._._._._._ TOPPINGS ._._._._._._._._._._._._._._

    public async findAllToppings(type?: ToppingType): Promise<ToppingRes[]> {
        return (await this.toppingRepository.find()).filter(topping => {
            if (type) {
                return topping.type === type
            }
            return true
        }).map(topping => this.generateToppingResModel(topping))
    }

    // private async findAllToppingNames(): Promise<string[]> {
    //     return (await this.toppingRepository
    //         .createQueryBuilder('topping')
    //         .select(['topping.name'])
    //         .getMany()).map(topping => topping.name)
    // }

    private generateToppingResModel(topping: Topping): ToppingRes {
        topping.setDescription()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { setDescription, products, id, ...toppingRes } = topping
        return { id, ...toppingRes }
    }

    private async findToppingByName(name: string): Promise<Topping | null | undefined> {
        return await this.toppingRepository.findOneBy({ name })
    }

    public async addTopping(toppingDTO: ToppingDTO): Promise<ToppingRes> {

        const topping = new Topping(toppingDTO.name, toppingDTO.price, toppingDTO.type)

        try {
            await this.toppingRepository.save(topping)
        } catch (e) {
            if (e.message) {
                if (typeof e.message === 'string') {
                    if (e.message.includes('Duplicate entry'))
                        throw new BadRequestException(`topping with name=${toppingDTO.name} already exist`)
                }
            }
            throw new InternalServerErrorException('Database error')
        }
        return this.generateToppingResModel(topping)
    }

    public async updateToppingByName(oldName: string, toppingDTO: ToppingDTO): Promise<ToppingRes> {
        const topping: Topping | null | undefined = await this.findToppingByName(oldName)
        if (!topping) throw new BadRequestException(`topping with name=${oldName} doesn't exist`,
            { cause: new Error(), description: 'Bad Request' })
        topping.name = toppingDTO.name
        topping.price = toppingDTO.price
        topping.type = toppingDTO.type
        try {
            await this.toppingRepository.save(topping)
        } catch (e) {
            if (e.message) {
                if (typeof e.message === 'string') {
                    if (e.message.includes('Duplicate entry'))
                        throw new BadRequestException(`topping with name=${toppingDTO.name} already exist`)
                }
            }
            throw new InternalServerErrorException('Database error')
        }
        topping.setDescription()
        return this.generateToppingResModel(topping)
    }

    public async deleteToppingByName(name: string): Promise<ConfirmRes> {

        const topping: Topping | null | undefined = await this.findToppingByName(name)

        if (!topping) throw new BadRequestException(`Topping with name='${name}' you're trying to delete doesn't exist`)

        if (topping.products) {
            for await (const product of topping.products) {
                const i: number = product.toppings?.indexOf(topping)
                if (i !== - 1) product.toppings?.splice(i, 1)
                await this.productRepository.save(product)
            }
        }

        await this.toppingRepository.delete(topping.id)

        return {
            statusCode: HttpStatus.OK,
            timestamp: new Date().getTime(),
            message: `topping with name='${name}' has been successfully deleted`
        }

    }

    // ._._._._._._._._._._._._._._ CATEGORIES ._._._._._._._._._._._._._._

    public generateCategoryResModel(category: Category): Category {
        const {id, ...otherProps} = category
        return {
            id,
            ...otherProps
        }
    }
    
    private async findCategoryByName(name: string): Promise<Category | null | undefined> {
        return await this.categoryRepository.findOneBy({ name })
    }

    public async isPresentCategory(name: string): Promise<boolean> {
        return !!await this.findCategoryByName(name)
    }

    public async getAllCategoryNames(): Promise<string[]> {
        const results = (await this.categoryRepository
            .createQueryBuilder('category')
            .select(['category.name'])
            .getMany()).map(category => category.name)
        results.unshift('(seleziona una categoria)')
        results.push('- Inserisci nuova -')
        return results
    }

    public async productsHaveNotCategory(category: Category): Promise<boolean> {
        return !await this.productRepository
            .createQueryBuilder('product')
            .where('product.category = :category_id', { category_id: category.id })
            .getCount()
    }

    // ._._._._._._._._._._._._._._ PRODUCTS ._._._._._._._._._._._._._._

    public generateProductResModel(product: Product): ProductRes {
        
        product.setProductTotalAmount()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { setProductTotalAmount, id, toppings, category, ...productResOthers } = product
        const toppingResList: ToppingRes[] = []
        toppings.forEach(topping => toppingResList.push(this.generateToppingResModel(topping)))
        
        return {
            id, // per farlo apparire per primo
            ...productResOthers,
            category: this.generateCategoryResModel(category),
            toppings: toppingResList
        }

    }

    public async getAllProducts(options: IPaginationOptions): Promise<Pagination<ProductRes>> {
        const results = await paginate<Product>(this.productRepository, options)
        return new Pagination<ProductRes>(
            results.items.map(product => this.generateProductResModel(product)),
            results.meta
        )
    }

    public async findProductByName(name: string): Promise<Product | null | undefined> {
        return this.productRepository.findOneBy({ name })
    }

    public async addManyProducts(manyProductsPostDTO: ManyproductsPostDTO): Promise<ProductRes[]> {

        // Exception handling start
        for await (const productDTO of manyProductsPostDTO.products) {
            if (!!await this.findProductByName(productDTO.name))
                throw new BadRequestException(`product with name=${productDTO.name} already exist`,
                    { cause: new Error(), description: 'Bad Request' })

            for await (const name of productDTO.toppings) {
                if (!await this.toppingRepository.findOneBy({ name }))
                    throw new BadRequestException(`topping with name=${name} doesn't exist`,
                        { cause: new Error(), description: 'Bad Request' })
            }
        }
        // Exception handling finish

        const addedProducts: Product[] = []

        for await (const productDTO of manyProductsPostDTO.products) {

            let category: Category

            if (await this.isPresentCategory(productDTO.category)) {
                category = await this.findCategoryByName(productDTO.category)
            } else {
                category = new Category(productDTO.category)
                await this.categoryRepository.save(category)
                await this.menuRepository.save(new Menu(category))
            }

            const newProduct = new Product(productDTO.name, productDTO.basePrice, category)

            newProduct.toppings = []
            /* Altrimenti è undefined se non ci sono topping, 
            questa è una differenza sostanziale di TypeOrm rispetto ad Hibernate che invece dà una lista vuota */

            for await (const name of productDTO.toppings) {
                newProduct.toppings.push(await this.findToppingByName(name))
            }

            addedProducts.push(newProduct)
        }

        try {
            await this.productRepository.save(addedProducts)
        } catch {
            throw new InternalServerErrorException('Database error')
        }

        await this.productRepository.save(addedProducts)

        const menuProducts: Menu[] = addedProducts.map(product => new Menu(product))

        await this.menuRepository.save(menuProducts)

        return addedProducts.map(product => this.generateProductResModel(product))

    }


    public async updateProductByName(oldName: string, productDTO: ProductDTO): Promise<ProductRes> {

        const product = await this.findProductByName(oldName)

        if (!product)
         throw new BadRequestException(`the product with name='${oldName}' you're trying to update doesn't exist`)
           
        const menu: Menu = await this.menuRepository.findOneBy({ item: { id: product.id } })
        await this.menuRepository.delete(menu.id)

        const sentCategory: Category | null | undefined = await this.findCategoryByName(productDTO.category)
        const oldCategory: Category = product.category


        if (sentCategory) {
            if (sentCategory !== product.category) {
                product.category = sentCategory
                await this.productRepository.save(product)

            }
        } else {
            const newCategory = new Category(productDTO.category)
            await this.categoryRepository.save(newCategory)
            await this.menuRepository.save(new Menu(newCategory))
            product.category = newCategory
            await this.productRepository.save(product)

        }

        if (await this.productsHaveNotCategory(oldCategory)) {
            await this.categoryRepository.delete(oldCategory.id)
            await this.menuRepository.delete({ item: { id: oldCategory.id } })
        }

        product.name = productDTO.name
        product.basePrice = productDTO.basePrice

        product.toppings = []

        for await (const name of productDTO.toppings) {
            const topping: Topping | null | undefined = await this.findToppingByName(name)
            if (!topping)
                throw new BadRequestException(`topping with name='${name}' you're trying to update doesn't exist`, {
                    cause: new Error(), description: 'Bad request'
                })
            product.toppings.push(topping)
        }


        try {
            await this.productRepository.save(product)
        } catch (e) {
            if (e.message) {
                if (typeof e.message === 'string') {
                    if (e.message.includes('Duplicate entry'))
                        throw new BadRequestException(`product with name='${product.name}' already exist`)
                }
            }
            throw new InternalServerErrorException('Database error')
        } finally {
            await this.menuRepository.save(new Menu(product))
        }

        return this.generateProductResModel(product)

    }


    public async getProductNames(): Promise<string[]> {
        return (await this.productRepository
            .createQueryBuilder('product')
            .select(['product.name'])
            .getMany()).map(product => product.name)
    }



    public async deleteProductByName(name: string): Promise<ConfirmRes> {
        const product: Product | null | undefined = await this.productRepository.findOneBy({ name })
        if (!product) throw new BadRequestException(`product with name='${name}' you're trying to delete doesn't exist`)
        const category: Category = product.category
        const menu = await this.menuRepository.findOneBy({ item: { id: product.id } })
        await this.menuRepository.delete(menu.id)
        await this.productRepository.delete(product.id)
        if (await this.productsHaveNotCategory(category)) {
            const menu = await this.menuRepository.findOneBy({ item: { id: category.id } })
            await this.menuRepository.delete(menu.id)
            await this.categoryRepository.delete(category.id)
        }

        return {
            statusCode: HttpStatus.OK,
            timestamp: new Date().getTime(),
            message: `product with name='${name}' has been deleted successfully`
        }

    }



}
