package backendapp.myPizza.SocketIO.services;

import backendapp.myPizza.Models.entities.WorkSession;
import backendapp.myPizza.SocketIO.ClientNotification;
import backendapp.myPizza.SocketIO.entities.Message;
import backendapp.myPizza.SocketIO.repositories.MessageRepository;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.exceptions.NotFoundException;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.repositories.WorkSessionRepository;
import backendapp.myPizza.security.JwtUtils;
import backendapp.myPizza.services.ProfileService;
import com.corundumstudio.socketio.SocketIOClient;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
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

    @Autowired
    private ProfileService profileSvc;

    @Autowired
    private WorkSessionRepository _sessionRp;

    @Autowired
    private JwtUtils jwtUtils;

    public Message getMessageById(UUID id) throws NotFoundException {
        return messageRp.findById(id).orElseThrow(
                () -> new NotFoundException("Message with id ='" + id + "' not found")
        );
    }

    public Message setMessageAsReadById(UUID id) throws NotFoundException, UnauthorizedException {
        Message m = getMessageById(id);
        UUID userId = jwtUtils.extractUserIdFromReq();
        if (!m.getRecipientUser().getId().equals(userId))
            throw new UnauthorizedException("You don't have permissions to access this resource");
        m.setRead(true);
        messageRp.save(m);
        return m;
    }

    public void sendMessageToClient(Message message) {


        Set<UUID> clientIds = sessionSvc.getClientIdsFromUserId(message.getRecipientUser().getId());
        log.info(message.getRecipientUser().getId() + " receiving message");
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

    public void pushWorkSession() throws NotFoundException {
        Set<UUID> adminClientIds = sessionSvc.getClientIdsFromUserId(profileSvc.getAdminUserId().getAdminUserId());
        Optional<WorkSession> opt = _sessionRp.findAll().stream().filter(WorkSession::isActive).findFirst();
        if (opt.isEmpty()) return;
        for (UUID clientId : adminClientIds) {
            SocketIOClient client = clientSvc.getClient(clientId);
            log.info(client);
            if (client != null) {
                log.info("send active session");
                client.sendEvent("active_session", opt.get());
            }

        }
    }


}
