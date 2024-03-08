package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.Address;
import backendapp.myPizza.Models.entities.Order;
import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.reqDTO.UserPutDTO;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-profile")
public class ProfileController {

    @Autowired
    private ProfileService profileSvc;

    @GetMapping("")
    public User get() throws UnauthorizedException {
        return profileSvc.get();
    }

    @PutMapping("")
    public User put(@RequestBody UserPutDTO userPutDTO) throws UnauthorizedException, BadRequestException {
        return profileSvc.put(userPutDTO);
    }

    @DeleteMapping("")
    public ConfirmRes delete() throws UnauthorizedException {
        return profileSvc.delete();
    }

    @GetMapping("/orders")
    public List<Order> getOrders() throws UnauthorizedException {
        return profileSvc.getOrders();
    }

    @GetMapping("/addresses")
    public List<Address> getAddresses() throws UnauthorizedException {
        return profileSvc.getAddresses();
    }
}
