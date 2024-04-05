import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtUtilsService } from './jwt-utils.service';
import { AuthService } from './auth.service';
import { FastifyRequest } from 'fastify';
import { UserRes } from '../interfaces/user-res.interface';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPutDTO } from '../interfaces/user-put-dto.interface';
import { UUID } from 'crypto';
import { Address } from 'src/nest_modules/address/entities/address.entity';
import { AdminUserIdRes } from '../interfaces/admin-user-id-res-interface';
import { UserScope } from '../enums/user-scope.enum';

@Injectable()
export class ProfileService {

    constructor(private jwtUtils: JwtUtilsService, private authSvc: AuthService,
        @InjectRepository(User) private userRepository: Repository<User>) { }

    public async getProfile(req: FastifyRequest): Promise<UserRes> {
        const user: UserRes | null | undefined = this.authSvc.generateUserResModel(await this.jwtUtils.getUserFromReq(req))
        if (!user) throw new UnauthorizedException()
        return user
    }

    public async updatePutProfile(req: FastifyRequest, userPutDTO: UserPutDTO): Promise<UserRes> {
        const user: User | null | undefined = await this.jwtUtils.getUserFromReq(req)
        if (!user) throw new UnauthorizedException()
        const id: UUID = user.id
        const { firstName, lastName, phoneNumber, email, gender } = userPutDTO
        await this.userRepository.update({ firstName, lastName, phoneNumber, email, gender }, user)
        return this.authSvc.generateUserResModel(await this.userRepository.findOneBy({ id }))
        // da gestire eccezioni per violazione constraint unique
    }

    public async getAddresses(req: FastifyRequest): Promise<Address[]> {
        const user: User | null | undefined = await this.jwtUtils.getUserFromReq(req)
        if (!user) throw new UnauthorizedException()
        return user.addresses
    }

    public async getAdminUserId(): Promise<AdminUserIdRes> {
        const users: User[] = await this.userRepository
            .createQueryBuilder('user')
            .getMany()
        const admin: User | undefined = users.find(user => user.scope.includes(UserScope.ADMIN))
        if (!admin)
            throw new NotFoundException('user with ADMIN authority not found', { cause: new Error(), description: 'Not Found' })
        return { adminUserId: admin.id }
    }

}
