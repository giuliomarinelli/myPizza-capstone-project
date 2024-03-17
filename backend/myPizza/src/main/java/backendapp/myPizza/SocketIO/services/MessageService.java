package backendapp.myPizza.SocketIO.services;

import backendapp.myPizza.SocketIO.ClientNotification;
import backendapp.myPizza.SocketIO.entities.Message;
import com.corundumstudio.socketio.SocketIOClient;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Set;
import java.util.UUID;

@Service
@Log4j2
public class MessageService {

    @Autowired
    private SessionTrackingService sessionSvc;

    @Autowired
    private SocketIOClientService clientSvc;

    public void sendMessageToClient(Message message) {


        Set<UUID> clientIds = sessionSvc.getClientIdsFromUserId(message.getRecipientUser().getId());
        log.info(message.getRecipientUser().getId());
        for (UUID clientId : clientIds) {
            SocketIOClient client = clientSvc.getClient(clientId);
            log.info(client);
            if (client != null) {
                log.info("send message");
                client.sendEvent("message", message);
            }

        }
    }

    public void onConnectNotification(UUID userId){
        Set<UUID> clientIds = sessionSvc.getClientIdsFromUserId(userId);
        for (UUID clientId : clientIds) {
            SocketIOClient client = clientSvc.getClient(clientId);
            if (client != null) {
                client.sendEvent("connect", new ClientNotification("websocket connected successfully, userId=" + userId + ", clientId=" + clientId));
            }

        }
    }
}
