import React, { useState, useEffect } from "react";
import "./monitor.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; // Import Router and Link
import HeartbeatMonitor from "./HeartbeatMonitor"; // Import the HeartbeatMonitor component
import { useNavigate } from "react-router-dom";

function MonitorManagement() {
  const navigate = useNavigate();
  const [updateText, setUpdateText] = useState("");
  const [monitors, setMonitors] = useState([]);
  const [uniqueScenarios, setUniqueScenarios] = useState([]);
  const [displayedUpdateIndex, setDisplayedUpdateIndex] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const [monitorName, setMonitorName] = useState("");
  const [monitorImage, setMonitorImage] = useState("https://shorturl.at/JVZ68");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:4000/api/getRegisterData")
      .then((response) => response.json())
      .then((data) => {
        // Extract usernames from the API response
        const extractedUsernames = data
          .filter(
            (item) => item.Role?.S === "student" || item.Role?.S === "Student"
          )
          .map((item) => item.Username?.S || "");

        // Update the students state with the extracted usernames
        setStudents(extractedUsernames);
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  }, []);
  // Function to send data to the API
  const sendDataToAPI = (data) => {
    console.log("Data to be sent to API:", data); // Log the data before sending
    fetch("http://localhost:4000/api/addMonitorData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .then(() => {
        console.log("Data sent successfully to API:", data); // Log success
      })
      .catch((error) => {
        console.error("Error sending data to the API:", error);
      });
  };

  // Function to add a new monitor
  const addMonitor = () => {
    if (monitorName) {
      const newMonitor = {
        Name: monitorName,
        ScenarioRun: "",
        Student: "",
      };

      console.log("New Monitor Data:", newMonitor); // Log the data before adding
      setMonitors([...monitors, newMonitor]);
      setMonitorName(""); // Clear monitorName after adding
      setMonitorImage("https://shorturl.at/JVZ68");

      // Send data to the API
      sendDataToAPI(newMonitor);
    }
  };

  // Function to update student and scenario for a monitor
  const updateMonitor = (index) => {
    const updatedMonitors = [...monitors];
    updatedMonitors[index].Student = updatedMonitors[index].selectedStudent;
    updatedMonitors[index].ScenarioRun =
      updatedMonitors[index].selectedScenario;

    // Send updated data to the API
    sendDataToAPI(updatedMonitors[index]);

    // Show the update text for 5 seconds
    setUpdateText("Monitor updated");
    setDisplayedUpdateIndex(index); // Set the index of the updated monitor

    setTimeout(() => {
      // Hide the update text after 5 seconds
      setDisplayedUpdateIndex(null);
    }, 5000);
  };
  // Fetch scenarios from the API when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/api/getScenario")
      .then((response) => response.json())
      .then((data) => {
        const scenarioNames = [...new Set(data.map((item) => item.Name.S))];
        setUniqueScenarios(scenarioNames);
      })
      .catch((error) => {
        console.error("Error fetching scenarios:", error);
      });

    // Fetch existing monitor data when the component mounts
    fetch("http://localhost:4000/api/getMonitorData")
      .then((response) => response.json())
      .then((data) => {
        setMonitors(data); // Set the existing monitors data
      })
      .catch((error) => {
        console.error("Error fetching monitor data:", error);
      });
  }, []);

  return (
    <div className="monitor-management">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1>Monitor Management</h1>

      {/* Form to add a new monitor */}
      <h2>Add Monitor</h2>
      <label htmlFor="monitorName">Monitor Name:</label>
      <input
        type="text"
        id="monitorName"
        placeholder="Enter Monitor Name"
        value={monitorName}
        onChange={(e) => setMonitorName(e.target.value)}
        required
      />
      <button onClick={addMonitor}>Add Monitor</button>

      {/* Display added monitors */}
      <h2>Monitors</h2>
      <ul className="monitor-container">
        {monitors.map((monitor, index) => (
          <li key={index}>
            <p>Name: {monitor.Name}</p>
            <Link to={`/HeartbeatMonitor/${monitor.Name}`}>
              <img src={monitorImage} alt="Monitor" width="100" />
            </Link>
            {/* Dropdowns to select student and scenario */}
            <label htmlFor={`student_${index}`}>Assign Student:</label>
            <select
              id={`student_${index}`}
              value={monitor.selectedStudent}
              onChange={(e) => {
                const updatedMonitors = [...monitors];
                updatedMonitors[index].selectedStudent = e.target.value;
                setMonitors(updatedMonitors);
              }}
            >
              <option value="">Select a Student</option>
              {students.map((student, studentIndex) => (
                <option key={studentIndex} value={student}>
                  {student}
                </option>
              ))}
            </select>
            <label htmlFor={`scenario_${index}`}>Assign Scenario:</label>
            <select
              id={`scenario_${index}`}
              value={monitor.selectedScenario}
              onChange={(e) => {
                const updatedMonitors = [...monitors];
                updatedMonitors[index].selectedScenario = e.target.value;
                setMonitors(updatedMonitors);
              }}
            >
              <option value="">Select a Scenario</option>
              {uniqueScenarios.map((scenario, scenarioIndex) => (
                <option key={scenarioIndex} value={scenario}>
                  {scenario}
                </option>
              ))}
            </select>
            <button onClick={() => updateMonitor(index)}>Update Monitor</button>
            {displayedUpdateIndex === index && <p>{updateText}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MonitorManagement;
