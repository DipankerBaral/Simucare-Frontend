import React, { useState, useEffect } from "react";
import "./Scenario.css";
import { useNavigate } from "react-router-dom";

function ScenarioPage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const [scenarioName, setScenarioName] = useState("");
  const [selectedInitialState, setSelectedInitialState] = useState("");
  const [initialStateValues, setInitialStateValues] = useState({});
  const [scenarioSteps, setScenarioSteps] = useState([]);
  const [stepLabel, setStepLabel] = useState("");
  const [stepTimer, setStepTimer] = useState(0);
  const [initialStateOptions, setInitialStateOptions] = useState([]);
  const [scenarioSubmitted, setScenarioSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Fetch initial state options from the API
    fetch("http://localhost:4000/api/getScenarioState")
      .then((response) => response.json())
      .then((options) => {
        // Extract names from the fetched options
        const names = options.map((option) => option.Name.S);
        setInitialStateOptions(names);
      });
  }, []);

  useEffect(() => {
    // Fetch values for the selected initial state
    if (selectedInitialState) {
      // Assuming you have an API endpoint that fetches values based on the state name
      fetch(
        `http://localhost:4000/api/getStateValues?stateName=${selectedInitialState}`
      )
        .then((response) => response.json())
        .then((values) => {
          console.log("Fetched values:", values); // Debugging line
          setInitialStateValues(values);
        });
    } else {
      setInitialStateValues({});
    }
  }, [selectedInitialState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStep = {
      label: stepLabel,
      timer: stepTimer,
      state: selectedInitialState,
      values: { ...initialStateValues },
    };
    setScenarioSteps([...scenarioSteps, newStep]);
    setStepLabel("");
    setStepTimer(0);
  };
  const handleScenarioSubmit = () => {
    // Create an array to store the DynamoDB formatted steps
    const dynamoDBFormattedSteps = scenarioSteps.map((step, index) => ({
      Name: scenarioName,
      StateName: step.state,
      StepDescription: step.label,
      StepNumber: (index + 1).toString(),
      Timer: step.timer.toString(),
      Values: step.values,
    }));

    // Assuming you have some logic here to submit the scenario
    // ...

    // Set the scenario submitted state and message
    setScenarioSubmitted(true);
    setMessage("Scenario Submitted");

    // Reset the message after 5 seconds
    setTimeout(() => {
      setScenarioSubmitted(false);
      setMessage("");

      // Reload the page after 5 seconds
      window.location.reload();
    }, 2000);
    // Log the data before sending it
    console.log(
      "Data to be sent to addScenarioStep API:",
      dynamoDBFormattedSteps
    );

    // Send each step to your API for adding to DynamoDB
    dynamoDBFormattedSteps.forEach((stepData) => {
      fetch("http://localhost:4000/api/addScenarioStep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stepData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Scenario step data submitted:", data);
          // Optionally, you can reset the form or perform other actions here
        })
        .catch((error) => {
          console.error("Error submitting scenario step data:", error);
        });
    });

    // Optionally, you can reset the form or perform other actions here
  };

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>Create Scenario</h2>
      <form className="user-input-form" onSubmit={handleSubmit}>
        {/* ... (rest of your form code) */}
        <div>
          <label>Scenario Name:</label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Scenario Steps:</label>
          <input
            type="text"
            value={stepLabel}
            onChange={(e) => setStepLabel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Scenario State:</label>
          <select
            value={selectedInitialState}
            onChange={(e) => setSelectedInitialState(e.target.value)}
          >
            <option value="">Select an State</option>
            {initialStateOptions.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Timer (seconds):</label>
          <input
            type="number"
            value={stepTimer}
            onChange={(e) => setStepTimer(parseInt(e.target.value, 10))}
            required
          />
        </div>
        <button type="submit">Add Scenario Step</button>
      </form>
      <div className="display-section">
        <h3>Scenario Steps</h3>
        <ul>
          {scenarioSteps.map((step, index) => (
            <li key={index}>
              {step.label} (Timer: {step.timer}s, State: {step.state}
              <div>
                <strong>Values:</strong>
                <ul>
                  {Object.entries(step.values).map(([key, value]) => (
                    <li key={key}>
                      {key}: {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {scenarioSubmitted && <p>{message}</p>}

      <button className="submit-button" onClick={handleScenarioSubmit}>
        Submit Scenario
      </button>
    </div>
  );
}

export default ScenarioPage;
