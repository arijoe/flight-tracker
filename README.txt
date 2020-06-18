For the final project, I've decided to make a flight finder application. I came up with the following plan
for delivering the project, with a stretch goal of hitting step 5 by the first deliverable.

For this plan, I'll be leveraging Java as the language to interact with the API, SpringBoot as the backend application
harness, IntelliJ as my IDE, and will attempt to host the application in Heroku using barebones handwritten
HTML and JavaScript classes without a frontend framework for the UI. The goal will be to provide a remote URL as the
project's final deliverable, at which anyone can enter a few parameters and have some flight information returned to
them.

The reason for this direction is that it combines some technologies I've used before for portions of the project that are
secondary focuses (Heroku for simple hosting,  IntelliJ for usability of an IDE, frontend development stack for UI) while
choosing Java as the main language in which to apply the API as a learning challenge. Thereby accomplishing the meat and
potatoes of the project as an educational exercise, and adding nice-to-have functionality as a way to polish existing strengths.

Plan

1. Find 3rd party API for developers that match spec
2. Test API locally, compile notes
3. Invoke API from Java program
4. Wrap Java program in SpringBoot application
5. Build out user interface in HTML for interactivity
6. Test
——— MVP ———
6. Refactor and harden backend code
7. Host on remote web server
8. Polish the UI, add additional nice-to-have functionality (routing to corporate sites to complete booking of a flight)

**CURRENT STATE**

1. I have decided on using the Skyscanner API at RapidAPI.com for its broad support and popularity.
- https://rapidapi.com/skyscanner/api/skyscanner-flight-search?endpoint=5aa1eab3e4b00687d3574279
2. Initial testing was done using in-browser testing functionality, URL-hacking, and some in-console JavaScript playing.
3. Steps 3 and 4 were combined for practical reasons. SpringBoot makes bootstrapping Java applications painless, and
Spring provides a nice walk-through for setting up a CommandLineRunner to hit an external API.
- https://spring.io/guides/gs/consuming-rest/
5. Step five is still in the proving stages. Currently, someone can run this app locally and hit `localhost:8080` for a
"Hello World" basic html page, and extend the URL as `localhost:8080/api/flights/{origin}/{destination}` to retrieve
 information in an unformatted JSON string for roundtrip flights between the two destinations on 10/1 & 10/3 of this year.

 **P.O.C.**

 To run this application in its current state, unzip this package and run the main class at `FlightSearchApplication.java`.
 Then, alter the origin and destination airport codes at port 8080 (e.g. `localhost:8080/api/flights/ORD/MAD`) to
 receive flight information between the origin and destination cities between 10/1/2020 & 10/3/2020.

 **NEXT STEPS**

 I believe by the definition outlined in the rubric, this would (poorly) satisfy the very basic requirements of the project, so
 I am happy with the current progress. Next would be defining models and making the backend service reliable. Then,
 I intend to make a rough user interface at the current "Hello World" page that will invoke the service which calls the API,
 while in parallel hosting the application in Heroku and setting an automatic deploy pipeline from a git repo to propagate
 any changes to the live application. Finally, I'll make sure the service is able to allow for more more robust parameters
 and handle basic errors. The end goal would be to allow users to pick their origin, destination, one-way/round-trip, and dates,
 then receive information about their query.