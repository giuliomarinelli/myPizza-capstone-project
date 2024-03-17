package backendapp.myPizza.Models.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Entity
@Table(name = "commands")
public class Command {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    private long createdAt;

    private String customerCompleteName;

    @Transient
    private Map<String, Double> prices;

    @Transient
    private double totalPrice;

    @OneToMany(mappedBy = "command")
    private List<Task> tasks;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

}
