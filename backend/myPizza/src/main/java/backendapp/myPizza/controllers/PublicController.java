package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.InternationalPrefix;
import backendapp.myPizza.Models.resDTO.CityAutocomplete;
import backendapp.myPizza.services.CityService;
import backendapp.myPizza.services.PrefixService;
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
