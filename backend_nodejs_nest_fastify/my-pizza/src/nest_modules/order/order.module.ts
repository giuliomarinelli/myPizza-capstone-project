import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Topping } from '../product/entities/topping.entity';
import { ProductRef } from './entities/product-ref.entity';
import { ToppingRef } from './entities/topping-ref.entity';
import { OrderSet } from './entities/order-set.entity';
import { Order } from './entities/order.entity';
import { TimeInterval } from './entities/time-interval.entity';
import { WorkSession } from './entities/work-session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Topping, ProductRef, ToppingRef, OrderSet, Order, TimeInterval, WorkSession])]
})
export class OrderModule {}
