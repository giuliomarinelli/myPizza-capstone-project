package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Menu;
import backendapp.myPizza.repositories.MenuRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuRepository menuRp;

    public List<Menu> getMenu() {
        return menuRp.findAll();
    }
}
