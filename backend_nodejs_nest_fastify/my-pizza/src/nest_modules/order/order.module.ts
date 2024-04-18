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
import { OrderService } from './services/order.service';
import { JwtUtilsService } from '../auth-user/services/jwt-utils.service';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './services/session.service';
import { OrderController } from './controllers/order.controller';
import { SessionController } from './controllers/session.controller';
import { PublicOrderController } from './controllers/public-order.controller';
import { Address } from '../address/entities/address.entity';
import { ProductService } from '../product/services/product.service';
import { Category } from '../product/entities/category.entity';
import { Menu } from '../product/entities/menu.entity';


@Module({
    imports: [TypeOrmModule.forFeature(
        [Product, Topping, ProductRef, ToppingRef, Address, OrderSet, Order, TimeInterval, WorkSession, Category, Menu]
    )],
    providers: [OrderService, JwtUtilsService, JwtService, SessionService, ProductService],
    controllers: [OrderController, SessionController, PublicOrderController]
})
export class OrderModule { }
