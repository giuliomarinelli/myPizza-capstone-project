package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.InternationalPrefix;
import backendapp.myPizza.Models.entities.Menu;
import backendapp.myPizza.Models.reqDTO.OrderInitDTO;
import backendapp.myPizza.Models.resDTO.CityAutocomplete;
import backendapp.myPizza.Models.resDTO.OrderInitRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private OrderService orderSvc;

    @GetMapping("/menu")
    public Page<Menu> getMenu(Pageable pageable) {
        return menuSvc.getMenu(pageable);
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

    // -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
    // ORDER INIT
    @PostMapping("/order-init")
    public OrderInitRes orderInit(@RequestBody OrderInitDTO orderInitDTO) throws BadRequestException {
        return orderSvc.orderInit(orderInitDTO);
    }

}
