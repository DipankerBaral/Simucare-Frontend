import React, { useState } from "react";
import "./scenariostate.css";
import { useNavigate } from "react-router-dom";

function ScenarioStateForm() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const [formData, setFormData] = useState({
    Name: "",
    ecgBPM: "",
    RESPvalue: "",
    TEMPvalue: "",
    SpO2value: "",
    CO2value: "",
    IBPvalue: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    const formDataAsString = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, String(value)])
    );

    try {
      const response = await fetch(
        "http://localhost:4000/api/addScenarioState",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataAsString),
        }
      );

      if (response.ok) {
        console.log("Data successfully submitted");
        setSuccessMessage("Data successfully submitted");
        // Reset the form after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setFormData({
            Name: "",
            ecgBPM: "",
            RESPvalue: "",
            TEMPvalue: "",
            SpO2value: "",
            CO2value: "",
            IBPvalue: "",
          });
        }, 2000);
      } else {
        console.error("Error:", response.status);
        // Handle error, show an error message, or perform other actions as needed.
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors.
    }
  };

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>Scenario State Form</h2>
      <form
        className="formu"
        onSubmit={handleSubmit}
        style={{ margin: "auto", textAlign: "center" }}
      >
        {successMessage && <p>{successMessage}</p>}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ECG BPM:</label>
          <input
            type="text"
            name="ecgBPM"
            value={formData.ecgBPM}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>RESP Value:</label>
          <input
            type="text"
            name="RESPvalue"
            value={formData.RESPvalue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>TEMP Value:</label>
          <input
            type="text"
            name="TEMPvalue"
            value={formData.TEMPvalue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>SpO2 Value:</label>
          <input
            type="text"
            name="SpO2value"
            value={formData.SpO2value}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>CO2 Value:</label>
          <input
            type="text"
            name="CO2value"
            value={formData.CO2value}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>IBP Value:</label>
          <input
            type="text"
            name="IBPvalue"
            value={formData.IBPvalue}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default ScenarioStateForm;
