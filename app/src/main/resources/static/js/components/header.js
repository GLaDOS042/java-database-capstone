function getAssetPath(path) {
  return window.location.pathname === "/" ? path : `/${path}`;
}

function renderHeader() {
  const headerDiv = document.getElementById("header");
  if (!headerDiv) return;

  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  }

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  let headerContent = `
    <header class="header">
      <a class="logo-link" href="/">
        <img src="${getAssetPath("assets/images/logo/logo.png")}" alt="Clinic Management System Logo" class="logo-img">
        <span class="logo-title">Clinic Management System</span>
      </a>
      <nav>`;

  if (role === "admin") {
    headerContent += `
        <button id="addDocBtn" class="adminBtn" type="button">Add Doctor</button>
        <a href="#" id="logoutLink">Logout</a>`;
  } else if (role === "doctor") {
    headerContent += `
        <button id="doctorHome" class="adminBtn doctorHeader" type="button">Home</button>
        <a href="#" id="logoutLink">Logout</a>`;
  } else if (role === "patient") {
    headerContent += `
        <button id="patientLogin" class="adminBtn" type="button">Login</button>
        <button id="patientSignup" class="adminBtn" type="button">Sign Up</button>`;
  } else if (role === "loggedPatient") {
    headerContent += `
        <button id="patientHome" class="adminBtn" type="button">Home</button>
        <button id="patientAppointments" class="adminBtn" type="button">Appointments</button>
        <a href="#" id="logoutPatientLink">Logout</a>`;
  }

  headerContent += `
      </nav>
    </header>`;

  headerDiv.innerHTML = headerContent;
  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const addDocBtn = document.getElementById("addDocBtn");
  const patientLogin = document.getElementById("patientLogin");
  const patientSignup = document.getElementById("patientSignup");
  const doctorHome = document.getElementById("doctorHome");
  const patientHome = document.getElementById("patientHome");
  const patientAppointments = document.getElementById("patientAppointments");
  const logoutLink = document.getElementById("logoutLink");
  const logoutPatientLink = document.getElementById("logoutPatientLink");

  if (addDocBtn) addDocBtn.addEventListener("click", () => window.openModal && window.openModal("addDoctor"));
  if (patientLogin) patientLogin.addEventListener("click", () => window.openModal && window.openModal("patientLogin"));
  if (patientSignup) patientSignup.addEventListener("click", () => window.openModal && window.openModal("patientSignup"));
  if (doctorHome) doctorHome.addEventListener("click", () => selectRole("doctor"));
  if (patientHome) patientHome.addEventListener("click", () => window.location.href = "/pages/loggedPatientDashboard.html");
  if (patientAppointments) patientAppointments.addEventListener("click", () => window.location.href = "/pages/patientAppointments.html");
  if (logoutLink) logoutLink.addEventListener("click", logout);
  if (logoutPatientLink) logoutPatientLink.addEventListener("click", logoutPatient);
}

function logout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/";
}

function logoutPatient(event) {
  if (event) event.preventDefault();
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");
  window.location.href = "/pages/patientDashboard.html";
}

renderHeader();
