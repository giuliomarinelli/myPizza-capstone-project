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
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ManyproductsPostDTO } from '../interfaces/many-products-post-dto.interface';
import { ProductRes } from '../interfaces/product-res.interface';
import { ProductDTO } from '../interfaces/product-dto.interface';

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

    private async findToppingByName(name: string): Promise<Topping | null | undefined> {
        return await this.toppingRepository.findOneBy({ name })
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

    // ._._._._._._._._._._._._._._ CATEGORIES ._._._._._._._._._._._._._._

    private async findCategoryByName(name: string): Promise<Category | null | undefined> {
        return await this.categoryRepository.findOneBy({ name })
    }

    public async isPresentCategory(name: string): Promise<boolean> {
        return !!await this.findCategoryByName(name)
    }

    public async getAllCategoryNames(): Promise<string[]> {
        return (await this.categoryRepository
            .createQueryBuilder('category')
            .select(['category.name'])
            .getMany()).map(category => category.name)
    }

    public async productsHaveNotCategory(category: Category): Promise<boolean> {
        return !await this.productRepository
            .createQueryBuilder('product')
            .where('product.category = :category', { category })
            .getCount()
    }

    // ._._._._._._._._._._._._._._ PRODUCTS ._._._._._._._._._._._._._._

    private generateProductResModel(product: Product): ProductRes {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { setProductTotalAmount, toppings, ...productResOthers } = product

        const toppingResList: ToppingRes[] = []
        toppings.forEach(topping => toppingResList.push(this.generateToppingResModel(topping)))

        return {
            ...productResOthers,
            toppings: toppingResList
        }

    }

    public async getAllProducts(options: IPaginationOptions): Promise<Pagination<Product>> {
        return paginate<Product>(this.productRepository, options)
    }

    public async findProductByName(name: string): Promise<ProductRes | null | undefined> {
        return this.productRepository.findOneBy({ name })
    }

    public async addManyProducts(manyProductsPostDTO: ManyproductsPostDTO): Promise<ProductRes[]> {
        // Exception handling
        manyProductsPostDTO.products.forEach(async (productDTO) => {
            const isPresent: boolean = !!await this.findProductByName(productDTO.name)
            if (isPresent) throw new BadRequestException(`product with name=${productDTO.name} already exists`,
                { cause: new Error(), description: 'Bad request' })
            productDTO.toppings.forEach(async (toppingName) => {
                const isPresent: boolean = !!await this.findToppingByName(toppingName)
                if (!isPresent) throw new BadRequestException(`topping with name=${productDTO.name} doesn't exist`,
                    { cause: new Error(), description: 'Bad request' })
            })
        })
        // Finish exception handling
        const addedProducts: Product[] = []
        manyProductsPostDTO.products.forEach(async (productDTO) => {
            let category: Category
            if (this.isPresentCategory(productDTO.category)) {
                category = await this.findCategoryByName(productDTO.category)
            } else {
                category = new Category(productDTO.category)
                await this.categoryRepository.save(category)
                const menu = new Menu(category)
                await this.menuRepository.save(menu)
            }

            const newProduct = new Product(productDTO.name, productDTO.basePrice, category)

            productDTO.toppings.forEach(async (toppingName) => newProduct.toppings
                .push(await this.findToppingByName(toppingName)))

            addedProducts.push(newProduct)

        })

        const savedProducts = await this.productRepository.save(addedProducts)

        const menuProducts: Menu[] = []

        savedProducts.forEach(async (product) => menuProducts.push(new Menu(product)))
        await this.menuRepository.save(menuProducts)

        return savedProducts.map(product => {
            product.setProductTotalAmount()
            product.toppings = product.toppings.map(topping => {
                topping.setDescription()
                return topping
            })
            return this.generateProductResModel(product)
        })
    }

    public async getProductNames(): Promise<string[]> {
        return (await this.productRepository
            .createQueryBuilder('product')
            .select(['products.name'])
            .getMany()).map(product => product.name)
    }

    public async updateProductByName(oldName: string, productDTO: ProductDTO): Promise<ProductRes> {
        const product: Product | null | undefined = await this.productRepository.findOneBy({ name: oldName })
        if (!product) throw new BadRequestException(`product with name=${oldName} you're trying to update doesn't exist`)
        const menu = await this.menuRepository.findOneBy({ item: { id: product.id } })
        await this.menuRepository.delete(menu)
        product.name = productDTO.name
        product.basePrice = productDTO.basePrice
        const sentCategory: Category | null | undefined = await this.categoryRepository.findOneBy({ name: productDTO.category })
        const oldCategory: Category = product.category

        if (sentCategory && sentCategory !== oldCategory) {
            product.category = sentCategory
            await this.productRepository.save(product)
        } else if (!sentCategory) {
            const newCategory = new Category(productDTO.category)
            await this.productRepository.save(newCategory)
            await this.menuRepository.save(new Menu(newCategory))
            product.category = newCategory
            await this.productRepository.save(product)
        }

        if (this.productsHaveNotCategory(oldCategory)) {
            await this.categoryRepository.delete(oldCategory)
            const oldMenu = await this.menuRepository.findOneBy({ item: { id: oldCategory.id } })
            await this.menuRepository.delete(oldMenu)
        }

        const toppings: Topping[] = []
        productDTO.toppings.forEach(async (toppingName) => {
            const topping: Topping | null | undefined = await this.toppingRepository.findOneBy({ name: toppingName })
            if (!topping) throw new BadRequestException(`topping with name=${toppingName} you're trying to update doesn't exist`,
                { cause: new Error(), description: 'Bad Request' })
            topping.setDescription()
            toppings.push(topping)
        })

        product.toppings = toppings

        const newProduct = await this.productRepository.save(product)

        await this.menuRepository.save(new Menu(newProduct))

        newProduct.setProductTotalAmount()

        return this.generateProductResModel(newProduct)

    }


    public async deleteProductByName(name: string): Promise<ConfirmRes> {
        const product: Product | null | undefined = await this.productRepository.findOneBy({ name })
        if (!product) throw new BadRequestException(`product with name=${name} you're trying to delete doesn't exist`,
            { cause: new Error(), description: 'Bad Request' })
        const category: Category = product.category
        await this.menuRepository.delete({ id: product.id })
        if (await this.productsHaveNotCategory(category)) {
            const menu = await this.menuRepository.findOneBy({ item: { id: category.id } })
            await this.menuRepository.delete(menu)
            await this.categoryRepository.delete(category)
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            timestamp: new Date().getTime(),
            message: `product with name=${name} has been deleted successfully`
        }

    }



}
