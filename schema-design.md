# Smart Clinic Management System Schema Design

This document outlines the planned database structure for the Smart Clinic Management System. MySQL will store the core structured data that needs strong relationships and validation. MongoDB will store flexible medical documents that may change over time, such as prescription notes and metadata.

## MySQL Database Design

MySQL is a good fit for operational clinic records because patients, doctors, admins, appointments, schedules, and payments have clear relationships. These records should be validated, searchable, and consistent.

### Table: patients

- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), Not Null
- last_name: VARCHAR(50), Not Null
- email: VARCHAR(100), Unique, Not Null
- phone: VARCHAR(20), Not Null
- date_of_birth: DATE, Not Null
- gender: VARCHAR(20)
- address: VARCHAR(255)
- emergency_contact_name: VARCHAR(100)
- emergency_contact_phone: VARCHAR(20)
- created_at: DATETIME, Not Null
- updated_at: DATETIME

Comments:
- Email should be unique so each patient account can be identified clearly.
- Email and phone formats should be validated in application code before saving.
- Patient records should generally be retained for medical history. If a patient account is deactivated later, a status column could be added instead of deleting the row.

### Table: doctors

- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), Not Null
- last_name: VARCHAR(50), Not Null
- email: VARCHAR(100), Unique, Not Null
- phone: VARCHAR(20), Not Null
- specialization: VARCHAR(100), Not Null
- license_number: VARCHAR(50), Unique, Not Null
- years_of_experience: INT
- clinic_location_id: INT, Foreign Key -> clinic_locations(id)
- active: BOOLEAN, Not Null
- created_at: DATETIME, Not Null
- updated_at: DATETIME

Comments:
- A doctor can be linked to a clinic location.
- A license number should be unique because it identifies the doctor professionally.
- The active field allows the system to hide inactive doctors without deleting historical records.

### Table: admin

- id: INT, Primary Key, Auto Increment
- username: VARCHAR(50), Unique, Not Null
- email: VARCHAR(100), Unique, Not Null
- password_hash: VARCHAR(255), Not Null
- role: VARCHAR(30), Not Null
- active: BOOLEAN, Not Null
- created_at: DATETIME, Not Null
- updated_at: DATETIME

Comments:
- Admin users manage clinic records, doctors, appointments, and system settings.
- Passwords should never be stored as plain text. Only hashed passwords should be saved.
- The role field can support future roles such as SUPER_ADMIN, BILLING_ADMIN, or CLINIC_MANAGER.

### Table: clinic_locations

- id: INT, Primary Key, Auto Increment
- name: VARCHAR(100), Not Null
- address: VARCHAR(255), Not Null
- phone: VARCHAR(20), Not Null
- email: VARCHAR(100)
- opening_time: TIME, Not Null
- closing_time: TIME, Not Null
- active: BOOLEAN, Not Null

Comments:
- This table allows the clinic system to support one or more physical locations.
- Doctors and appointments can be connected to a location so patients know where to go.

### Table: appointments

- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key -> doctors(id), Not Null
- patient_id: INT, Foreign Key -> patients(id), Not Null
- clinic_location_id: INT, Foreign Key -> clinic_locations(id), Not Null
- appointment_time: DATETIME, Not Null
- duration_minutes: INT, Not Null
- reason_for_visit: VARCHAR(255)
- status: INT, Not Null (0 = Scheduled, 1 = Completed, 2 = Cancelled, 3 = No Show)
- created_at: DATETIME, Not Null
- updated_at: DATETIME

Comments:
- If a patient is deleted, appointments should not be automatically deleted because appointment history may be needed for medical and reporting purposes.
- A doctor should not be allowed to have overlapping active appointments. This can be checked in service logic before creating or updating an appointment.
- Prescriptions can reference appointment IDs so medication history is tied to a specific visit.

### Table: doctor_availability

- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key -> doctors(id), Not Null
- day_of_week: VARCHAR(10), Not Null
- start_time: TIME, Not Null
- end_time: TIME, Not Null
- clinic_location_id: INT, Foreign Key -> clinic_locations(id), Not Null
- active: BOOLEAN, Not Null

