import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";

function formatSpecialty(doctor) {
  return doctor.specialty || doctor.specialization || "General";
}

function formatAvailability(doctor) {
  const times = doctor.availableTimes || doctor.availability || [];
  return Array.isArray(times) && times.length > 0 ? times.join(", ") : "No availability listed";
}

function createInfoRow(label, value) {
  const row = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  row.appendChild(strong);
  row.append(document.createTextNode(value));
  return row;
}

export function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  const role = localStorage.getItem("userRole");

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name;

  const specialization = createInfoRow("Specialty", formatSpecialty(doctor));
  const email = createInfoRow("Email", doctor.email || "Not available");
  const availability = createInfoRow("Availability", formatAvailability(doctor));

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.addEventListener("click", async () => {
      const confirmed = confirm(`Delete ${doctor.name}?`);
      if (!confirmed) return;

      const token = localStorage.getItem("token");
      const result = await deleteDoctor(doctor.id, token);
      alert(result.message);
      if (result.success) card.remove();
    });
    actionsDiv.appendChild(removeBtn);
  } else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.addEventListener("click", () => {
      alert("Patient needs to login first.");
    });
    actionsDiv.appendChild(bookNow);
  } else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.addEventListener("click", async (event) => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in before booking an appointment.");
        localStorage.setItem("userRole", "patient");
        window.location.href = "/pages/patientDashboard.html";
        return;
      }

      const patientData = await getPatientData(token);
      if (!patientData) {
        alert("Unable to load patient details. Please log in again.");
        return;
      }

      const { showBookingOverlay } = await import("../loggedPatient.js");
      showBookingOverlay(event, doctor, patientData);
    });
    actionsDiv.appendChild(bookNow);
  }

  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);
  return card;
}
