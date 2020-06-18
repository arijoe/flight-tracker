package PSU.Grad.Flight.Search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FlightSearchApplication {

	private static final Logger log = LoggerFactory.getLogger(FlightSearchApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(FlightSearchApplication.class, args);
	}
}
