import { Socket } from 'socket.io';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CookieParserService } from 'src/cookie-parser.service';
import { JwtUtilsService } from '../services/jwt-utils.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketIoGuard implements CanActivate {

  constructor(private cookieParser: CookieParserService, private jwtUtils: JwtUtilsService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>()
    const cookies: Map<string, string> = this.cookieParser.parse(client.handshake.headers.cookie)
    const wsAccessToken: string | null | undefined = cookies.get('__ws_access_tkn')
    const wsRefreshToken: string | null | undefined = cookies.get('__ws_refresh_tkn')
    if (!wsAccessToken) {
      throw new WsException({ error: 'Unauthorized', message: 'no provided ws_access_token' })
    }
    if (!wsRefreshToken) {
      throw new WsException({ error: 'Unauthorized', message: 'no provided ws_refresh_token' })
    }

    await this.jwtUtils.verifyWsAccessToken(wsAccessToken)
    /* se il ws_access_token non è valido o è scaduto viene generata un'eccezione di tipo WebSocket
     dal metodo e il flusso si interrompe. La connessione al websocket cade e il client deve fare il refresh via http */

    return true;

  }

}
