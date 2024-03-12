package backendapp.myPizza.Models.reqDTO;

import java.util.List;

public record ManyProductsDTO(
        List<ProductDTO> products
) {
}
