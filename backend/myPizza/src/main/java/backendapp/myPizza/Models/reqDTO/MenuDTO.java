package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.entities.Menu;

import java.util.List;
import java.util.UUID;

public record MenuDTO(
        List<UUID> menuIds
) {}
