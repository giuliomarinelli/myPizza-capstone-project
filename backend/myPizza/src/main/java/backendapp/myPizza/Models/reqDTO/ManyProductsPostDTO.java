package backendapp.myPizza.Models.reqDTO;

import java.util.List;

public record ManyProductsPostDTO(
        List<ProductDTO> products
) { }
