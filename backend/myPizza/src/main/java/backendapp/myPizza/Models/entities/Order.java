package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.enums.OrderStatus;
import backendapp.myPizza.SocketIO.entities.Message;
import jakarta.persistence.*;
import lombok.*;


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

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "order")
    private List<OrderSet> orderSets;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id")
    private Address address;

    private long orderTime;

    private long expectedDeliveryTime;

    private long deliveryTime;

    private boolean asap;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "order")
    private List<Message> messages;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private double deliveryCost = 1.5;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "order")
    private Command command;

    private boolean guest;



}
