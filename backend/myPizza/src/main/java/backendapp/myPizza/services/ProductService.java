package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Product;
import backendapp.myPizza.Models.entities.Topping;
import backendapp.myPizza.Models.reqDTO.ManyProductsPostDTO;
import backendapp.myPizza.Models.reqDTO.ProductDTO;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.repositories.ProductRepository;
import backendapp.myPizza.repositories.ToppingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ToppingRepository toppingRp;

    @Autowired
    private ProductRepository productRp;

    public List<Topping> findAllToppings() {
        return toppingRp.findAll().stream()
                .peek(t -> t.setDescription(t.getName() + " (" + t.getPrice() + "€)")).toList();
    }



    public List<Topping> addToppings(List<Topping> toppings) throws BadRequestException {
        try {
            toppingRp.saveAll(toppings);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("You entered a topping already existing");
        }
        return findAllToppings();
    }

    public Topping updateToppingByName(String name, Topping newTopping) throws BadRequestException {
        Topping topping = toppingRp.findById(name).orElseThrow(
                () -> new BadRequestException("Topping you're trying to update doesn't exist")
        );
        topping.setName(newTopping.getName());
        topping.setPrice(newTopping.getPrice());
        return toppingRp.save(topping);
    }

    public ConfirmRes deleteToppingByName(String name) throws BadRequestException {
        Topping topping = toppingRp.findById(name).orElseThrow(
                () -> new BadRequestException("Topping you're trying to delete doesn't exist")
        );
        toppingRp.delete(topping);
        return new ConfirmRes("Topping '" + name + "' has been successfully deleted", HttpStatus.OK);
    }

    public List<String> getAllCategories() {
        List<String> categories = productRp.getAllCategories();
        categories.addLast("- Inserisci nuova -");
        categories.addFirst("(seleziona una categoria)");
        return categories;
    }

    public List<String> getProductNames() {
        return productRp.findAll().stream().map(Product::getName).toList();
    }

    public List<Product> addManyProducts(ManyProductsPostDTO manyProductsPostDTO) throws BadRequestException {
        List<ProductDTO> products = manyProductsPostDTO.products();
        // Handling exceptions before making db transactions
        for (ProductDTO p : products) {
            Optional<Product> product = productRp.findById(p.name());
            if (product.isPresent())
                throw new BadRequestException("Product with name '" + p.name() + "' already exists");
            List<String> toppingsNames = p.toppings();
            for (String name : toppingsNames) {
                toppingRp.findById(name).orElseThrow(
                        () -> new BadRequestException("Topping '" + name + "' doesn't exist")
                );
            }
        }
        // Handling exception finish
        List<Product> addedProducts = new ArrayList<>();
        for (ProductDTO p : products) {
            Product newProduct = new Product();
            newProduct.setName(p.name());
            newProduct.setCategory(p.category());
            newProduct.setBasePrice(p.basePrice());
            for (String name : p.toppings()) {
                assert toppingRp.findById(name).isPresent();
                newProduct.getToppings().add(toppingRp.findById(name).get());
                addedProducts.add(newProduct);
            }
        }
        return productRp.saveAll(addedProducts);
    }

    public Product addProduct(ProductDTO productDTO) throws BadRequestException {
        Product p = new Product();
        p.setName(productDTO.name());
        p.setBasePrice(productDTO.basePrice());
        for (String toppingName : productDTO.toppings()) {
            Topping topping = toppingRp.findById(toppingName)
                    .orElseThrow(
                            () -> new BadRequestException("Topping with name '" + toppingName + "doesn't exist")
                    );
        }
        for (String toppingName : productDTO.toppings()) {
            assert toppingRp.findById(toppingName).isPresent();
            Topping topping = toppingRp.findById(toppingName).get();
            p.getToppings().add(topping);
        }
        p.setCategory(productDTO.category());
        p.setProductTotalAmount();
        return productRp.save(p);

    }

}
