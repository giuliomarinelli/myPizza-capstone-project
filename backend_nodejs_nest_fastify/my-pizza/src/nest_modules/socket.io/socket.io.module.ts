import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { Server } from 'socket.io';


@Module({
  providers: [ClientService, Server],
  imports: []
})
export class SocketIoModule {}
