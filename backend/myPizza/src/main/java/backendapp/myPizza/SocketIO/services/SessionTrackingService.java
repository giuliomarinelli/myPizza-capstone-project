package backendapp.myPizza.SocketIO.services;

import com.corundumstudio.socketio.SocketIOClient;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionTrackingService {

    private final Map<UUID, UUID> sessionTracker = new ConcurrentHashMap<>();

    public void addSession(UUID sessionId, UUID userId) {
        sessionTracker.put(sessionId, userId);
    }

    public UUID getUserIdFromSessionId(UUID sessionId) {
        return sessionTracker.get(sessionId);
    }

    public void removeSession(UUID sessionId) {
        sessionTracker.remove(sessionId);
    }
}

