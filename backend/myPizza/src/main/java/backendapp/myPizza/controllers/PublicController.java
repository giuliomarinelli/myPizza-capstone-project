package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.InternationalPrefix;
import backendapp.myPizza.Models.entities.Menu;
import backendapp.myPizza.Models.resDTO.CityAutocomplete;
import backendapp.myPizza.services.CityService;
import backendapp.myPizza.services.MenuService;
import backendapp.myPizza.services.PrefixService;
import backendapp.myPizza.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private PrefixService prefixSvc;

    @Autowired
    private CityService citySvc;

    @Autowired
    private MenuService menuSvc;

    @GetMapping("/menu")
    public List<Menu> getMenu() {
        return menuSvc.getMenu();
    }

    @GetMapping("/international-prefixes")
    public List<InternationalPrefix> getInternationalPrefixes() {
        return prefixSvc.findAll();
    }

    @GetMapping("/city-autocomplete")
    public List<CityAutocomplete> getCityAutocomplete(@RequestParam String q,  @RequestParam(required = false) Integer limit) {
        int l = 10;
        if (limit != null) l = limit;
        return citySvc.search(q, l);
    }

}
