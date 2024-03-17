package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.enums.OrderStatus;
import backendapp.myPizza.SocketIO.entities.Message;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "orders_products",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_name")
    )

    private List<Product> products = new ArrayList<>();

    private long orderTime;

    private long expectedDeliveryTime;

    private long deliveryTime;

    private boolean asap;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "order")
    private List<Message> messages;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String messageFromCustomer;

    private String messageToCustomer;

    private double deliveryCost = 1.5;

    private double totalAmount;

    public void calcTotalAmount() {
        totalAmount = deliveryCost + products.stream().mapToDouble(Product::getPrice).sum();
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "order")
    private Command command;


}
