package backendapp.myPizza.SocketIO.DTO;

import lombok.Data;

@Data
public class RestoreMessageDTO {
    private boolean restoreUnreadOrOfflineMessages;
}
