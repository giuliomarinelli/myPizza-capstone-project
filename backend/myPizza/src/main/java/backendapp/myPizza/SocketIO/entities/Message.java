package backendapp.myPizza.SocketIO.entities;

import backendapp.myPizza.Models.entities.Order;
import backendapp.myPizza.Models.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_user_id", nullable = false)
    private User senderUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipientUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private Order order;

    private String from;

    private String to;

    private String message;

    private LocalDateTime sentAt;

    private boolean wasUserOnLine;

    private boolean read;

    public Message(User senderUser, User recipientUser, Order order, String message, boolean wasUserOnLine) {
        this.senderUser = senderUser;
        this.recipientUser = recipientUser;
        this.order = order;
        this.message = message;
        this.wasUserOnLine = wasUserOnLine;
        from = senderUser.getMessagingUsername();
        to = recipientUser.getMessagingUsername();
        sentAt = LocalDateTime.now();
        read = false;

    }
}
