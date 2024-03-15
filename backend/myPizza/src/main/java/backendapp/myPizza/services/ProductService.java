package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Product;
import backendapp.myPizza.Models.entities.Topping;
import backendapp.myPizza.Models.reqDTO.ManyProductsPostDTO;
import backendapp.myPizza.Models.reqDTO.ProductDTO;
import backendapp.myPizza.Models.reqDTO.ToppingDTO;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.repositories.ProductRepository;
import backendapp.myPizza.repositories.ToppingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class ProductService {

    @Autowired
    private ToppingRepository toppingRp;

    @Autowired
    private ProductRepository productRp;

    private static final DecimalFormat df = new DecimalFormat("0.00");

    public List<Topping> findAllToppings() {
        return toppingRp.findAll().stream()
                .peek(t -> t.setDescription(t.getName() + " (" + df.format(t.getPrice()) + "€)")).toList();
    }

    public Topping addTopping(ToppingDTO t) throws BadRequestException {
        List<String> existingToppingNames = toppingRp.findAllToppingNames();
        // Duplicate exception handling
        if (existingToppingNames.contains(t.name()))
            throw new BadRequestException("Topping with name '" + t.name() + "' already exists");
        Topping topping = new Topping(t.name(), t.price());
        toppingRp.save(topping);
        topping.setDescription(topping.getName() + " (" + df.format(topping.getPrice()) + "€)");
        return topping;
    }

    public Topping updateToppingByName(String oldName, ToppingDTO toppingDTO) throws BadRequestException {
        Topping oldTopping = toppingRp.findByName(oldName).orElseThrow(
                () -> new BadRequestException("Topping you're trying to update doesn't exist")
        );
        toppingRp.delete(oldTopping);
        Topping topping = new Topping(toppingDTO.name(), toppingDTO.price());
        toppingRp.save(topping);
        topping.setDescription(topping.getName() + " (" + df.format(topping.getPrice()) + "€)");
        return topping;
    }


    public ConfirmRes deleteToppingByName(String name) throws BadRequestException {
        Topping topping = toppingRp.findByName(name).orElseThrow(
                () -> new BadRequestException("Topping you're trying to delete doesn't exist")
        );
        for (Product p : topping.getProducts()) {
            p.getToppings().remove(topping);
            productRp.save(p);
        }
        toppingRp.delete(topping);
        return new ConfirmRes("Topping '" + name + "' has been successfully deleted", HttpStatus.OK);
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRp.findAll(pageable).map(p -> {
            p.setToppings(p.getToppings().stream()
                    .peek(t -> t.setDescription(t.getName() + " (" + df.format(t.getPrice()) + "€)")).toList());
            p.setProductTotalAmount();
            return p;
        });
    }

    public Product updateProductByName(String oldName, ProductDTO productDTO) throws BadRequestException {

        Product oldProduct = productRp.findByName(oldName).orElseThrow(
                () -> new BadRequestException("The product you're trying to update (name: '" + oldName + "') doesn't exist")
        );
        productRp.delete(oldProduct);

        Product product = new Product(productDTO.name(), productDTO.basePrice(), productDTO.category());

        List<Topping> toppings = new ArrayList<>();

        for (String name : productDTO.toppings()) {
            Topping t = toppingRp.findByName(name).orElseThrow(
                    () -> new BadRequestException("Topping (old name: '" + name + "') you're trying to update doesn't exist")
            );
            t.setDescription(t.getName() + " (" + df.format(t.getPrice()) + "€)");
            toppings.add(t);
        }

        for (Topping t : toppings) {
            product.getToppings().add(t);
        }

        product.setProductTotalAmount();
        productRp.save(product);
        return product;
    }

    public ConfirmRes deleteProductByName(String name) throws BadRequestException {
        Product product = productRp.findByName(name).orElseThrow(
                () -> new BadRequestException("The product you're trying to delete doesn't exist")
        );
        productRp.delete(product);
        return new ConfirmRes("Product with name '" + name + "' deleted successfully", HttpStatus.OK);
    }

    public List<String> getAllCategories() {
        List<String> categories = productRp.getAllCategories();
        categories.addFirst("(seleziona una categoria)");
        categories.addLast("- Inserisci nuova -");
        return categories;
    }

    public List<String> getProductNames() {
        return productRp.findAll().stream().map(Product::getName).toList();
    }

    public List<Product> addManyProducts(ManyProductsPostDTO manyProductsPostDTO) throws BadRequestException {
        List<ProductDTO> products = manyProductsPostDTO.products();
        // Handling exceptions before making db transactions
        for (ProductDTO p : products) {
            Optional<Product> product = productRp.findByName(p.name());
            if (product.isPresent())
                throw new BadRequestException("Product with name '" + p.name() + "' already exists");
            List<String> toppingsNames = p.toppings();
            for (String name : toppingsNames) {
                toppingRp.findByName(name).orElseThrow(
                        () -> new BadRequestException("Topping '" + name + "' doesn't exist")
                );
            }
        }
        // Handling exception finish
        List<Product> addedProducts = new ArrayList<>();
        for (ProductDTO p : products) {
            Product newProduct = new Product(p.name(), p.basePrice(), p.category());


            for (String name : p.toppings()) {
                assert toppingRp.findByName(name).isPresent();
                newProduct.getToppings().add(toppingRp.findByName(name).get());
            }
            addedProducts.add(newProduct);
        }
        productRp.saveAll(addedProducts);
        return addedProducts.stream()
                .peek(p -> p.setToppings(p.getToppings().stream()
                        .peek(t -> t.setDescription(t.getName() + " (" + df.format(t.getPrice()) + "€)"))
                        .toList())).toList();
    }

    public Product addProduct(ProductDTO productDTO) throws BadRequestException {
        Product p = new Product();
        p.setName(productDTO.name());
        p.setBasePrice(productDTO.basePrice());
        for (String toppingName : productDTO.toppings()) {
            Topping topping = toppingRp.findByName(toppingName)
                    .orElseThrow(
                            () -> new BadRequestException("Topping with name '" + toppingName + "doesn't exist")
                    );
        }
        for (String toppingName : productDTO.toppings()) {
            assert toppingRp.findByName(toppingName).isPresent();
            Topping topping = toppingRp.findByName(toppingName).get();
            p.getToppings().add(topping);
        }
        p.setCategory(productDTO.category());
        p.setProductTotalAmount();
        p.setToppings(p.getToppings().stream()
                .peek(t -> t.setDescription(t.getName() + " (" + df.format(t.getPrice()) + "€)")).toList());

        return productRp.save(p);

    }

}
