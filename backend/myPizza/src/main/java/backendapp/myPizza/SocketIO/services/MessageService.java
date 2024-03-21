package backendapp.myPizza.SocketIO.services;

import backendapp.myPizza.SocketIO.ClientNotification;
import backendapp.myPizza.SocketIO.entities.Message;
import backendapp.myPizza.SocketIO.repositories.MessageRepository;
import com.corundumstudio.socketio.SocketIOClient;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Log4j2
public class MessageService {

    @Autowired
    private SessionTrackingService sessionSvc;

    @Autowired
    private SocketIOClientService clientSvc;

    @Autowired
    private MessageRepository messageRp;


    public void sendMessageToClient(Message message) {


        Set<UUID> clientIds = sessionSvc.getClientIdsFromUserId(message.getRecipientUser().getId());
        log.info(message.getRecipientUser().getId() + " receving message");
        for (UUID clientId : clientIds) {
            SocketIOClient client = clientSvc.getClient(clientId);
            log.info(client);
            if (client != null) {
                log.info("send message");
                client.sendEvent("message", message);
            }

        }
    }

    public void restoreMessages(UUID recipientUserId) {
        if (sessionSvc.isOnLine(recipientUserId)) {
            List<Message> messages = messageRp.findAllUnreadMessagesByRecipientUserId(recipientUserId);
            messages = messages.stream().peek(m -> {
                m.setRestore(true);
            }).toList();
            messageRp.saveAll(messages);
            for (Message m : messages) {
                sendMessageToClient(m);
            }
        }
    }
}
