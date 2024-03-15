package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.entities.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.util.UUID;

@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "product_id")

    private Product product;

    private boolean completed;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "command_id")
    private Command command;
}
