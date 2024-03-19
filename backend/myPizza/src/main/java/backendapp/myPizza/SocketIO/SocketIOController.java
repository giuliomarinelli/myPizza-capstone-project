package backendapp.myPizza.SocketIO;

import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.SocketIO.DTO.MessageDTO;
import backendapp.myPizza.SocketIO.DTO.RestoreMessageDTO;
import backendapp.myPizza.SocketIO.entities.Message;
import backendapp.myPizza.SocketIO.repositories.MessageRepository;
import backendapp.myPizza.SocketIO.services.MessageService;
import backendapp.myPizza.SocketIO.services.SessionTrackingService;
import backendapp.myPizza.SocketIO.services.SocketIOClientService;
import backendapp.myPizza.repositories.UserRepository;
import backendapp.myPizza.security.JwtUtils;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import jakarta.servlet.http.Cookie;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.UUID;

@Component
@Log4j2
@CrossOrigin(origins = "http://localhost:4200")
public class SocketIOController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SocketIOClientService clientSvc;

    @Autowired
    private SessionTrackingService sessionSvc;

    @Autowired
    private MessageService messageSvc;

    @Autowired
    private SocketIOServer socketServer;

    @Autowired
    private UserRepository userRp;

    @Autowired
    private MessageRepository messageRp;

    SocketIOController(SocketIOServer socketServer) {
        this.socketServer = socketServer;

        this.socketServer.addConnectListener(onUserConnectWithSocket);
        this.socketServer.addDisconnectListener(onUserDisconnectWithSocket);

        /**
         * Here we create only one event listener
         * but we can create any number of listener
         * messageSendToUser is socket end point after socket connection user have to send message payload on messageSendToUser event
         */
        this.socketServer.addEventListener("messageSendToUser", MessageDTO.class, onSendMessage);
        this.socketServer.addEventListener("restore_messages", RestoreMessageDTO.class, onRestoreMessage);
    }

    private UUID getUserId(SocketIOClient client) {
        if (client.getHandshakeData().getHttpHeaders().get("Cookie") == null) client.disconnect();
        String cookies = client.getHandshakeData().getHttpHeaders().get("Cookie");
        List<Cookie> parsedCookies = SocketIOAuth.cookieParser(cookies);
        Cookie accessToken = null;
        UUID userId = null;
        try {
            accessToken = parsedCookies.stream().filter(c -> c.getName().equals("__ws_access_tkn")).findFirst().get();
        } catch (Exception e) {
            client.disconnect();
        }
        try {
            assert accessToken != null;
            userId = jwtUtils.extractUserIdFromWsAccessToken(accessToken.getValue());
        } catch (Exception e) {
            client.disconnect();
        }
        System.out.println(accessToken.getValue());
        System.out.println(userId);
        if (userId == null) client.disconnect();
        return userId;
    }

    public ConnectListener onUserConnectWithSocket = new ConnectListener() {
        @Override
        public void onConnect(SocketIOClient client) {
            UUID userId = getUserId(client);
            clientSvc.addClient(client.getSessionId(), client);
            sessionSvc.addSession(userId, client.getSessionId());
            log.info(sessionSvc.getSessionTracker());
            assert userRp.findById(userId).isPresent();
            User u = userRp.findById(userId).get();


            client.sendEvent("connection_ok", "Connected to Socket.IO server.");
        }
    };


    public DisconnectListener onUserDisconnectWithSocket = new DisconnectListener() {
        @Override
        public void onDisconnect(SocketIOClient client) {
            UUID userId = getUserId(client);
            clientSvc.removeClient(client.getSessionId());
            sessionSvc.removeSession(client.getSessionId());
            log.info(sessionSvc.getSessionTracker());
        }
    };

    public void()

    public DataListener<MessageDTO> onSendMessage = new DataListener<>() {
        @Override
        public void onData(SocketIOClient client, MessageDTO messageDTO, AckRequest acknowledge) throws Exception {

            /**
             * Sending message to target user
             * target user should subscribe the socket event with his/her name.
             * Send the same payload to user
             */
            assert userRp.findById(getUserId(client)).isPresent();
            User senderUser = userRp.findById(getUserId(client)).get();

            User recipientUser = userRp.findById(messageDTO.recipientUserId()).orElseThrow(
                    () -> new Exception("recipient user not found")
            );


            boolean isRecipientUserOnLine = sessionSvc.isOnLine(recipientUser.getId());
            log.info(isRecipientUserOnLine);

            log.info(senderUser.getId() + " " + recipientUser.getId());

            Message message = new Message(senderUser, recipientUser, messageDTO.order(), messageDTO.message(), isRecipientUserOnLine);

            client.sendEvent("auto_message", "ciao");


            messageRp.save(message);

            if (isRecipientUserOnLine) {
                messageSvc.sendMessageToClient(message);
            }


            log.info(message.getSenderUser().getId() + " user sent message to user " + message.getRecipientUser().getId() + " and message is " + message.getMessage());



            /**
             * After sending message to target user we can send acknowledge to sender
             */
            acknowledge.sendAckData("Message sent to target user successfully");
        }
    };


    public DataListener<RestoreMessageDTO> onRestoreMessage = new DataListener<>() {
        @Override
        public void onData(SocketIOClient client, RestoreMessageDTO rest, AckRequest acknowledge) throws Exception {


            assert userRp.findById(getUserId(client)).isPresent();
            User senderUser = userRp.findById(getUserId(client)).get();

//            User recipientUser = userRp.findById(messageDTO.recipientUserId()).orElseThrow(
//                    () -> new Exception("recipient user not found")
//            );


//            boolean isRecipientUserOnLine = sessionSvc.isOnLine(recipientUser.getId());
//            log.info(isRecipientUserOnLine);
//
//            log.info(senderUser.getId() + " " + recipientUser.getId());
//
//            Message message = new Message(senderUser, recipientUser, messageDTO.order(), messageDTO.message(), isRecipientUserOnLine);
//
//            client.sendEvent("auto_message", "ciao");
//
//
//            messageRp.save(message);
//
//            if (isRecipientUserOnLine) {
//                messageSvc.sendMessageToClient(message);
//            }
//
//
//            log.info(message.getSenderUser().getId() + " user sent message to user " + message.getRecipientUser().getId() + " and message is " + message.getMessage());
//

            /**
             * After sending message to target user we can send acknowledge to sender
             */
            acknowledge.sendAckData("Message sent to target user successfully");
        }
    };

}