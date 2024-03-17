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
@Table(name = "toppings")
public class Topping {

    @Id
    private String name;

    private double price;

    private long createdAt;

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
