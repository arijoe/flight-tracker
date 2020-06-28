## Flight Searcher

<p>This is a project done for a the Penn State Software Engineering Graduate program. It is simple in scope and execution:
use a public API to query external data, and provide a UI for a user to easily interface with that UI.</p>
<p>This repo is being made available publicly for visibility, with the API key hidden (so cloning this project will not
allow the user to run it locally). As of now, it is running as a Heroku application: 
https://ari-flight-searcher.herokuapp.com</p>

### How to Use
#### If accessing through the web
- Go to https://ari-flight-searcher.herokuapp.com
- Fill out the form, hit submit, and view matching quotes beneath the form entry.
#### If running a local jar file
- In the command line, navigate to the directory where the jar file is stored.
- Run `java -jar Flight-Search.jar`
- Once the CLI outputs "Started FlightSearchApplication", point your browser to `localhost:8080`
- Fill out the form, hit submit, and view matching quotes beneath the form entry.

<p>A user can enter an origin and a destination airport code, as well as a departure date and optional return trip date, 
then receive quotes for available flights between the cities on the given dates by airline carrier.</p>

<p>A user can expect to receive a price and carrier for each found flight between the given cities for the requested dates. If no flights
are found, the user should be told as much. For round-trip flights, users will be shown flights for each leg and, accordingly, 
told if no flights could be found for the outbound or inbound trip respectively in the UI.</P>

<p>Invalid search criteria will result in more specific errors. (Note: the application 
does not check if the given airport codes represent real airports. If a non-existent airport is given, the user will simply be 
told no flights matched the search criteria.</p>

### Technologies

The following technologies were used during this project:
- The Skyscanner API available at RapidAPI.com
- Spring Boot to bootstrap a Java web application
- Unirest to access the third party REST endpoint to retrieve flight quotes
- Bootstrap for quick styling enhancements and datepicker widget
- jQuery to work in concert with datepicker widget

### Suggested Improvements

- There is a deficiency with the Skyscanner API where it does not reliably return quotes for the inbound leg, as well as 
the returned data not being entirely robust (flight time, departure time, layover cities, limited flights returned).
- It would be great to deep-link users to the carrier's site where they can move forward with purchasing the quoted flight.
- Ideally, the user's input for origin/destination can take city names and give suggested airport code responses 
through an autocomplete widget.
- Error handling for valid input can be more robustly handled upfront to avoid the user needing to wait for the API itself
to return an error.

### That's Pretty Much It

*Thanks for stopping by!*