import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Product } from './entities/product.entity';
import { Topping } from './entities/topping.entity';
import { Menu } from './entities/menu.entity';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product-controller';
import { MenuService } from './services/menu.service';
import { JwtUtilsService } from '../auth-user/services/jwt-utils.service';
import { JwtService } from '@nestjs/jwt';
import { MenuController } from './controllers/menu.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Category, MenuItem, Product, Topping, Menu])],
    providers: [ProductService, MenuService, JwtUtilsService, JwtService],
    controllers: [ProductController, MenuController]
})
export class ProductModule {}
