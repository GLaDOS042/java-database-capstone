import { openModal } from "./components/modals.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { filterDoctors, getDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

window.openModal = openModal;

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  document.getElementById("patientSignup")?.addEventListener("click", () => openModal("patientSignup"));
  document.getElementById("patientLogin")?.addEventListener("click", () => openModal("patientLogin"));
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

window.signupPatient = async function signupPatient() {
  try {
    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim()
    };

    const { success, message } = await patientSignup(data);
    alert(message);

    if (success) {
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("An error occurred while signing up.");
  }
};

window.loginPatient = async function loginPatient() {
  try {
    const data = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };

    const response = await patientLogin(data);
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      selectRole("loggedPatient");
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    console.error("Patient login failed:", error);
    alert("Failed to login.");
  }
};
