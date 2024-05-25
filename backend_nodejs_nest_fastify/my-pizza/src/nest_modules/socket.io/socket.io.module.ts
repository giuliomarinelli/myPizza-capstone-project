import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { Server } from 'socket.io';
import { SessionService } from './services/session.service';
import { WsControllerController } from './controllers/ws-controller.controller';
import { JwtUtilsService } from '../auth-user/services/jwt-utils.service';
import { JwtService } from '@nestjs/jwt';



@Module({
  providers: [ClientService, Server, SessionService, JwtUtilsService, JwtService],
  imports: [],
  controllers: [WsControllerController]
})
export class SocketIoModule {}
