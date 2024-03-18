package backendapp.myPizza.Models.reqDTO;

import java.util.List;

public record OrderInitDTO(
        List<OrderSetDTO> orderSetDTO
) {
}
