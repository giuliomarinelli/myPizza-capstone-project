package backendapp.myPizza.Models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "products")
public class Product {
    @Id
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "products_toppings",
            joinColumns = @JoinColumn(name = "product_name"),
            inverseJoinColumns = @JoinColumn(name = "topping_name")
    )
    private List<Topping> toppings = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, mappedBy = "products")
    private List<Order> orders = new ArrayList<>();

    private double basePrice;

    private String category;

    private int viewOrder;

    public double getProductTotalAmount() {
        return toppings.stream().mapToDouble(Topping::getPrice).sum() + basePrice;
    }
}
