package backendapp.myPizza.Models.reqDTO;

public record ChangePasswordDTO(
        String oldPassword,
        String newPassword
) {}
