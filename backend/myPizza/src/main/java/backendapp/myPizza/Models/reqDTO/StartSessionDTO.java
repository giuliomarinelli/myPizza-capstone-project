package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.enums.WorkSessionType;

public record StartSessionDTO(

        WorkSessionType type,
        Long openTime,
        Long closeTime,
        Integer cookCount,
        Integer ridersCount

) {
}
