package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.enums.Gender;

public record UserPutDTO(
        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        Gender gender
) {}
