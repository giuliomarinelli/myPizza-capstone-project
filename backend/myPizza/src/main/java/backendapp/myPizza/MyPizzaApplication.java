package backendapp.myPizza;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class MyPizzaApplication {
	// implementato sistema di autenticazione e websocket per messaggi client-to-client

	public static void main(String[] args) {
		SpringApplication.run(MyPizzaApplication.class, args);
	}

}
