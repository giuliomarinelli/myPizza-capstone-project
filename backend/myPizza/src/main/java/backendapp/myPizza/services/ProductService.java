package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Product;
import backendapp.myPizza.Models.entities.Topping;
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

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ToppingRepository toppingRp;

    @Autowired
    private ProductRepository productRp;

    public Page<Topping> findAllToppings(Pageable pageable) {
        return toppingRp.findAll(pageable);
    }

    public Page<Topping> addToppings(List<Topping> toppings, Pageable pageable) throws BadRequestException {
        try {
            toppingRp.saveAll(toppings);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("You entered a topping already existing");
        }
        return findAllToppings(pageable);
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


    public Product addProduct(ProductDTO productDTO) throws BadRequestException {
        Product p = new Product();
        p.setName(productDTO.name());
        p.setBasePrice(productDTO.basePrice());
        for (String toppingName: productDTO.toppings()) {
            Topping topping = toppingRp.findById(toppingName)
                    .orElseThrow(
                            () -> new BadRequestException("Topping with name '" + toppingName + "doesn't exist")
                    );
        }
        for (String toppingName: productDTO.toppings()) {
            assert toppingRp.findById(toppingName).isPresent();
            Topping topping = toppingRp.findById(toppingName).get();
            p.getToppings().add(topping);
        }
        p.setCategory(productDTO.category());
        p.setProductTotalAmount();
        return productRp.save(p);

    }

}
