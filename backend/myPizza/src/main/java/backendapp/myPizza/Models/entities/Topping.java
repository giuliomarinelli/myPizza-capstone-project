package backendapp.myPizza.Models.entities;

import jakarta.persistence.*;
import lombok.*;

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

    @ManyToMany(mappedBy = "toppings", fetch = FetchType.EAGER)
    private List<Product> products = new ArrayList<>();


}
