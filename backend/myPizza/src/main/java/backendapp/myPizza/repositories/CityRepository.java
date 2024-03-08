package backendapp.myPizza.repositories;

import backendapp.myPizza.Models.entities.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
    public Optional<City> findByNameAndProvinceCode(String name, String provinceCode);
}
