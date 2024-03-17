package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.enums.ItemType;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "toppings")
public class Topping {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(unique = true)
    private String name;

    private double price;

    private long createdAt;

    ItemType type = ItemType.PRODUCT;

    @Transient
    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "toppings", fetch = FetchType.EAGER)
    private List<Product> products = new ArrayList<>();

    public Topping(String name, double price) {
        this.name = name;
        this.price = price;
        createdAt = System.currentTimeMillis();
    }
}
