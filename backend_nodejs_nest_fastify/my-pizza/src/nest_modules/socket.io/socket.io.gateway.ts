import { Logger, UseGuards } from '@nestjs/common';
import {
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer,
    WsException
} from '@nestjs/websockets';
import { UUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { SocketIoGuard } from '../auth-user/guards/socket.io.guard';
import { CookieParserService } from 'src/cookie-parser.service';
import { JwtUtilsService } from '../auth-user/services/jwt-utils.service';
import { SessionService } from './services/session.service';
import { ClientService } from './services/client.service';


@WebSocketGateway()
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private cookieParser: CookieParserService, private jwtUtils: JwtUtilsService,
        private sessionSvc: SessionService, private clientSvc: ClientService
    ) { }

    private async getUserId(client: Socket): Promise<UUID> {
        const wsAccessToken: string = this.cookieParser.parse(client.handshake.headers.cookie).get('__ws_access_tkn')
        return await this.jwtUtils.extractUserIdFromWsAccessToken(wsAccessToken)
    }

    private logger = new Logger('SocketIoGateway')

    @WebSocketServer()
    private io: Server


    async handleConnection(client: Socket): Promise<void> {
        let userId: UUID
        try {
            userId = await this.jwtUtils
                .extractUserIdFromWsAccessToken(this.cookieParser.parse(client.handshake.headers.cookie)
                    .get('__ws_access_tkn'))
        } catch (e) {
            if (e instanceof WsException) client.disconnect()
        }
        this.logger.log(`${userId} connected to Socket`)
        this.clientSvc.addClient(client)
        this.sessionSvc.addSession(userId, client.id)
        console.log(this.sessionSvc.isOnLine(userId))
        this.logger.log(this.sessionSvc.getSessionTracker)
        const event = '_hello'
        const data = 'hello world'
        // this.io.emit(event, data) // messaggio al client
        client.emit(event, data)
        this.logger.log(`Server sent message "${data}" to ${client.id}`)
    }

    handleDisconnect(client: Socket): void {
        this.clientSvc.removeClient(client.id)
        this.sessionSvc.removeSession(client.id)
        this.logger.log(`${client.id} disconnected from Socket`)
    }

    afterInit() {
        this.logger.log('Started Socket.io gateway')
    }

    @UseGuards(SocketIoGuard)
    @SubscribeMessage('hello')
    handleEvent(client: Socket, data: string): string {
        this.logger.log(`${client.id} sent message to server: ${data}`)
        const ack = `${client.id}: Server received your message: ${data}`
        this.logger.log(`Re-sent to client: ${ack}`)
        return ack
        /* Acknowledgement: gli faccio sapere che il client ha inviato correttamente il messaggio
             e il server l'ha ricevuto. Se il messaggio è indirizzato ad un qualche client posso dirgli
             che il server lo ha correttamente ricevuto ma ad es. il client al momento è offline */
        /* Giocando con gli eventi e gli observable posso tranquillamente dire se l'utente mi sta scrivendo un messaggio
        nel senso che sta digitando in questo istante preciso, come fanno un po' tutte le chat
        Posso anche creare chat di gruppo con le room
        In questo progetto il websocket serve solo per le notifiche client-to-client:
        Ogni id utente è inserito in un Set (una lista che non ammette duplicati) di oggetti costituiti 
        dall'id utente e da un ulteriore set di client id associati a quall'utente (ad es. sono connesso da più browser,
            dal telefono, da un altro computer...) => Le notifiche arrivano in contemporanea a tutti i client di quell'utente
        Se l'utente è offline i messaggi vengono salvati e appena si riconnette riceve le notifiche
        L'utente è identificato tramite ws_access_token che vale qualche ora poi va rinnovato
        */
    }


}