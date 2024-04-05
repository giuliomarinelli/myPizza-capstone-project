import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Product } from './entities/product.entity';
import { Topping } from './entities/topping.entity';
import { Menu } from './entities/menu.entity';
import { ProductService } from './services/product.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, MenuItem, Product, Topping, Menu])],
    providers: [ProductService]
})
export class ProductModule {}
