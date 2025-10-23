let isLogin = true;

function toggleForm() {
  const title = document.getElementById("formTitle");
  const toggleText = document.getElementById("toggleText");
  const button = document.querySelector("button");

  isLogin = !isLogin;

  if (isLogin) {
    title.textContent = "Login";
    button.textContent = "Login";
    toggleText.innerHTML = `Don't have an account? <a href="#" onclick="toggleForm()">Sign up</a>`;
  } else {
    title.textContent = "Sign Up";
    button.textContent = "Sign Up";
    toggleText.innerHTML = `Already have an account? <a href="#" onclick="toggleForm()">Login</a>`;
  }
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  if (isLogin) {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find(u => u.email === email && u.password === password);

    if (user) {
      alert("Login successful!");
      if (user.role === "doctor") {
        window.location.href = "doctor.html";
      } else {
        window.location.href = "patient.html";
      }
    } else {
      alert("Invalid credentials!");
    }
  } else {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Default: first signup = doctor, others = patient (for demo)
    const role = storedUsers.length === 0 ? "doctor" : "patient";

    storedUsers.push({ email, password, role });
    localStorage.setItem("users", JSON.stringify(storedUsers));
    alert("Signup successful! You can now login.");
    toggleForm();
  }
}
// ---------------- DOCTOR DASHBOARD ----------------

function displayDoctorAppointments() {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const list = document.getElementById("doctorAppointments");
  if (!list) return; // Run only on doctor page

  list.innerHTML = "";

  if (appointments.length === 0) {
    list.innerHTML = "<p>No appointments found.</p>";
    return;
  }

  appointments.forEach(app => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>👤 ${app.patient} — ${app.doctor}<br>
      📅 ${app.date} | ⏰ ${app.time}</span>
      <button class="cancel-btn" onclick="removeAppointment(${app.id})">Remove</button>
    `;
    list.appendChild(li);
  });
}

function removeAppointment(id) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments = appointments.filter(a => a.id !== id);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  alert("Appointment removed!");
  displayDoctorAppointments();
}
window.onload = function() {
  const path = window.location.pathname;

  // Get all users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  // Get current user from localStorage
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If no current user, set the last signed-up user as current (for demo)
  if (!currentUser && users.length > 0) {
    currentUser = users[users.length - 1];
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  // Patient Dashboard
  if (path.includes("patient.html")) {
    if (!currentUser || currentUser.role !== "patient") {
      alert("You must login as a patient to access this page.");
      window.location.href = "index.html";
    } else {
      displayAppointments();
    }
  }

  // Doctor Dashboard
  else if (path.includes("doctor.html")) {
    if (!currentUser || currentUser.role !== "doctor") {
      alert("You must login as a doctor to access this page.");
      window.location.href = "index.html";
    } else {
      displayDoctorAppointments();
    }
  }
};
