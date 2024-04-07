import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientService {

    private readonly clients: Map<string, Socket> = new Map()

    public addClient(client: Socket): void {
        this.clients.set(client.id, client)
    }

    public getClient(sessionId: string): Socket {
        return this.clients.get(sessionId)
    }

    public removeClient(sessionId: string): void {
        this.clients.delete(sessionId)
    }

}
