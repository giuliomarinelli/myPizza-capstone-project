import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/nest_modules/auth-user/guards/admin.guard';
import { MenuDTO } from '../interfaces/menu-dto.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';
import { MenuService } from '../services/menu.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MenuRes } from '../interfaces/menu-res-interface';

@Controller()
export class MenuController {

    constructor(private menuSvc: MenuService) { }

    @UseGuards(AdminGuard)
    @Post('api/set-menu')
    public async setMenu(@Body() menuDTO: MenuDTO): Promise<ConfirmRes> {
        return await this.menuSvc.saveMenu(menuDTO.menuIds)
    }

    @Get('public/menu')
    public async getMenu(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
    ): Promise<Pagination<MenuRes>> {
        return await this.menuSvc.getMenu({ page, limit })
    }
}
