import { TokenPairType } from './../enums/token-pair-type.enum';
import { TokenPair } from './../interfaces/token-pair.interface';
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtUtilsService } from '../services/jwt-utils.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtUtils: JwtUtilsService, private configSvc: ConfigService) { }

  private logger = new Logger('AuthGuard')

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()
    const res = context.switchToHttp().getResponse<FastifyReply>()
    const path: string = req.url
    const publicExactPaths: string[] = [
      '/api/user-profile/get-admin-userid',
      '/api/work-session/is-there-an-active-session',
      '/api/work-session/get-delivery-times'
    ]
    if (path.startsWith('/auth') || path.startsWith('/auth') ||
      path.startsWith('/socket.io') || publicExactPaths.includes(path))
      return true;
    const accessToken: string | undefined | null = req.cookies['__access_tkn']
    const refreshToken: string | undefined | null = req.cookies['__refresh_tkn']
    if (!accessToken) throw new UnauthorizedException('No provided access_token', { cause: new Error(), description: 'Unauthorized' })
    if (!refreshToken) throw new UnauthorizedException('No provided refresh_token', { cause: new Error(), description: 'Unauthorized' })
    const isAccessTokenNotExpired = await this.jwtUtils.verifyAccessToken(accessToken) // genera un'eccezione se l'access token non è valido, ma non se è solo scaduto
    if (isAccessTokenNotExpired) return true
    
    /* Access token scaduto => Refresh: il metodo chiamato verifica la validità del refresh token (scadenza compresa).
     Se non è valido genera un'eccezione, altrimenti restituisce una nuova coppia di token */
    const restore: boolean = await this.jwtUtils.getRestoreFromRefreshToken(refreshToken) // verifico se l'utente vuole ricordare il login oltre la sessione
    const newTokens: TokenPair = await this.jwtUtils.generateTokenPair(refreshToken, TokenPairType.HTTP, restore)
    
    this.logger.log('Auth Refresh')

    if (restore) {

      res.setCookie('__access_tkn', newTokens.accessToken, {
        domain: this.configSvc.get('COOKIE.domain'),
        sameSite: this.configSvc.get('COOKIE.sameSite'),
        httpOnly: true,
        path: '/',
        secure: true,
        maxAge: this.configSvc.get('EXP.refreshTokenExp')
      })

      res.setCookie('__refresh_tkn', newTokens.refreshToken, {
        domain: this.configSvc.get('COOKIE.domain'),
        sameSite: this.configSvc.get('COOKIE.sameSite'),
        httpOnly: true,
        path: '/',
        secure: true,
        maxAge: this.configSvc.get('EXP.refreshTokenExp')
      })
    } else {
      res.setCookie('__access_tkn', newTokens.accessToken, {
        domain: this.configSvc.get('COOKIE.domain'),
        sameSite: this.configSvc.get('COOKIE.sameSite'),
        httpOnly: true,
        path: '/',
        secure: true
      })

      res.setCookie('__refresh_tkn', newTokens.refreshToken, {
        domain: this.configSvc.get('COOKIE.domain'),
        sameSite: this.configSvc.get('COOKIE.sameSite'),
        httpOnly: true,
        path: '/',
        secure: true
      })
    }
    return true
  }
}
