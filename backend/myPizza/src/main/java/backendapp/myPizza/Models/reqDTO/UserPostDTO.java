package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.enums.Gender;

public record UserPostDTO(
        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        String password,

        Gender gender,

        AddressDTO address


) {}
