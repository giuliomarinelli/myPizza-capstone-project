package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.enums.ToppingType;

public record ToppingDTO(
        String name,
        Double price,

        ToppingType type
) {}
