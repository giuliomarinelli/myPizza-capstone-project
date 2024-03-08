package backendapp.myPizza.repositories;

import backendapp.myPizza.Models.entities.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, String> {

}
