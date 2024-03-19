package backendapp.myPizza.Models.reqDTO;

import java.util.UUID;

public record OrderSetDTO(
        UUID productId,
        Integer quantity
) {
}
