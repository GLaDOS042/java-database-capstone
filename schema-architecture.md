# Architecture Documentation

## Section 1: Architecture Summary

This Spring Boot application follows a layered architecture that separates the user interface, request handling, business logic, and data access code. It uses MVC-style routing for the Admin and Doctor dashboards, which are rendered with Thymeleaf templates. Other parts of the system, such as patient records, appointments, doctors, and prescriptions, are served through REST APIs that are called by the static HTML and JavaScript pages.

The backend controllers receive user actions and pass them into the service layer, where the main application logic is handled. The services validate tokens, check user roles, process appointments, manage patient and doctor data, and coordinate prescription records. The service layer then delegates database work to repositories. MySQL stores relational data such as patients, doctors, appointments, and admins using JPA entity-style models, while MongoDB stores prescription information using a document-style model.

## Section 2: Numbered Flow of Data and Control

1. A user accesses a page such as the Admin Dashboard, Doctor Dashboard, patient pages, appointment pages, or prescription pages.

2. The request is routed either to a Thymeleaf MVC controller for dashboard pages or to a REST controller for API-based features.

3. The controller receives the request data, such as path variables, request bodies, tokens, or form-related information.

4. If the action requires authorization, the controller or shared service logic validates the user's token and checks that the user has the correct role.

5. The controller calls the appropriate service class, where the main business rules are applied, such as checking appointment availability, retrieving patient records, updating appointments, or saving prescriptions.

6. The service layer communicates with the correct repository. MySQL repositories handle admin, doctor, patient, and appointment data, while the MongoDB prescription repository handles prescription documents.

7. The repository returns the result to the service, the service returns it to the controller, and the controller sends the final response back to the user as either a rendered page or a REST API response.
