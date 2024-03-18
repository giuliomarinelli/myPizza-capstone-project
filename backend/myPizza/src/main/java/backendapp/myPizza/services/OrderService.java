package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Order;
import backendapp.myPizza.Models.entities.OrderSet;
import backendapp.myPizza.Models.entities.Product;
import backendapp.myPizza.Models.enums.OrderStatus;
import backendapp.myPizza.Models.reqDTO.OrderInitDTO;
import backendapp.myPizza.Models.reqDTO.OrderSetDTO;
import backendapp.myPizza.Models.resDTO.OrderInitRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.repositories.OrderRepository;
import backendapp.myPizza.repositories.OrderSetRepository;
import backendapp.myPizza.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRp;

    @Autowired
    private OrderSetRepository orderSetRp;

    @Autowired
    private ProductRepository productRp;

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

}
