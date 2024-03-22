package backendapp.myPizza.Models.reqDTO;

import java.util.UUID;

public record ConfirmOrderDTO (
        UUID orderId,

        UUID timeIntervalId
){
}
