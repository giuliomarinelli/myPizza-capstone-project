package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Menu;
import backendapp.myPizza.repositories.MenuRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuRepository menuRp;

    public Page<Menu> getMenu(Pageable pageable) {
        return menuRp.findAll(pageable);
    }

    public Page<Menu> saveMenu(List<Menu> menu, Pageable pageable) {
         menuRp.deleteAll();
         menuRp.saveAll(menu);
         return getMenu(pageable);
    }
}
