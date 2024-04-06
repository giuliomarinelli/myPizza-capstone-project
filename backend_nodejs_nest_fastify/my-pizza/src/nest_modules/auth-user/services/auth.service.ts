import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
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

    private logger = new Logger('AuthService')

    private async passwordEncoder(password: string): Promise<string> {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }

    private async passwordMatcher(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    private async getUserByEmail(email: string): Promise<User | null | undefined> {
        return await this.userRepository.findOneBy({ email })
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
        try {
            await this.userRepository.save(user)
        } catch (e) {
            if (e.message) {
                if (typeof e.message === 'string') {
                    if (e.message.includes('Duplicate entry')) {
                        if (e.message.includes('IDX_97672ac88f789774dd47f7c8be')) {
                            throw new BadRequestException('email already exist')
                        } else if (e.message.includes('IDX_17d1817f241f10a3dbafb169fd')) {
                            throw new BadRequestException('phoneNumber already exist')
                        }
                    }
                }
            }
            
            throw new InternalServerErrorException('Database error')
        }

        try {
            await this.addressSvc.createAddress(address, user)
        } catch (e) {
            await this.userRepository.delete(user.id)
            if (e instanceof BadRequestException) throw e
            throw new InternalServerErrorException('An error occurred, cannot register')
        }

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
