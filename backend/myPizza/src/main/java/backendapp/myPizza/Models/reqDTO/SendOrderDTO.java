package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.entities.Address;

import java.util.UUID;

public record SendOrderDTO(
        UUID orderId,

        Boolean asap,

        Long expectedDeliveryTime,

        Address address
) {}
