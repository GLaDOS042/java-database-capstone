import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + "/patient";

export async function patientSignup(data) {
  try {
    // Create a patient account from the signup form details.
    const response = await fetch(PATIENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error :: patientSignup :: ", error);
    return { success: false, message: error.message || "Unable to sign up patient." };
  }
}

export async function patientLogin(data) {
  try {
    // Authenticate a patient and return the raw response for token handling.
    return await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Error :: patientLogin :: ", error);
    return new Response(null, { status: 500, statusText: "Patient login failed" });
  }
}

export async function getPatientData(token) {
  try {
    // Load the logged-in patient's details for profile and booking flows.
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();
    if (response.ok) return data.patient;
    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

export async function getPatientAppointments(id, token, user) {
  try {
    // Fetch appointments using the shared patient/doctor dashboard endpoint.
    const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
    const data = await response.json();
    if (response.ok) {
      return data.appointments;
    }
    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    // Fetch appointments that match the current status/search filters.
    const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.appointments || [];
    } else {
      console.error("Failed to fetch appointments:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
    return [];
  }
}
