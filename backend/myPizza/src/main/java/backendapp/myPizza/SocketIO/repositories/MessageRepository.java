package backendapp.myPizza.SocketIO.repositories;

import backendapp.myPizza.SocketIO.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("SELECT m FROM Message m WHERE m.read = false OR m.wasUserOnLine = false")
    public List<Message> restoreMessages();
}
