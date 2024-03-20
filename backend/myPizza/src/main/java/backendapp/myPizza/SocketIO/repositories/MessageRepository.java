package backendapp.myPizza.SocketIO.repositories;

import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.SocketIO.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("SELECT m FROM Message m WHERE recipientUser.id = :recipientUserId")
    public List<Message> findAllMessagesByRecipientUserId(UUID recipientUserId);
    @Query("SELECT m FROM Message m WHERE m.recipientUser.id = :recipientUserId AND m.read = false")
    public List<Message> findAllUnreadMessagesByRecipientUserId(UUID recipientUserId);

    @Query("SELECT m FROM Message m WHERE m.recipientUser.id = :recipientUserId AND m.wasUserOnLine = false AND m.read = false")
    public List<Message> findAllWasOffLineMessagesByRecipientUserId(UUID recipientUserId);

    @Query("SELECT m FROM Message m WHERE m.recipientUser.id = :recipientUserId AND m.read = true")
    public List<Message> findAllReadMessagesByRecipientUserId(UUID recipientUserId);


}
