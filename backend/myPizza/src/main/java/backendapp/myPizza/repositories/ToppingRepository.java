package backendapp.myPizza.repositories;

import backendapp.myPizza.Models.entities.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, String> {
    public Optional<Topping> findByName(String name);
}
