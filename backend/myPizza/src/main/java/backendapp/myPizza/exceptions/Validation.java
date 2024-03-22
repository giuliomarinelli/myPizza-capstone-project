package backendapp.myPizza.exceptions;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.BindingResult;

import java.util.stream.Collectors;

public class Validation {
    public static String messages(BindingResult validation) {
        return validation.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining("; "));
    }
}