Comments:
- This table stores recurring doctor working hours.
- Appointment scheduling should check this table before allowing a booking.
- Additional unavailable dates, holidays, or leave records could be added later in a separate table.

### Table: payments

- id: INT, Primary Key, Auto Increment
- appointment_id: INT, Foreign Key -> appointments(id), Not Null
- patient_id: INT, Foreign Key -> patients(id), Not Null
- amount: DECIMAL(10,2), Not Null
- payment_method: VARCHAR(30), Not Null
- status: INT, Not Null (0 = Pending, 1 = Paid, 2 = Failed, 3 = Refunded)
- transaction_reference: VARCHAR(100), Unique
- paid_at: DATETIME
- created_at: DATETIME, Not Null

Comments:
- Payments are structured financial records, so they belong in MySQL.
- The appointment_id connects the payment to the visit being paid for.
- The transaction reference should be unique when supplied by a payment provider.

### Relationship Summary

- One patient can have many appointments.
- One doctor can have many appointments.
- One clinic location can have many doctors and appointments.
- One doctor can have many availability records.
- One appointment can have one or more related payment records if partial or retry payments are supported.
- MongoDB prescription documents can reference appointment, patient, and doctor IDs from MySQL.

## MongoDB Collection Design

MongoDB is useful for flexible medical data that may include free-form notes, medication instructions, optional metadata, attachments, and future fields that are not known yet. Prescription documents can reference MySQL IDs instead of embedding full patient or doctor records. This avoids duplicating structured data while still allowing rich prescription details.

### Collection: prescriptions

```json
{
  "_id": "ObjectId('64abc1234567890abcdef1234')",
  "appointmentId": 51,
  "patientId": 12,
  "doctorId": 7,
  "createdAt": "2026-05-22T09:30:00Z",
  "status": "active",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Every 6 hours",
      "duration": "5 days",
      "instructions": "Take after meals"
    },
    {
      "name": "Cetirizine",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "7 days",
      "instructions": "Take before bedtime"
    }
  ],
  "doctorNotes": "Patient reported mild fever and seasonal allergy symptoms. Return if symptoms worsen after 3 days.",
  "pharmacy": {
    "name": "Downtown Health Pharmacy",
    "phone": "555-0134",
    "address": "100 Market Street"
  },
  "refills": {
    "allowed": true,
    "count": 1,
    "expiresAt": "2026-06-22T00:00:00Z"
  },
  "attachments": [
    {
      "fileName": "lab-result.pdf",
      "fileType": "application/pdf",
      "url": "https://clinic.example.com/files/lab-result.pdf",
      "uploadedAt": "2026-05-22T09:20:00Z"
    }
  ],
  "tags": ["fever", "allergy", "follow-up"],
  "metadata": {
    "source": "doctor-dashboard",
    "version": 1,
    "lastUpdatedByAdminId": null
  }
}
```

Comments:
- The document stores patientId, doctorId, and appointmentId instead of full embedded patient or doctor objects.
- Medication details are stored as an array because one prescription can include multiple medicines.
- Doctor notes are free-form and can grow or change without requiring a table migration.
- Attachments and metadata can evolve over time, which makes them a good fit for MongoDB.

### Possible Future Collection: messages

If the system later supports chat between doctors and patients, MongoDB could store message documents:

```json
{
  "_id": "ObjectId('64abc1234567890abcdef5678')",
  "appointmentId": 51,
  "participants": [
    { "type": "patient", "id": 12 },
    { "type": "doctor", "id": 7 }
  ],
  "messages": [
    {
      "senderType": "patient",
      "senderId": 12,
      "message": "Should I take the medicine with food?",
      "sentAt": "2026-05-22T11:15:00Z"
    },
    {
      "senderType": "doctor",
      "senderId": 7,
      "message": "Yes, take it after meals to reduce stomach irritation.",
      "sentAt": "2026-05-22T11:23:00Z"
    }
  ],
  "status": "open"
}
```

This design supports schema evolution because new fields can be added to MongoDB documents without changing existing MySQL tables.
