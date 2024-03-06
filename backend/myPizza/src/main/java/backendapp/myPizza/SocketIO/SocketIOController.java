package backendapp.myPizza.SocketIO;



import backendapp.myPizza.SocketIO.data.Message;
import backendapp.myPizza.SocketIO.services.SessionTrackingService;
import backendapp.myPizza.SocketIO.services.SocketIOClientService;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.security.JwtUtils;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.HandshakeData;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import jakarta.servlet.http.Cookie;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.UUID;

@Component
@Log4j2
public class SocketIOController {

    @Autowired
    private SessionTrackingService sessionTrackingSvc;

    @Autowired
    private SocketIOClientService clientSvc;

    @Autowired
    private SocketIOServer socketServer;

    @Autowired
    private JwtUtils jwtUtils;

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


    public ConnectListener onUserConnectWithSocket = new ConnectListener() {
        @Override
        public void onConnect(SocketIOClient client) {
            String cookies = client.getHandshakeData().getHttpHeaders().get("Cookie");
            List<Cookie> parsedCookies = SocketIOAuth.cookieParser(cookies);
            Cookie accessToken = null;
            UUID userId = null;
            try {
                accessToken = parsedCookies.stream().filter(c -> c.getName().equals("access_tkn")).findFirst().get();
            } catch (Exception e) {
                client.disconnect();
            }
            try {
                userId = jwtUtils.extractUserIdFromAccessToken(accessToken.getValue());
            } catch (Exception e) {
                client.disconnect();
            }
            clientSvc.addClient(client.getSessionId(), client);
            sessionTrackingSvc.addSession(client.getSessionId(), userId);
            log.info("Perform operation on user connect in controller");
            System.out.println("SID" + client.getSessionId());
            System.out.println("UserId" + userId);
        }
    };


    public DisconnectListener onUserDisconnectWithSocket = new DisconnectListener() {
        @Override
        public void onDisconnect(SocketIOClient client) {
            log.info("Perform operation on user disconnect in controller");
            sessionTrackingSvc.removeSession(client.getSessionId());
            clientSvc.removeClient(client.getSessionId());
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

            log.info(message.getMessage());
            socketServer.getBroadcastOperations().sendEvent("Ciao", client, message);



            /**
             * After sending message to target user we can send acknowledge to sender
             */
            acknowledge.sendAckData("Message send to target user successfully");
        }
    };

}