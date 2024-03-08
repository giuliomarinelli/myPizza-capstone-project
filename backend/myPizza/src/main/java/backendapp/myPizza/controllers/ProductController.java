package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.Product;
import backendapp.myPizza.Models.entities.Topping;
import backendapp.myPizza.Models.reqDTO.AddToppingsDTO;
import backendapp.myPizza.Models.reqDTO.ProductDTO;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasAuthority('ADMIN')")
public class ProductController {

    @Autowired
    private ProductService productSvc;

    @GetMapping("/toppings")
    public Page<Topping> getAllToppings(Pageable pageable) {
        return productSvc.findAllToppings(pageable);
    }
    @PostMapping("/toppings")
    public Page<Topping> addToppings(@RequestBody AddToppingsDTO addToppingsDTO, Pageable pageable) throws BadRequestException {
        return productSvc.addToppings(addToppingsDTO.toppings(), pageable);
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody ProductDTO productDTO) throws BadRequestException {
        return productSvc.addProduct(productDTO);
    }

}