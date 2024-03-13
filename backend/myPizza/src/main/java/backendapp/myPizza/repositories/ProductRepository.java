package backendapp.myPizza.repositories;

import backendapp.myPizza.Models.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, String>, PagingAndSortingRepository<Product, String> {
    @Query("SELECT DISTINCT(p.category) FROM Product p ORDER BY p.category ASC")
    public List<String> getAllCategories();
}
