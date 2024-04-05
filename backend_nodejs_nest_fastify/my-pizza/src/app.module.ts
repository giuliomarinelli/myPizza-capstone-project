import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './nest_modules/address/address.module';
import { AuthUserModule } from './nest_modules/auth-user/auth-user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './nest_modules/auth-user/guards/auth.guard';
import { JwtUtilsService } from './nest_modules/auth-user/services/jwt-utils.service';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from './nest_modules/product/product.module';





@Module({
  imports: [ConfigModule.forRoot({
    load: [...configurations],
    isGlobal: true,
    envFilePath: ['development.env']
  }),
   TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configSvc: ConfigService) => configSvc.get('DB'),
      inject: [ConfigService],
    }),
   AddressModule,
   AuthUserModule,
   ProductModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  },
  JwtService,
  ConfigService,
  JwtUtilsService
],
})
export class AppModule { }
