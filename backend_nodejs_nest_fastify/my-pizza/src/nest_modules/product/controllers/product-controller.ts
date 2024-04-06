import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth-user/guards/admin.guard';
import { ProductService } from '../services/product.service';
import { MenuService } from '../services/menu.service';
import { ToppingType } from '../enums/topping-type.enum';
import { ToppingsRes } from '../interfaces/toppings-res.interface';
import { ToppingDTO } from '../interfaces/topping-dto.interface';
import { ToppingRes } from '../interfaces/topping-res.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductNamesRes } from '../interfaces/products-names-res.interface';
import { CategoriesRes } from '../interfaces/categories-res.interface';
import { ManyproductsPostDTO } from '../interfaces/many-products-post-dto.interface';
import { ProductRes } from '../interfaces/product-res.interface';
import { ProductDTO } from '../interfaces/product-dto.interface';
import { MenuDTO } from '../entities/menu-dto.interface';

@Controller('api')
@UseGuards(AdminGuard)
export class ProductController {

    constructor(private productSvc: ProductService, private menuSvc: MenuService) { }

    // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
    // Toppings

    @Get('toppings')
    public async getAllToppings(@Query('type') type: ToppingType): Promise<ToppingsRes> {
        const isTypeDefined: boolean = !!type
        if (!isTypeDefined) {
            return {
                toppings: await this.productSvc.findAllToppings()
            }
        } else {
            return {
                toppings: await this.productSvc.findAllToppings(type)
            }
        }
    }

    @Post('toppings')
    public async addTopping(@Body() toppingDTO: ToppingDTO): Promise<ToppingRes> {
        return await this.productSvc.addTopping(toppingDTO)
    }

    @Put('toppings/:name')
    public async updateToppingByName(@Param('name') name: string, @Body() toppingDTO: ToppingDTO): Promise<ToppingRes> {
        return await this.productSvc.updateToppingByName(name, toppingDTO)
    }

    @Delete('toppings/:name')
    public async deleteToppingByName(@Param('name') name: string): Promise<ConfirmRes> {
        return await this.productSvc.deleteToppingByName(name)
    }

    // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
    // Products

    @Get('products')
    public async getAllProducts(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10): Promise<Pagination<ProductRes>> {

        return await this.productSvc.getAllProducts({ page, limit })

    }

    @Get('products/product-names')
    public async getProductNames(): Promise<ProductNamesRes> {
        return {
            productNames: await this.productSvc.getProductNames()
        }
    }

    @Get('products/categories')
    public async getCategories(): Promise<CategoriesRes> {
        return {
            categories: await this.productSvc.getAllCategoryNames()
        }
    }

    @Post('products/add-many')
    public async addManyProducts(@Body() manyProductsPostDTO: ManyproductsPostDTO): Promise<ProductRes[]> {
        return await this.productSvc.addManyProducts(manyProductsPostDTO)
    }

    @Put('products/:name')
    public async updateProduct(@Param('name') name: string, productDTO: ProductDTO): Promise<ProductRes> {
        return await this.productSvc.updateProductByName(name, productDTO)
    }

    @Delete('products/:name')
    public async deleteProduct(@Param('name') name: string): Promise<ConfirmRes> {
        return this.productSvc.deleteProductByName(name)
    }

    @Post()
    public async setMenu(menuDTO: MenuDTO): Promise<ConfirmRes> {
        return this.menuSvc.saveMenu(menuDTO.menuIds)
    }

}


