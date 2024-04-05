import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserPostDTO } from '../interfaces/user-post-dto.interface';
import { UserRes } from '../interfaces/user-res.interface';
import { Authority } from '../interfaces/authority.interface';
import { AddressService } from 'src/nest_modules/address/services/address.service';
import * as bcrypt from 'bcrypt'
import { LoginDTO } from '../interfaces/login-dto.interface';
import { TokenPairType } from '../enums/token-pair-type.enum';
import { TokenPair } from '../interfaces/token-pair.interface';
import { JwtUtilsService } from './jwt-utils.service';
import { TokenType } from '../enums/token-type.enum';



@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>, private addressSvc: AddressService, 
    private jwtUtils: JwtUtilsService) { }

    private async passwordEncoder(password: string): Promise<string> {
        const salt = await bcrypt.genSalt()
        return bcrypt.hash(password, salt)
    }

    private async passwordMatcher(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    private async getUserByEmail(email: string): Promise<User | null | undefined> {
        return this.userRepository.findOneBy({ email })
    }


    public generateUserResModel(user: User): UserRes {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { scope, hashPassword, generateAvatar, addresses, ...userData } = user
        const authorities: Authority[] = []
        user.scope.forEach(scope => authorities.push({ authority: scope }))
        return {
            ...userData,
            authorities
        }

    }

    public async register(userPostDTO: UserPostDTO): Promise<UserRes> {

        const { address, firstName, lastName, email, gender, password, phoneNumber } = userPostDTO

        const user = new User(firstName, lastName, email, await this.passwordEncoder(password), phoneNumber, gender)
        await this.userRepository.save(user)

        this.addressSvc.createAddress(address, user)

        return this.generateUserResModel(user)

    }

    public async login(loginDTO: LoginDTO): Promise<Map<TokenPairType, TokenPair>> {
        const user = await this.getUserByEmail(loginDTO.email)
        if (!user)
            throw new UnauthorizedException('email and/or password are not correct', { cause: new Error(), description: 'Unauthorized' })
        if (!await this.passwordMatcher(loginDTO.password, user.hashPassword))
            throw new UnauthorizedException('email and/or password are not correct', { cause: new Error(), description: 'Unauthorized' })
        const httpTokenPair: TokenPair = {
            accessToken: await this.jwtUtils.generateToken(user, TokenType.ACCESS_TOKEN, loginDTO.restore),
            refreshToken: await this.jwtUtils.generateToken(user, TokenType.REFRESH_TOKEN, loginDTO.restore),
            type: TokenPairType.HTTP
        }
        const wsTokenPair: TokenPair = {
            accessToken: await this.jwtUtils.generateToken(user, TokenType.WS_ACCESS_TOKEN, loginDTO.restore),
            refreshToken: await this.jwtUtils.generateToken(user, TokenType.WS_REFRESH_TOKEN, loginDTO.restore),
            type: TokenPairType.WS
        }
        const tokenMap = new Map<TokenPairType, TokenPair>
        tokenMap.set(TokenPairType.HTTP, httpTokenPair)
        tokenMap.set(TokenPairType.WS, wsTokenPair)
        return tokenMap
    }




}
