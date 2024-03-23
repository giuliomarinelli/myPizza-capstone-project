package backendapp.myPizza.controllers;

import backendapp.myPizza.Models.entities.Order;
import backendapp.myPizza.Models.entities.OrderSet;
import backendapp.myPizza.Models.reqDTO.ConfirmOrderDTO;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.exceptions.NotFoundException;
import backendapp.myPizza.services.OrderService;
import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderSvc;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable UUID orderId) throws BadRequestException {
        return orderSvc.getOrderById(orderId);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/confirm")
    public ConfirmRes confirmOrder(@RequestBody ConfirmOrderDTO confirmOrderDTO) throws BadRequestException {
        return orderSvc.confirmOrder(confirmOrderDTO.orderId(), confirmOrderDTO.timeIntervalId());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{orderId}/reject")
    public ConfirmRes confirmOrder(@PathVariable UUID orderId) throws BadRequestException {
        return orderSvc.rejectOrder(orderId);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{orderId}/set-completed")
    public ConfirmRes completeOrder(@PathVariable UUID orderId) throws BadRequestException, NotFoundException {
        return orderSvc.completeOrder(orderId);
    }

}
