import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UUID } from 'crypto';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';

@Injectable()
export class MenuService {

    constructor(@InjectRepository(Menu) private menuRepository: Repository<Menu>) { }

    public async getMenu(options: IPaginationOptions): Promise<Pagination<Menu>> {
        return await paginate<Menu>(this.menuRepository, options)
    }


    public async saveMenu(menuIds: UUID[]): Promise<ConfirmRes> {

        const newMenuList: Menu[] = []

        menuIds.forEach(async (menuId) => {
            const oldMenu: Menu | null | undefined = await this.menuRepository.findOneBy({ id: menuId })
            if (!oldMenu) throw new BadRequestException(`menu instance with id=${menuId} doesn't exist`,
                { cause: new Error(), description: 'Bad Request' })
            newMenuList.push(new Menu(oldMenu.item))
        })

        await this.menuRepository.createQueryBuilder('menu')
            .delete()
            .from(Menu)
            .execute()
        
        await this.menuRepository.save(newMenuList)

        return {
            statusCode: HttpStatus.NO_CONTENT,
            timestamp: new Date().getTime(),
            message: "Menu updated successfully"
        }

    }

}
