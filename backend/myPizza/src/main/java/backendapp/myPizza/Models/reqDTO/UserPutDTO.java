package backendapp.myPizza.Models.reqDTO;

public record UserPutDTO(
        String firstName,

        String lastName,

        String email,

        String phoneNumber
) {}
