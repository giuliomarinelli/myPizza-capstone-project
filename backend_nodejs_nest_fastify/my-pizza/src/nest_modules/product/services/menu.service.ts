import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UUID } from 'crypto';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';
import { ProductService } from './product.service';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuItemRes } from '../interfaces/menu-item-res.interface';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { MenuRes } from '../interfaces/menu-res-interface';

@Injectable()
export class MenuService {

    constructor(@InjectRepository(Menu) private menuRepository: Repository<Menu>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(MenuItem) private menuItemRepository: Repository<MenuItem>,
        private productSvc: ProductService) { }

    private generateMenuItemResModel(menuItem: MenuItem): MenuItemRes {
        if (menuItem instanceof Product) {
            return this.productSvc.generateProductResModel(menuItem)
        } else if (menuItem instanceof Category) {
            return this.productSvc.generateCategoryResModel(menuItem)
        }
    }


    public async getMenu(options: IPaginationOptions): Promise<Pagination<MenuRes>> {
        const results = await paginate<Menu>(this.menuRepository, options,
            { order: { ord: 'ASC' } })
        console.log(results)
        return new Pagination<MenuRes>(
            results.items.map((menu) => {
                return {
                    id: menu.id,
                    item: this.generateMenuItemResModel(menu.item)
                }
            }),
            results.meta
        )
    }


    public async saveMenu(menuIds: UUID[]): Promise<ConfirmRes> {

        const newMenuList: Menu[] = []
        for await (const [i, menuId] of menuIds.entries()) {
            const oldMenu: Menu | null | undefined = await this.menuRepository.findOneBy({ id: menuId })
            if (!oldMenu) throw new BadRequestException(`menu instance with id=${menuId} doesn't exist`,
                { cause: new Error(), description: 'Bad Request' })
            const menu = new Menu({ ...oldMenu.item })
            menu.ord = i + 1
            newMenuList.push(menu)
        }

        await this.menuRepository.createQueryBuilder('menu')
            .delete()
            .from(Menu) //
            .execute()

        await this.menuRepository.save(newMenuList)

       

        return {
            statusCode: HttpStatus.NO_CONTENT,
            timestamp: new Date().getTime(),
            message: "Menu updated successfully"
        }

    }

}
