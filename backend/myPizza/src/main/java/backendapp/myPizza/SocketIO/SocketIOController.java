package backendapp.myPizza.SocketIO;

import backendapp.myPizza.SocketIO.services.MessageService;
import backendapp.myPizza.SocketIO.services.SessionTrackingService;
import backendapp.myPizza.SocketIO.services.SocketIOClientService;
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

import java.util.List;
import java.util.UUID;

@Component
@Log4j2
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

    SocketIOController(SocketIOServer socketServer) {
        this.socketServer = socketServer;

        this.socketServer.addConnectListener(onUserConnectWithSocket);
        this.socketServer.addDisconnectListener(onUserDisconnectWithSocket);

        /**
         * Here we create only one event listener
         * but we can create any number of listener
         * messageSendToUser is socket end point after socket connection user have to send message payload on messageSendToUser event
         */
        this.socketServer.addEventListener("messageSendToUser", Message.class, onSendMessage);

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

    public DataListener<Message> onSendMessage = new DataListener<Message>() {
        @Override
        public void onData(SocketIOClient client, Message message, AckRequest acknowledge) throws Exception {

            /**
             * Sending message to target user
             * target user should subscribe the socket event with his/her name.
             * Send the same payload to user
             */
            message.setSenderUserId(getUserId(client));

            log.info(message.getSenderUserId() + " user sent message to user " + message.getRecipientUserId() + " and message is " + message.getMessage());
            messageSvc.sendMessageToClient(message);


            /**
             * After sending message to target user we can send acknowledge to sender
             */
            acknowledge.sendAckData("Message sent to target user successfully");
        }
    };

}