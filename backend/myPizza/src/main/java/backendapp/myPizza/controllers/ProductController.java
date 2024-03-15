package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.Product;
import backendapp.myPizza.Models.entities.Topping;
import backendapp.myPizza.Models.reqDTO.AddToppingsDTO;
import backendapp.myPizza.Models.reqDTO.ManyProductsPostDTO;
import backendapp.myPizza.Models.reqDTO.ProductDTO;
import backendapp.myPizza.Models.reqDTO.ToppingDTO;
import backendapp.myPizza.Models.resDTO.CategoriesRes;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.Models.resDTO.ProductNamesRes;
import backendapp.myPizza.Models.resDTO.ToppingsRes;
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

    // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
    // Toppings

    @GetMapping("/toppings")
    public ToppingsRes getAllToppings() {
        return new ToppingsRes(productSvc.findAllToppings());
    }

    @PostMapping("/toppings")
    public Topping addTopping(@RequestBody ToppingDTO toppingDTO) throws BadRequestException {
        return productSvc.addTopping(toppingDTO);
    }

    @PutMapping("/toppings/{name}")
    public Topping updateToppingByName(@PathVariable String name, @RequestBody ToppingDTO toppingDTO) throws BadRequestException {
        return productSvc.updateToppingByName(name, toppingDTO);
    }

    @DeleteMapping("/toppings/{name}")
    public ConfirmRes deleteToppingByName(@PathVariable String name) throws BadRequestException {
        return productSvc.deleteToppingByName(name);
    }

    // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
    // Products

    @GetMapping("/products")
    public Page<Product> getAllProducts(Pageable pageable) {
        return productSvc.getAllProducts(pageable);
    }

    @GetMapping("/products/product-names")
    public ProductNamesRes getProductNames() {
        return new ProductNamesRes(productSvc.getProductNames());
    }

    @GetMapping("/products/categories")
    public CategoriesRes getCategories() {
        return new CategoriesRes(productSvc.getAllCategories());
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody ProductDTO productDTO) throws BadRequestException {
        return productSvc.addProduct(productDTO);
    }

    @PostMapping("/products/add-many")
    public List<Product> addManyProducts(@RequestBody ManyProductsPostDTO manyProductsPostDTO) throws BadRequestException {
        return productSvc.addManyProducts(manyProductsPostDTO);
    }

    @PutMapping("/products/{name}")
    public Product updateProduct(@PathVariable String name, @RequestBody ProductDTO productDTO) throws BadRequestException {
        System.out.println("ciao");
        return productSvc.updateProductByName(name, productDTO);
    }

    @DeleteMapping("/products/{name}")
    public ConfirmRes deleteProduct(@PathVariable String name) throws BadRequestException {
        return productSvc.deleteProductByName(name);
    }


}