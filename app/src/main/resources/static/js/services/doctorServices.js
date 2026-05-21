import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

function emptyToNull(value) {
  return value && value !== "" ? value : "null";
}

export async function getDoctors() {
  try {
    // Request all doctor records for dashboards that list available doctors.
    const response = await fetch(DOCTOR_API);
    const data = await response.json();
    return response.ok ? data.doctors || [] : [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export async function deleteDoctor(id, token) {
  try {
    // Delete a doctor record with the admin token included in the route.
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: "DELETE"
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || (response.ok ? "Doctor deleted successfully." : "Unable to delete doctor.")
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return { success: false, message: "Unable to delete doctor." };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    // Save a new doctor record using the authenticated admin token.
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || (response.ok ? "Doctor saved successfully." : "Unable to save doctor.")
    };
  } catch (error) {
    console.error("Error saving doctor:", error);
    return { success: false, message: "Unable to save doctor." };
  }
}

export async function filterDoctors(name, time, specialty) {
  try {
    // Route parameters use "null" placeholders when a filter is not set.
    const response = await fetch(`${DOCTOR_API}/filter/${emptyToNull(name)}/${emptyToNull(time)}/${emptyToNull(specialty)}`);
    if (!response.ok) {
      console.error("Failed to filter doctors:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error("Error filtering doctors:", error);
    alert("Something went wrong!");
    return [];
  }
}
