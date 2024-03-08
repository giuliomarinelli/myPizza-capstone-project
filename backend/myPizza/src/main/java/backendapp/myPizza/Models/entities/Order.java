package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.enums.OrderStatus;
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

    private LocalDateTime orderTime;

    private LocalDateTime expectedDeliveryTime;

    private LocalDateTime deliveryTime;

    private boolean asap;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String messageFromCustomer;

    private String messageToCustomer;

    private double totalAmount;

    public void calcTotalAmount() {
        totalAmount = products.stream().mapToDouble(Product::getProductTotalAmount).sum();
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


}
