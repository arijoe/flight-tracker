package PSU.Grad.Flight.Search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 Main class for SpringBoot application
 */
@SpringBootApplication
public class FlightSearchApplication {
	/**
	  Application Logger (to be used as needed)
	 */
	private static final Logger log = LoggerFactory.getLogger(FlightSearchApplication.class);

	/**
	  Main method that runs the SpringBoot web application locally at port 8080
	 */
	public static void main(String[] args) {
		SpringApplication.run(FlightSearchApplication.class, args);
	}
}
