package backendapp.myPizza.SocketIO.services;

import backendapp.myPizza.SocketIO.Message;
import com.corundumstudio.socketio.SocketIOClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MessageService {

    @Autowired SocketIOClientService clientSvc;
    public void sendMessageToClient(Message message) {
        UUID clientId = message.getRecipientClientId();
        SocketIOClient client = clientSvc.getClient(clientId);
        if (client != null) {
            client.sendEvent("ciao", message);
        }
    }
}
