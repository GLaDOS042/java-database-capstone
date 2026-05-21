import { createPatientRow } from "./components/patientRows.js";
import { getAllAppointments } from "./services/appointmentRecordService.js";

let tableBody;
let searchBar;
let todayButton;
let datePicker;

let selectedDate = new Date().toISOString().slice(0, 10);
let patientName = "null";
const token = localStorage.getItem("token");

function renderEmptyRow(message, className = "noPatientRecord") {
  if (!tableBody) return;
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="${className}">${message}</td>
    </tr>`;
}

async function loadAppointments() {
  if (!token) {
    renderEmptyRow("Session expired. Please log in again.");
    return;
  }

  try {
    const data = await getAllAppointments(selectedDate, patientName, token);
    const appointments = data.appointments || [];
    tableBody.innerHTML = "";

    if (appointments.length === 0) {
      renderEmptyRow("No Appointments found for today");
      return;
    }

    appointments.forEach((appointment) => {
      const patient = {
        id: appointment.patientId,
        name: appointment.patientName,
        phone: appointment.patientPhone,
        email: appointment.patientEmail
      };
      const row = createPatientRow(patient, appointment.id, appointment.doctorId);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
    renderEmptyRow("Error loading appointments. Try again later.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  tableBody = document.getElementById("patientTableBody");
  searchBar = document.getElementById("searchBar");
  todayButton = document.getElementById("todayButton");
  datePicker = document.getElementById("datePicker");

  searchBar?.addEventListener("input", () => {
    const value = searchBar.value.trim();
    patientName = value.length > 0 ? value : "null";
    loadAppointments();
  });

  todayButton?.addEventListener("click", () => {
    selectedDate = new Date().toISOString().slice(0, 10);
    if (datePicker) datePicker.value = selectedDate;
    loadAppointments();
  });

  datePicker?.addEventListener("change", () => {
    selectedDate = datePicker.value || new Date().toISOString().slice(0, 10);
    loadAppointments();
  });

  if (datePicker) datePicker.value = selectedDate;
  if (typeof renderContent === "function") renderContent();
  loadAppointments();
});
