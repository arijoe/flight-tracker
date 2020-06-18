package PSU.Grad.Flight.Search;

import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/flights")
@RestController
public class Controller {

    String host = "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com";
    String key = "e4dabae40emsh90f58866c571a5cp1e5090jsn121b08c88723";

    @Autowired
    public Controller() {}

    @GetMapping(path = "{origin}/{destination}/{outbound}/{inbound}")
    public String getFlights(@PathVariable("origin") String origin,
                             @PathVariable("destination") String destination,
                             @PathVariable("outbound") String outbound,
                             @PathVariable("inbound") String inbound) {
        String response = "";
        try {
           response = Unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/{origin}-sky/{destination}-sky/{outbound}?inboundpartialdate={inbound}")
               .routeParam("origin", origin)
               .routeParam("destination", destination)
               .routeParam("outbound", outbound)
               .routeParam("inbound", inbound)
               .header("x-rapidapi-host", host)
               .header("x-rapidapi-key", key)
               .asJson().getBody().toString();
        } catch (UnirestException e) {
           e.printStackTrace();
           return String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @GetMapping(path = "{origin}/{destination}/{outbound}")
    public String getFlights(@PathVariable("origin") String origin,
                             @PathVariable("destination") String destination,
                             @PathVariable("outbound") String outbound) {
        String response = "";
        try {
            response = Unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/{origin}-sky/{destination}-sky/{outbound}")
                    .routeParam("origin", origin)
                    .routeParam("destination", destination)
                    .routeParam("outbound", outbound)
                    .header("x-rapidapi-host", host)
                    .header("x-rapidapi-key", key)
                    .asJson().getBody().toString();
        } catch (UnirestException e) {
            e.printStackTrace();
            return String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}
