import { registerAs } from '@nestjs/config';
import { Address } from 'src/nest_modules/address/entities/address.entity';
import { City } from 'src/nest_modules/address/entities/city.entity';
import { User } from 'src/nest_modules/auth-user/entities/user.entity';
import { OrderSet } from 'src/nest_modules/order/entities/order-set.entity';
import { Order } from 'src/nest_modules/order/entities/order.entity';
import { ProductRef } from 'src/nest_modules/order/entities/product-ref.entity';
import { TimeInterval } from 'src/nest_modules/order/entities/time-interval.entity';
import { ToppingRef } from 'src/nest_modules/order/entities/topping-ref.entity';
import { WorkSession } from 'src/nest_modules/order/entities/work-session.entity';
import { Category } from 'src/nest_modules/product/entities/category.entity';
import { MenuItem } from 'src/nest_modules/product/entities/menu-item.entity';
import { Menu } from 'src/nest_modules/product/entities/menu.entity';
import { Product } from 'src/nest_modules/product/entities/product.entity';
import { Topping } from 'src/nest_modules/product/entities/topping.entity';

export enum ConfigKey {
    APP = 'APP',
    DB = 'DB',
    KEYS = 'KEYS',
    EXP = 'EXP',
    COOKIE = 'COOKIE'
}

export enum Environment {
    Local = 'local',
    Development = 'development',
    Staging = 'staging',
    Production = 'production',
    Testing = 'testing',
}

const APPConfig = registerAs(
    ConfigKey.APP, () => ({
        env:
            Environment[process.env.NODE_ENV as keyof typeof Environment] ||
            'development',
        port: Number(process.env.APP_PORT),
        appName: process.env.APP_NAME,
        corsOrigins: JSON.parse(process.env.CORS_ORIGINS)
    }),
);

const DBConfig = registerAs(
    ConfigKey.DB, () => ({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        type: process.env.DATABASE_TYPE,
        entities: [
            City, User, Address, MenuItem, Product, Topping, Category, Menu,
            ProductRef, ToppingRef, OrderSet, Order, TimeInterval, WorkSession
        ],
        synchronize: true
    }),
)

const KEYSConfig = registerAs(
    ConfigKey.KEYS, () => ({
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        wsAccessTokenSecret: process.env.WS_ACCESS_TOKEN_SECRET,
        wsRefreshTokenSecret: process.env.WS_REFRESH_TOKEN_SECRET,
        cookieSignSecret: process.env.COOKIE_SIGN_SECRET
    })
)

const EXPConfig = registerAs(
    ConfigKey.EXP, () => ({
        accessTokenExp: Number(process.env.ACCESS_TOKEN_EXP),
        refreshTokenExp: Number(process.env.REFRESH_TOKEN_EXP),
        wsAccessTokenExp: Number(process.env.WS_ACCESS_TOKEN_EXP),
        wsRefreshTokenExp: Number(process.env.WS_REFRESH_TOKEN_EXP),
    })
)

const COOKIEConfig = registerAs(
    ConfigKey.COOKIE, () => ({
        domain: process.env.DOMAIN,
        sameSite: process.env.SAME_SITE
    })
)

export const configurations = [APPConfig, DBConfig, KEYSConfig, EXPConfig, COOKIEConfig]