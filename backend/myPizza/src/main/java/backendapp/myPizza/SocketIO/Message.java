package backendapp.myPizza.SocketIO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private UUID recipientClientId;
    private String message;
}
