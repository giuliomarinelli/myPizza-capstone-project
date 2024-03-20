package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Order;
import backendapp.myPizza.Models.entities.WorkSession;
import backendapp.myPizza.Models.enums.OrderStatus;
import backendapp.myPizza.Models.reqDTO.StartSessionDTO;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.repositories.OrderRepository;
import backendapp.myPizza.repositories.WorkSessionRepository;
import jakarta.mail.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class _SessionService {

    @Autowired
    private OrderRepository orderRp;

    @Autowired
    private WorkSessionRepository _sessionRp;

    public boolean isThereAnActiveSession() {
        return _sessionRp.findAll().stream().anyMatch(WorkSession::isActive);
    }

    public WorkSession getActiveSession() throws BadRequestException {
        return _sessionRp.findAll().stream().filter(WorkSession::isActive).findFirst().orElseThrow(
                () -> new BadRequestException("There isn't any active session")
        );
    }

    public WorkSession startNewSession(StartSessionDTO startSessionDTO) {
        _sessionRp.saveAll(_sessionRp.findAll().stream().peek(s -> {
            if (s.isActive()) s.setActive(false);
        }).toList());
        WorkSession session = new WorkSession(startSessionDTO.type(), startSessionDTO.openTime(), startSessionDTO.closeTime(),
                startSessionDTO.cookCount(), startSessionDTO.ridersCount());
        session.setActive(true);
        return _sessionRp.save(session);
    }

    public ConfirmRes closeActiveSession() throws BadRequestException {
        WorkSession session = getActiveSession();
        session.setActive(false);
        _sessionRp.save(session);
        return new ConfirmRes("Working session with id='" + session.getId() + "' successfully closed", HttpStatus.OK);
    }

    public ConfirmRes addOrderToActiveSession(UUID orderId) throws BadRequestException {
        Order order = orderRp.findById(orderId).orElseThrow(
                () -> new BadRequestException("Order wid id =" + orderId + "' doesn't exist")
        );
        WorkSession session = getActiveSession();
        order.setStatus(OrderStatus.ACCEPTED);
        session.getOrders().add(order);
        _sessionRp.save(session);
        return new ConfirmRes("Order wid id ='" + orderId + "' correctly added to active working session", HttpStatus.OK);
    }
}