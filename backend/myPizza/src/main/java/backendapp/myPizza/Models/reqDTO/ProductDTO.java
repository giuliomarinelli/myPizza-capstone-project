package backendapp.myPizza.Models.reqDTO;

import java.util.List;

public record ProductDTO(
        String name,
        Double basePrice,
        List<String> toppings,
        String category

) {}
