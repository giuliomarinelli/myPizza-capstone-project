import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtUtilsService } from 'src/nest_modules/auth-user/services/jwt-utils.service';
import { IsWsAuthValid } from '../interfaces/is-ws-auth-valid.interface';
import { WsException } from '@nestjs/websockets';
import { TokenPair } from 'src/nest_modules/auth-user/interfaces/token-pair.interface';
import { TokenPairType } from 'src/nest_modules/auth-user/enums/token-pair-type.enum';
import { ConfigService } from '@nestjs/config';

@Controller('ws')
export class WsControllerController {

    constructor(private jwtUtils: JwtUtilsService, private configSvc: ConfigService) { }

    @Get('/is-ws-auth-valid-or-refresh')
    public async isWsAuthValidOrRefresh(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply): Promise<IsWsAuthValid> {
        const wsAccessToken = req.cookies['__ws_access_tkn']
        const wsRefreshToken = req.cookies['__ws_refresh_tkn']
        if (!wsAccessToken || !wsRefreshToken) return { valid: false }
        try {
            await this.jwtUtils.verifyWsAccessToken(wsAccessToken)
            return { valid: true }
        } catch (e) {
            if (!(e instanceof WsException)) return { valid: false }
            let restore: boolean
            try {
                restore = await this.jwtUtils.getRestoreFromWsRefreshToken(wsRefreshToken)
                const newTokens: TokenPair = await this.jwtUtils.generateTokenPair(wsRefreshToken, TokenPairType.WS, restore)
                if (restore) {
                    res.setCookie('__ws_access_tkn', newTokens.accessToken, {
                        domain: this.configSvc.get('COOKIE.domain'),
                        sameSite: this.configSvc.get('COOKIE.sameSite'),
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        maxAge: this.configSvc.get('EXP.refreshTokenExp')
                    })
                    res.setCookie('__ws_access_tkn', newTokens.refreshToken, {
                        domain: this.configSvc.get('COOKIE.domain'),
                        sameSite: this.configSvc.get('COOKIE.sameSite'),
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        maxAge: this.configSvc.get('EXP.refreshTokenExp')
                    })
                } else {
                    res.setCookie('__ws_access_tkn', newTokens.accessToken, {
                        domain: this.configSvc.get('COOKIE.domain'),
                        sameSite: this.configSvc.get('COOKIE.sameSite'),
                        httpOnly: true,
                        path: '/',
                        secure: true,
                    })
                    res.setCookie('__ws_access_tkn', newTokens.refreshToken, {
                        domain: this.configSvc.get('COOKIE.domain'),
                        sameSite: this.configSvc.get('COOKIE.sameSite'),
                        httpOnly: true,
                        path: '/',
                        secure: true,
                    })
                    return { valid: true }
                }
            } catch {
                return { valid: false }
            }
        }


    }
}