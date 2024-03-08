package backendapp.myPizza.SocketIO.services;

import backendapp.myPizza.SocketIO.Message;
import com.corundumstudio.socketio.SocketIOClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Set;
import java.util.UUID;

@Service
public class MessageService {

    @Autowired
    private SessionTrackingService sessionSvc;

    @Autowired
    private SocketIOClientService clientSvc;

    public void sendMessageToClient(Message message) {


        Set<UUID> clientIds = sessionSvc.getClientIdsFromUserId(message.getRecipientUserId());

        for (UUID clientId : clientIds) {
            SocketIOClient client = clientSvc.getClient(clientId);
            if (client != null) {
                client.sendEvent("message", message);
            }

        }


    }
}
