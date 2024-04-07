import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '../enums/token-type.enum';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { TokenPairType } from '../enums/token-pair-type.enum';
import { TokenPair } from '../interfaces/token-pair.interface';
import { UUID } from 'crypto';
import { DataSource } from 'typeorm';
import { FastifyRequest } from 'fastify';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtUtilsService {

    constructor(private jwtSvc: JwtService, private configSvc: ConfigService, private dataSource: DataSource) { }

    private async getUserById(id: UUID): Promise<User> {
        const user: User | null | undefined = await this.dataSource.getRepository(User).findOneBy({ id })
        if (!user) throw new UnauthorizedException()
        return user
    }

    public async generateToken(user: User, type: TokenType, restore: boolean): Promise<string> {

        let secret: string
        let exp: number

        switch (type) {
            case TokenType.ACCESS_TOKEN:
                secret = this.configSvc.get('KEYS.accessTokenSecret')
                exp = this.configSvc.get('EXP.accessTokenExp')
                break
            case TokenType.REFRESH_TOKEN:
                secret = this.configSvc.get('KEYS.refreshTokenSecret')
                exp = this.configSvc.get('EXP.refreshTokenExp')
                break
            case TokenType.WS_ACCESS_TOKEN:
                secret = this.configSvc.get('KEYS.wsAccessTokenSecret')
                exp = this.configSvc.get('EXP.wsAccessTokenExp')
                break
            case TokenType.WS_REFRESH_TOKEN:
                secret = this.configSvc.get('KEYS.wsRefreshTokenSecret')
                exp = this.configSvc.get('EXP.wsRefreshTokenExp')
                break
            default: throw new UnauthorizedException()
        }

        return await this.jwtSvc.signAsync({
            sub: user.id, restore, iss: 'MyPizza',
            typ: `JWT ${type}`, exp, iat: new Date().getTime(), jti: uuidv4(), scope: user.scope.join(' ')
        }, { secret })

    }

    public async generateTokenPair(refreshToken: string, type: TokenPairType, restore: boolean): Promise<TokenPair> {
        let secret: string
        switch (type) {
            case TokenPairType.HTTP:
                secret = this.configSvc.get('KEYS.refreshTokenSecret')
                break
            case TokenPairType.WS:
                secret = this.configSvc.get('KEYS.wsRefreshTokenSecret')
                break
            default: throw new UnauthorizedException()
        }
        try {
            await this.jwtSvc.verifyAsync(refreshToken, { secret })
            const userId: UUID = this.jwtSvc.decode(refreshToken).sub as UUID
            const user = await this.getUserById(userId)
            if (type === TokenPairType.HTTP) {
                return {
                    accessToken: await this.generateToken(user, TokenType.ACCESS_TOKEN, restore),
                    refreshToken: await this.generateToken(user, TokenType.REFRESH_TOKEN, restore),
                    type
                }
            }
            return {
                accessToken: await this.generateToken(user, TokenType.WS_ACCESS_TOKEN, restore),
                refreshToken: await this.generateToken(user, TokenType.WS_REFRESH_TOKEN, restore),
                type
            }

        } catch {
            let tokenPrefix: string = ''
            if (type === TokenPairType.WS) tokenPrefix = 'ws_'
            throw new UnauthorizedException(`Invalid ${tokenPrefix}refresh_token`, { cause: new Error(), description: 'Unauthorized' })
        }

    }

    public async verifyAccessToken(accessToken: string): Promise<boolean> {
        try {
            await this.jwtSvc.verifyAsync(accessToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.accessTokenSecret') })
            // console.log(this.jwtSvc.decode(accessToken), new Date().getTime(), new Date().getTime() + this.jwtSvc.decode(accessToken).exp)
            return new Date().getTime() <= (this.jwtSvc.decode(accessToken).exp as number) + (this.jwtSvc.decode(accessToken).iat)
        } catch {
            throw new UnauthorizedException(`Invalid access_token`, { cause: new Error(), description: 'Unauthorized' })
        }
    }

    public async verifyWsAccessToken(wsAccessToken: string): Promise<void> {
        try {
            await this.jwtSvc.verifyAsync(wsAccessToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.wsAccessTokenSecret') })
            if (new Date().getTime() > (this.jwtSvc.decode(wsAccessToken).exp as number) + (this.jwtSvc.decode(wsAccessToken).iat))
                throw new WsException({ error: 'Unauthorized', message: 'ws_access_token is expired' })
        } catch {
            throw new WsException({ error: 'Unauthorized', message: 'invalid ws_access_token' })
        }
    }


    public async extractUserFromAccessToken(accessToken: string): Promise<User> {
        const userId = await this.extractUserIdFromAccessToken(accessToken)
        return await this.getUserById(userId)
    }

    public async extractUserIdFromWsAccessToken(wsAccessToken: string): Promise<UUID> {
        await this.verifyWsAccessToken(wsAccessToken)
        return this.jwtSvc.decode(wsAccessToken).sub
    }

    public async extractUserFromWsAccessToken(wsAccessToken: string): Promise<User> {
        return await this.getUserById(await this.extractUserIdFromWsAccessToken(wsAccessToken))
    }

    public async extractUserIdFromAccessToken(accessToken: string): Promise<UUID> {
        try {
            await this.jwtSvc.verifyAsync(accessToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.accessTokenSecret') })
            return this.jwtSvc.decode(accessToken).sub
        } catch {
            throw new UnauthorizedException(`Invalid access_token`, { cause: new Error(), description: 'Unauthorized' })
        }
    }

    public async getRestoreFromRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            await this.jwtSvc.verifyAsync(refreshToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.refreshTokenSecret') })
            return this.jwtSvc.decode(refreshToken).restore as boolean
        } catch {
            throw new UnauthorizedException(`Invalid refresh_token`, { cause: new Error(), description: 'Unauthorized' })
        }
    }

    public async getUserFromReq(req: FastifyRequest): Promise<User> {
        const accessToken: string | null | undefined = req.cookies['__access_tkn']
        if (!accessToken) throw new UnauthorizedException('No provided access_token', { cause: new Error(), description: 'Unauthorized' })
        return await this.extractUserFromAccessToken(accessToken)
    }


}
