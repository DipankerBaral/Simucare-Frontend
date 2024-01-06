import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Import the CSS for styling

const backgroundImageUrl =
  "https://png.pngtree.com/background/20210711/original/pngtree-nurse-s-day-blue-cartoon-medical-doctor-banner-picture-image_1129257.jpg"; // Replace with your desired background image URL

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    role: "student", // Default role
    password: "",
    email: "",
  });
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const roles = ["student", "tutor"]; // Define the available roles

  const errors = {
    uname: "Invalid username",
    pass: "Invalid password",
    email: "Invalid email",
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Extract data from the formData state
    const { email, username, role, password } = formData;

    // Create a request body in the format expected by DynamoDB
    const requestBody = {
      Email: { S: email },
      Username: { S: username },
      Role: { S: role },
      Password: { S: password },
    };

    // Make a POST request to your API
    fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.status === 201) {
          // Registration successful, you can add code for handling success here
          navigate("/login"); // Redirect to login page on success
        } else {
          // Registration failed, handle error cases here
          // You can set error messages in the state or display an error message to the user
        }
      })
      .catch((error) => {
        console.error("Error registering:", error);
        // Handle error cases here, e.g., displaying an error message to the user
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to navigate to the login page
  const handleLogin = () => {
    navigate("/");
  };

  // JSX code for registration form with CSS styling and background image
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
        position: "relative", // Make the button positioning relative to the div
      }}
    >
      <button className="register-button" onClick={handleLogin}>
        Login
      </button>
      <div className="login-form">
        <h2>Welcome to Simucare</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="button-container">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
