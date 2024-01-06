import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
const backgroundImageUrl =
  "https://png.pngtree.com/background/20210711/original/pngtree-nurse-s-day-blue-cartoon-medical-doctor-banner-picture-image_1129257.jpg"; // Replace with the actual online URL to your background image

const Login = () => {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // Store the logged-in user
  const navigate = useNavigate();
  let matchingStudent = null;
  // User Login info
  const database = []; // Initialize an empty array

  // Make an HTTP request to the API
  fetch("http://localhost:4000/api/getRegisterData")
    .then((response) => response.json())
    .then((data) => {
      // Assuming the API response is an array of objects with properties like "Username," "Password," and "Role"
      data.forEach((item) => {
        // Check if the properties exist before accessing them
        const username = item.Username?.S || "";
        const password = item.Password?.S || "";
        const role = item.Role?.S || "";

        const user = {
          username,
          password,
          role,
        };
        database.push(user); // Add the user to the database array
      });

      // Now your "database" array is populated with data from the API
      console.log(database);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const errors = {
    uname: "Invalid username",
    pass: "Invalid password",
  };

  useEffect(() => {
    // Check if a user is already logged in from localStorage
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Remove the user information from localStorage and reset the state
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole"); // Remove user role from localStorage
    setLoggedInUser(null);
    setIsSubmitted(false);
  };

  const handleRegister = () => {
    // Navigate to the registration page
    navigate("/register"); // Replace "/register" with the desired route path for registration
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { uname, pass } = event.target.elements;

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        // Store user information in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        localStorage.setItem("userRole", userData.role); // Store user role in localStorage

        setLoggedInUser(userData);
        setIsSubmitted(true);
        if (userData.role === "admin") {
          // Navigate to AdminDashboard.js
          navigate("/userdashboard"); // Replace with the desired route path for the admin
        } else if (userData.role === "student") {
          // Fetch student data from your API
          const response = await fetch(
            "http://localhost:4000/api/getMonitorData"
          );
          const studentData = await response.json();

          // Find a matching student based on the username
          const matchingStudent = studentData.find(
            (student) => student.Student === uname.value
          );

          if (matchingStudent) {
            navigate(`/HeartbeatMonitor/${matchingStudent.Name}`);
          }
        } else if (userData.role === "tutor") {
          // Navigate to the Monitor route for tutors
          navigate("/Monitor"); // Replace with the desired route path for tutors
        }
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };
  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" className="submit-button" value="Submit" />
        </div>
      </form>
      <button onClick={handleRegister} className="register-button">
        Register
      </button>
    </div>
  );

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover", // Adjust the background size as needed
        minHeight: "100vh", // Ensure the div takes the full viewport height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px", // Add padding to create space below the top of the screen
      }}
    >
      <div className="welcome-message" style={{ marginTop: "20px" }}>
        <h1>Welcome to Simucare</h1>
      </div>
      <div className="login-form">
        <div className="title">Sign In</div>
        {loggedInUser ? (
          <div>
            <p>User is successfully logged in as {loggedInUser.username}</p>

            {loggedInUser.role === "student" && matchingStudent === null && (
              <p>
                If you are a student and no device is assigned. Please Logout
              </p>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>{renderForm}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
