package backendapp.myPizza.SocketIO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private UUID senderUserId;
    private UUID recipientUserId;
    private UUID orderId;
    private String from;
    private String to;
    private String message;
    private LocalDateTime sentAt;
}
