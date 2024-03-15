package backendapp.myPizza;

import ch.qos.logback.core.encoder.JsonEscapeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class MyPizzaApplication {


	public static void main(String[] args) {
		SpringApplication.run(MyPizzaApplication.class, args);
	}

}
