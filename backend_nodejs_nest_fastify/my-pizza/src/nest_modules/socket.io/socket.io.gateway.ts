import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private logger = new Logger('SocketIoGateway')

    @WebSocketServer()
    private io: Server

    handleConnection(client: Socket): void {
        this.logger.log(`${client.id} connected to Socket`)
        const event = '_hello'
        const data = 'hello world'
        this.io.emit(event, data) // messaggio al client
        this.logger.log(`Server sent message "${data}" to ${client.id}`)
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`${client.id} disconnected from Socket`)
    }

    afterInit() {
        this.logger.log('Started Socket.io gateway')
    }

    @SubscribeMessage('hello')
    handleEvent(client: Socket, data: string): string {
        this.logger.log(`${client.id} sent message to server: ${data}`)
        const ack = `${client.id}: Server received your message: ${data}`
        this.logger.log(`${ack}`)
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
        */
    }


}