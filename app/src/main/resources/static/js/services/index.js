import { API_BASE_URL } from "../config/config.js";
import { openModal } from "../components/modals.js";

const ADMIN_API = API_BASE_URL + "/admin";
const DOCTOR_API = API_BASE_URL + "/doctor/login";

window.openModal = openModal;

window.onload = function () {
  const adminLogin = document.getElementById("adminLogin");
  const doctorLogin = document.getElementById("doctorLogin");

  if (adminLogin) {
    adminLogin.addEventListener("click", () => openModal("adminLogin"));
  }

  if (doctorLogin) {
    doctorLogin.addEventListener("click", () => openModal("doctorLogin"));
  }
};

window.adminLoginHandler = async function adminLoginHandler() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const admin = { username, password };

  try {
    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(admin)
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      selectRole("admin");
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    console.error("Admin login failed:", error);
    alert("Unable to log in as admin.");
  }
};

window.doctorLoginHandler = async function doctorLoginHandler() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const doctor = { email, password };

  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      selectRole("doctor");
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    console.error("Doctor login failed:", error);
    alert("Unable to log in as doctor.");
  }
};
