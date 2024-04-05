import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { JwtUtilsService } from './services/jwt-utils.service';
import { User } from './entities/user.entity';
import { AddressService } from '../address/services/address.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService, JwtUtilsService, AddressService, JwtService, ProfileService],
    controllers: [AuthController, ProfileController]
})
export class AuthUserModule { }
