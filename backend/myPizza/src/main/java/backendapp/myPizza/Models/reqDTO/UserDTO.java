package backendapp.myPizza.Models.reqDTO;

public record UserDTO(
        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        String password,

        AddressDTO address


) {}
