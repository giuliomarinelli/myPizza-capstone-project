package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.*;
import backendapp.myPizza.Models.enums.OrderStatus;
import backendapp.myPizza.Models.reqDTO.OrderInitDTO;
import backendapp.myPizza.Models.reqDTO.OrderSetDTO;
import backendapp.myPizza.Models.resDTO.OrderCheckoutInfo;
import backendapp.myPizza.Models.resDTO.OrderInitRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.repositories.OrderRepository;
import backendapp.myPizza.repositories.OrderSetRepository;
import backendapp.myPizza.repositories.ProductRepository;
import backendapp.myPizza.repositories.UserRepository;
import backendapp.myPizza.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRp;

    @Autowired
    private OrderSetRepository orderSetRp;

    @Autowired
    private ProductRepository productRp;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRp;


    public OrderInitRes orderInit(OrderInitDTO orderInitDTO) throws BadRequestException {
        Order order = new Order();
        order.setStatus(OrderStatus.INIT);
        orderRp.save(order);
        if (orderInitDTO.orderSetsDTO().isEmpty()) throw new BadRequestException("Order sent is empty");
        List<OrderSet> orderSets = new ArrayList<>();
        for (OrderSetDTO o : orderInitDTO.orderSetsDTO()) {
            Product p = productRp.findById(o.productId()).orElseThrow(
                    () -> new BadRequestException("Product with id='" + o.productId() + "' doesn't exist")
            );
            if (o.quantity() <= 0)
                throw new BadRequestException("Product with id=' + o.productId() + ': quantity must be an integer number major than 0");
            orderSets.add(new OrderSet(p, o.quantity()));
        }
        orderSetRp.saveAll(orderSets);
        orderRp.save(order);
        return new OrderInitRes(order.getId(), order.getStatus());
    }

    public OrderCheckoutInfo getClientOrderInit(Boolean guest, Order order) throws UnauthorizedException, BadRequestException {
        if (guest) {
            // da implementare
            return null;
        } else {
            UUID userId = jwtUtils.extractUserIdFromReq();
            assert userRp.findById(userId).isPresent();
            User user = userRp.findById(userId).get();
            Address address = user.getAddresses().stream().filter(Address::is_default).findFirst()
                    .orElseThrow(
                            () -> new BadRequestException("Cannot find default address, please set a default address before retrying")
                    );
            OrderStatus status = order.getStatus();
            List<OrderSet> orderSets = order.getOrderSets();
            double deliveryCost = order.getDeliveryCost();
            double totalAmount = deliveryCost + orderSets
                    .stream().mapToDouble(os -> os.getQuantity() * ( os.getProduct().getBasePrice()
                            + os.getProduct().getToppings().stream().mapToDouble(Topping::getPrice).sum())).sum();
            return new OrderCheckoutInfo(order.getId(), address, orderSets, status, deliveryCost, totalAmount);
        }

    }

}
