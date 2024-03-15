package backendapp.myPizza.Models.Classes;

import backendapp.myPizza.Models.entities.Product;
import lombok.Data;

@Data
public class Task {
    private Product product;
    private boolean completed;
}
