# User Story Template

**Title:**
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]
**Story Points:** [Estimated Effort in Points]
**Notes:**
- [Additional information or edge cases]

## Admin User Stories

### Admin Login

**Title:**
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. The admin can enter a valid username and password on the login page.
2. The system verifies the admin credentials before granting access.
3. The admin is redirected to the admin dashboard after a successful login.

**Priority:** High
**Story Points:** 3
**Notes:**
- Invalid credentials should show an error message and prevent access.

### Admin Logout

**Title:**
_As an admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**
1. The admin can select a logout option from the portal.
2. The system ends the admin session or invalidates the current token.
3. The admin is redirected away from protected dashboard pages after logging out.

**Priority:** High
**Story Points:** 2
**Notes:**
- Protected pages should not remain accessible after logout.

### Add Doctor

**Title:**
_As an admin, I want to add doctors to the portal, so that patients can find and book appointments with them._

**Acceptance Criteria:**
1. The admin can enter required doctor information such as name, specialization, and contact details.
2. The system validates the doctor information before saving it.
3. The new doctor appears in the doctor list after being added.

**Priority:** High
**Story Points:** 5
**Notes:**
- Duplicate or incomplete doctor records should be handled with validation messages.

### Delete Doctor Profile

**Title:**
_As an admin, I want to delete a doctor's profile from the portal, so that outdated or unavailable doctor records are removed._

**Acceptance Criteria:**
1. The admin can select a doctor profile to delete.
2. The system asks for confirmation before deleting the profile.
3. The deleted doctor no longer appears in the portal's doctor list.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Deleting a doctor should consider existing appointments connected to that doctor.

### Monthly Appointment Statistics

**Title:**
_As an admin, I want to run a stored procedure in the MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. The stored procedure can be executed from the MySQL CLI.
2. The procedure returns appointment counts grouped by month.
3. The result can be used by the admin to review system usage trends.

**Priority:** Medium
**Story Points:** 5
**Notes:**
- The procedure should return accurate results even for months with no or low appointment activity.

## Patient User Stories

### View Doctors Without Login

**Title:**
_As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. The doctor list is visible to visitors who are not logged in.
2. Each doctor entry shows useful details such as name and specialization.
3. Visitors can review doctors without being redirected to a login page.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Booking actions should still require authentication.

### Patient Sign Up

**Title:**
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. The patient can enter registration details including email and password.
2. The system validates required fields and prevents duplicate accounts.
3. The patient account is created successfully when valid information is submitted.

**Priority:** High
**Story Points:** 5
**Notes:**
- Passwords should be handled securely.

### Patient Login

**Title:**
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. The patient can enter valid login credentials.
2. The system verifies the credentials before granting access.
3. The patient can access appointment management features after logging in.

**Priority:** High
**Story Points:** 3
**Notes:**
- Invalid credentials should return a clear error message.

### Patient Logout

**Title:**
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. The patient can choose a logout option.
2. The system ends the current login session or token.
3. The patient cannot access protected appointment pages after logging out.

**Priority:** High
**Story Points:** 2
**Notes:**
- The user should be returned to a public page after logout.

### Book One-Hour Appointment

**Title:**
_As a patient, I want to log in and book an hour-long appointment, so that I can consult with a doctor._

**Acceptance Criteria:**
1. The patient must be logged in before booking an appointment.
2. The patient can choose an available doctor, date, and one-hour time slot.
3. The system saves the appointment and prevents double-booking for the same slot.

**Priority:** High
**Story Points:** 5
**Notes:**
- Appointment conflicts should show a helpful error message.

### View Upcoming Appointments

**Title:**
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. The patient can open a page showing their scheduled future appointments.
2. Each appointment shows relevant details such as doctor, date, time, and status.
3. Only appointments belonging to the logged-in patient are displayed.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Past appointments should be separated or excluded from the upcoming appointment view.

## Doctor User Stories

### Doctor Login

**Title:**
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. The doctor can enter valid login credentials.
2. The system verifies the doctor account before granting dashboard access.
3. The doctor is redirected to the doctor dashboard after a successful login.

**Priority:** High
**Story Points:** 3
**Notes:**
- Unauthorized users should not be able to access doctor dashboard pages.

### Doctor Logout

**Title:**
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. The doctor can select a logout option from the portal.
2. The system ends the doctor's session or invalidates the token.
3. The doctor is redirected away from protected pages after logout.

**Priority:** High
**Story Points:** 2
**Notes:**
- The doctor dashboard should require a valid login after logout.

### View Appointment Calendar

**Title:**
_As a doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**
1. The doctor can view scheduled appointments by date.
2. Appointment entries show patient and time information.
3. The calendar only displays appointments assigned to the logged-in doctor.

**Priority:** High
**Story Points:** 5
**Notes:**
- Calendar filtering should help doctors find appointments quickly.

### Mark Unavailability

**Title:**
_As a doctor, I want to mark my unavailability, so that patients only see available appointment slots._

**Acceptance Criteria:**
1. The doctor can mark specific dates or time slots as unavailable.
2. Unavailable slots are not offered to patients during booking.
3. The doctor can review their unavailable times after saving changes.

**Priority:** Medium
**Story Points:** 5
**Notes:**
- Existing appointments should not be accidentally overwritten when availability changes.

### Update Doctor Profile

**Title:**
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. The doctor can edit profile fields such as specialization and contact details.
2. The system validates the updated information before saving.
3. Patients can see the updated doctor profile information after changes are saved.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Required profile fields should not be left blank.

### View Patient Details

**Title:**
_As a doctor, I want to view the patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**
1. The doctor can open details for patients connected to upcoming appointments.
2. The system shows relevant patient information needed for the appointment.
3. The doctor can only view patient details for appointments assigned to them.

**Priority:** High
**Story Points:** 5
**Notes:**
- Patient information should be protected from unauthorized access.
