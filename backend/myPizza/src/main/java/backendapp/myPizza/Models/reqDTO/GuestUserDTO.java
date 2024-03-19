package backendapp.myPizza.Models.reqDTO;

import backendapp.myPizza.Models.enums.Gender;

public record GuestUserDTO(String firstName,

                           String lastName,

                           String email,

                           AddressDTO address) {
}
