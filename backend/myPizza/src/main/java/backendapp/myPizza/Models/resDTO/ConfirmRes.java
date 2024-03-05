package backendapp.myPizza.Models.resDTO;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;
@Data
public class ConfirmRes {

    private String message;

    public ConfirmRes(String message, HttpStatus httpStatus) {
        this.message = message;
        int statusCode = httpStatus.value();
        Timestamp timestamp = Timestamp.valueOf(LocalDateTime.now());
    }
}
