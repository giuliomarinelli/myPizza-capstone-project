package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.entities.Topping;

import java.util.List;

public record AddToppingsDTO(
        List<Topping> toppings
) {

}
