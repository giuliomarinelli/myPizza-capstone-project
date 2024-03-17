package backendapp.myPizza.Models.entities;

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
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(unique = true)
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "products_toppings",
            joinColumns = @JoinColumn(name = "product_name"),
            inverseJoinColumns = @JoinColumn(name = "topping_name")
    )
    private List<Topping> toppings = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER, mappedBy = "products")
    private List<Order> orders = new ArrayList<>();

    private double basePrice;

    private String category;

    private long createdAt;

    @JsonIgnore
    @OneToOne(mappedBy = "product")
    private Task task;

    @Transient
    private double price;

    public Product(String name, double basePrice, String category) {
        this.name = name;
        this.basePrice = basePrice;
        this.category = category;
        createdAt = System.currentTimeMillis();
    }

    public void setProductTotalAmount() {
        price = toppings.stream().mapToDouble(Topping::getPrice).sum() + basePrice;
    }
}
