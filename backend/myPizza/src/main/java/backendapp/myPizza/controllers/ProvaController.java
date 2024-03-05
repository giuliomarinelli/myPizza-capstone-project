package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.resDTO.ConfirmRes;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProvaController {
    @GetMapping("/comuni")
    public ConfirmRes get() {
        return new ConfirmRes("ciao", HttpStatus.OK);
    }
}
