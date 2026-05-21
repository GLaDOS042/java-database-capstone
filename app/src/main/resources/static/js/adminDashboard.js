import { openModal } from "./components/modals.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { filterDoctors, getDoctors, saveDoctor } from "./services/doctorServices.js";

window.openModal = openModal;

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);
});

async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
  }
}

async function filterDoctorsOnChange() {
  const searchBar = document.getElementById("searchBar").value.trim();
  const filterTime = document.getElementById("filterTime").value;
  const filterSpecialty = document.getElementById("filterSpecialty").value;

  const name = searchBar.length > 0 ? searchBar : null;
  const time = filterTime.length > 0 ? filterTime : null;
  const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = response.doctors || [];
    renderDoctorCards(doctors);

    if (doctors.length === 0) {
      document.getElementById("content").innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("An error occurred while filtering doctors.");
  }
}

function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;

  contentDiv.innerHTML = "";
  doctors.forEach((doctor) => {
    contentDiv.appendChild(createDoctorCard(doctor));
  });
}

window.adminAddDoctor = async function adminAddDoctor() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/";
    return;
  }

  const availableTimes = Array.from(document.querySelectorAll("input[name='availability']:checked"))
    .map((input) => input.value);

  const doctor = {
    name: document.getElementById("doctorName").value.trim(),
    specialty: document.getElementById("specialization").value,
    specialization: document.getElementById("specialization").value,
    email: document.getElementById("doctorEmail").value.trim(),
    password: document.getElementById("doctorPassword").value,
    phone: document.getElementById("doctorPhone").value.trim(),
    availableTimes
  };

  const result = await saveDoctor(doctor, token);
  alert(result.message);

  if (result.success) {
    document.getElementById("modal").style.display = "none";
    loadDoctorCards();
  }
};
