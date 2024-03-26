package backendapp.myPizza;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
public class MyPizzaApplication {


	public static void main(String[] args) {
		SpringApplication.run(MyPizzaApplication.class, args);
	}

}
