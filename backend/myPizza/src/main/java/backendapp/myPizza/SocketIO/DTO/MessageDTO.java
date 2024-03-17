package backendapp.myPizza.SocketIO.DTO;


import backendapp.myPizza.Models.entities.Order;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record MessageDTO(
        @NotNull
        UUID recipientUserId,
        Order order,
        @NotNull
        String message
) {}