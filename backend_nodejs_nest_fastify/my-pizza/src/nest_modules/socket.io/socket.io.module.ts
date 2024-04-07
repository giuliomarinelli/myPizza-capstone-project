import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { Server } from 'socket.io';
import { SessionService } from './services/session.service';


@Module({
  providers: [ClientService, Server, SessionService],
  imports: []
})
export class SocketIoModule {}
