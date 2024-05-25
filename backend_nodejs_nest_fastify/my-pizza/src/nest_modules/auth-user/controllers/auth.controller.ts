import { Body, Controller, Get, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { UserPostDTO } from '../interfaces/user-post-dto.interface';
import { AuthService } from '../services/auth.service';
import { UserRes } from '../interfaces/user-res.interface';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from '../interfaces/login-dto.interface';
import { ConfirmRes } from '../interfaces/confirm-res.interface';
import { FastifyReply } from 'fastify';
import { TokenPairType } from '../enums/token-pair-type.enum';

@Controller('auth')
export class AuthController {

    constructor(private authSvc: AuthService, private configSvc: ConfigService) { }

    private logger = new Logger('AuthController')
    
    @Post('/register')
    public async register(@Body() userPostDTO: UserPostDTO): Promise<UserRes> {
        return await this.authSvc.register(userPostDTO)
    }

    @Post('/login')
    public async login(@Body() loginDTO: LoginDTO, @Res({ passthrough: true }) res: FastifyReply): Promise<ConfirmRes> {
        const tokenMap = await this.authSvc.login(loginDTO)
        // this.logger.log(tokenMap.get(TokenPairType.HTTP))
        res.statusCode = HttpStatus.OK
        if (loginDTO.restore) {
            res.setCookie('__access_tkn', tokenMap.get(TokenPairType.HTTP).accessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
            res.setCookie('__refresh_tkn', tokenMap.get(TokenPairType.HTTP).refreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
            res.setCookie('__ws_access_tkn', tokenMap.get(TokenPairType.WS).accessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
            res.setCookie('__ws_refresh_tkn', tokenMap.get(TokenPairType.WS).refreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
        } else {
            res.setCookie('__access_tkn', tokenMap.get(TokenPairType.HTTP).accessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
            res.setCookie('__refresh_tkn', tokenMap.get(TokenPairType.HTTP).refreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
            res.setCookie('__ws_access_tkn', tokenMap.get(TokenPairType.WS).accessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
            res.setCookie('__ws_refresh_tkn', tokenMap.get(TokenPairType.WS).refreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
        }
        return {
            statusCode: HttpStatus.OK,
            timestamp: new Date().getTime(),
            message: "Authenticated successfully"
        }
    }

    @Get('/logout')
    public logout(@Res({ passthrough: true }) res: FastifyReply): ConfirmRes {
        res.clearCookie('__access_tkn')
        res.clearCookie('__refresh_tkn')
        res.clearCookie('__ws_access_tkn')
        res.clearCookie('__ws_refresh_tkn')
        return {
            statusCode: HttpStatus.OK,
            timestamp: new Date().getTime(),
            message: "Logged out successfully"
        }
    }


}
