import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Product } from './entities/product.entity';
import { Topping } from './entities/topping.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, MenuItem, Product, Topping])]
})
export class ProductModule {}
