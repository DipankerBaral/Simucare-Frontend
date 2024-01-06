import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function HeartbeatMonitor() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const { monitorName } = useParams();
  const [matchingScenarios, setMatchingScenarios] = useState([]);
  const [completedSteps, setCompletedSteps] = useState({});
  const [scenarioRun, setScenarioRun] = useState("");
  const [isSimulationRunning, setSimulationRunning] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [feedback, setFeedback] = useState(() => {
    const storedFeedback = JSON.parse(
      localStorage.getItem(`${monitorName}_feedback`)
    );
    return storedFeedback || {};
  });

  // Initialize checkbox state from local storage or use default values
  const [checkboxState, setCheckboxState] = useState(() => {
    const storedState = JSON.parse(
      localStorage.getItem(`${monitorName}_checkboxState`)
    );
    return storedState || {};
  });
  // Initialize state properties from local storage or use default values
  const [state, setState] = useState(() => {
    const ecgBPM = localStorage.getItem(`${monitorName}_ecgBPM`) || 75;
    const RESPvalue = localStorage.getItem(`${monitorName}_RESPvalue`) || 85;
    const TEMPvalue = localStorage.getItem(`${monitorName}_TEMPvalue`) || 85;
    const SpO2value = localStorage.getItem(`${monitorName}_SpO2value`) || 75;
    const CO2value = localStorage.getItem(`${monitorName}_CO2value`) || 75;
    const IBPvalue =
      localStorage.getItem(`${monitorName}_IBPvalue`) || "120/80";

    return {
      ecgBPM,
      RESPvalue,
      TEMPvalue,
      SpO2value,
      CO2value,
      IBPvalue,
      isEditing: false,
      editableValue: "",
      editableValueName: "",
      isInitial: true,
      currentStep: 1,
    };
  });
  useEffect(() => {
    localStorage.setItem(
      `${monitorName}_checkboxState`,
      JSON.stringify(checkboxState)
    );
  }, [monitorName, checkboxState]);
  useEffect(() => {
    // Get the simulation state from localStorage based on monitorName
    const savedSimulationState = localStorage.getItem(
      `${monitorName}_simulationRunning`
    );
    if (savedSimulationState) {
      setSimulationRunning(savedSimulationState === "true");
    }
  }, [monitorName]);

  // Use useEffect to update local storage whenever state changes
  useEffect(() => {
    localStorage.setItem(`${monitorName}_ecgBPM`, state.ecgBPM);
    localStorage.setItem(`${monitorName}_RESPvalue`, state.RESPvalue);
    localStorage.setItem(`${monitorName}_TEMPvalue`, state.TEMPvalue);
    localStorage.setItem(`${monitorName}_SpO2value`, state.SpO2value);
    localStorage.setItem(`${monitorName}_CO2value`, state.CO2value);
    localStorage.setItem(`${monitorName}_IBPvalue`, state.IBPvalue);
  }, [monitorName, state]);

  const {
    ecgBPM,
    RESPvalue,
    TEMPvalue,
    SpO2value,
    CO2value,
    IBPvalue,
    isEditing,
    editableValue,
    editableValueName,
  } = state;
  const handleDoubleClick = (valueName, initialValue) => {
    setState({
      ...state,
      isEditing: true,
      editableValue: initialValue,
      editableValueName: valueName,
    });
  };

  const handleInputChange = (event) => {
    setState({ ...state, editableValue: event.target.value });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      saveEditedValue();
    }
  };

  const saveEditedValue = () => {
    const { editableValueName, editableValue } = state;

    // Here you can perform any validation or data processing before updating the state
    // For simplicity, we are directly updating the state with the new value

    setState({
      ...state,
      [editableValueName]: editableValue,
      isEditing: false,
      editableValue: "",
      editableValueName: "",
    });
  };
  useEffect(() => {
    fetch("http://localhost:4000/api/getMonitorData")
      .then((response) => response.json())
      .then((data) => {
        const monitorData = data.find(
          (monitor) => monitor.Name === monitorName
        );

        if (monitorData) {
          setScenarioRun(monitorData.ScenarioRun);
          setStudentName(monitorData.Student); // Set the student name
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [monitorName]);

  useEffect(() => {
    fetch("http://localhost:4000/api/getScenario")
      .then((response) => response.json())
      .then((data) => {
        const filteredScenarios = data.filter(
          (scenario) => scenario.Name.S === scenarioRun
        );

        filteredScenarios.sort(
          (a, b) => parseInt(a.StepNumber.S) - parseInt(b.StepNumber.S)
        );

        setMatchingScenarios(filteredScenarios);
      })
      .catch((error) => {
        console.error("Error fetching scenario data:", error);
      });
  }, [scenarioRun]);

  const toggleStepCompletion = (stepNumber) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [stepNumber]: !prevState[stepNumber],
    }));

    // Call the function to update all values based on the selected step
    updateValues(stepNumber);

    const userRole = localStorage.getItem("userRole");

    // Save feedback in local storage based on the user's role
    localStorage.setItem(
      `${userRole}_feedback_${stepNumber}`,
      feedback[stepNumber]
    );
  };

  const updateValues = (stepNumber) => {
    const matchingScenario = matchingScenarios.find(
      (scenario) => scenario.StepNumber.S === stepNumber
    );

    if (matchingScenario) {
      const values = matchingScenario.Values.L;

      // Create an object to store the updated values
      const updatedValues = {};

      for (const value of values) {
        const key = value.M.key.S;
        const newValue = value.M.value.S;

        updatedValues[key] = newValue;
      }

      // Use setTimeout to update all values after the specified timer
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          ...updatedValues,
        }));
      }, parseInt(matchingScenario.Timer.S) * 1000);
    }
  };

  const startEndSimulation = () => {
    if (isSimulationRunning) {
      const userRole = localStorage.getItem("userRole");

      // Clear feedback in local storage for the user's role
      Object.keys(feedback).forEach((stepNumber) => {
        localStorage.removeItem(`${userRole}_feedback_${stepNumber}`);
      });

      // Reset all values to their initial state
      setState({
        ecgBPM: 75,
        RESPvalue: 85,
        TEMPvalue: 85,
        SpO2value: 75,
        CO2value: 75,
        IBPvalue: "120/80",
        isEditing: false,
        editableValue: "",
        editableValueName: "",
        isInitial: true,
        currentStep: 1,
      });
      setCompletedSteps({});
      setFeedback({}); // Reset feedback
    }
    setCheckboxState({});
    setSimulationRunning((prev) => !prev);

    // Store the simulation state in localStorage based on monitorName
    localStorage.setItem(
      `${monitorName}_simulationRunning`,
      !isSimulationRunning
    );
  };

  console.log(monitorName);
  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <header className="header">
          <div className="container">
            <div className="heading">
              <h1> Heartbeat Monitor Animation - {monitorName} </h1>
            </div>
          </div>
        </header>
        <table className="graph-table">
          <tbody>
            <tr>
              <td className="no-bottom-border">
                <section>
                  <button onClick={startEndSimulation}>
                    {isSimulationRunning
                      ? "End Simulation"
                      : "Start Simulation"}
                  </button>
                  <div
                    className="simun"
                    style={{
                      color: "white",
                      marginLeft: "16px",
                      marginTop: "10px",
                    }}
                  >
                    Simulation Name: {scenarioRun} (Student: {studentName})
                    {isSimulationRunning && (
                      <ul style={{ listStyleType: "none" }}>
                        {matchingScenarios.map((scenario) => (
                          <li key={scenario.ID.S}>
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  checkboxState[scenario.StepNumber.S] || false
                                }
                                onChange={() =>
                                  toggleStepCompletion(scenario.StepNumber.S)
                                }
                              />
                              Step {scenario.StepNumber.S}:{" "}
                              {scenario.StepDescription.S}
                              {localStorage.getItem("userRole") === "admin" ||
                              localStorage.getItem("userRole") === "tutor" ? (
                                <input
                                  type="text"
                                  placeholder="Enter feedback"
                                  value={feedback[scenario.StepNumber.S] || ""}
                                  onChange={(e) => {
                                    // Note: Here, you might want to restrict students from modifying feedback.
                                    const updatedFeedback = { ...feedback };
                                    updatedFeedback[scenario.StepNumber.S] =
                                      e.target.value;
                                    setFeedback(updatedFeedback);

                                    // Store the feedback in local storage
                                    localStorage.setItem(
                                      `${monitorName}_feedback`,
                                      JSON.stringify(updatedFeedback)
                                    );
                                  }}
                                />
                              ) : (
                                <div>
                                  Feedback:{" "}
                                  {feedback[scenario.StepNumber.S] ||
                                    "No feedback provided"}
                                </div>
                              )}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </td>
              <td colSpan="2">
                {isEditing && editableValueName === "ecgBPM" ? (
                  <input
                    type="number"
                    value={editableValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={saveEditedValue}
                    autoFocus
                  />
                ) : (
                  <span
                    className="bpm-value"
                    onDoubleClick={() => handleDoubleClick("ecgBPM", ecgBPM)}
                  >
                    BPM: {ecgBPM}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              {/* Repeat for other rows */}
              <td width="80%" className="no-top-border no-bottom-border">
                <section>
                  <div className="iconSVGPulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      viewBox="0 0 5184 3844.17"
                    >
                      {/* SVG path code */}
                    </svg>
                  </div>
                </section>
              </td>
              <td width="10%">
                {isEditing && editableValueName === "RESPvalue" ? (
                  <input
                    type="number"
                    value={editableValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={saveEditedValue}
                    autoFocus
                  />
                ) : (
                  <span
                    className="bpm-value"
                    onDoubleClick={() =>
                      handleDoubleClick("RESPvalue", RESPvalue)
                    }
                  >
                    RESP: {RESPvalue}
                  </span>
                )}
              </td>
              <td width="10%">
                {isEditing && editableValueName === "TEMP" ? (
                  <input
                    type="number"
                    value={editableValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={saveEditedValue}
                    autoFocus
                  />
                ) : (
                  <span
                    className="temp-value"
                    onDoubleClick={() => handleDoubleClick("TEMP", TEMPvalue)}
                  >
                    TEMP: {TEMPvalue}
                  </span>
                )}
              </td>
            </tr>
            {/* Repeat for other rows */}
            <tr>
              <td className="no-top-border no-bottom-border">
                <section>
                  <div className="iconSVGPulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      viewBox="0 0 5184 3844.17"
                    >
                      {/* SVG path code */}
                    </svg>
                  </div>
                </section>
              </td>
              <td className="no-right-border">
                {isEditing && editableValueName === "SpO2" ? (
                  <input
                    type="number"
                    value={editableValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={saveEditedValue}
                    autoFocus
                  />
                ) : (
                  <span
                    className="sp-value"
                    onDoubleClick={() => handleDoubleClick("SpO2", SpO2value)}
                  >
                    SpO2: {SpO2value}
                  </span>
                )}
              </td>

              <td className="no-left-border"></td>
            </tr>
            {/* Repeat for other rows */}
            <tr>
              <td className="no-top-border no-bottom-border">
                <section>
                  <div className="iconSVGPulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      viewBox="0 0 5184 3844.17"
                    >
                      {/* SVG path code */}
                    </svg>
                  </div>
                </section>
              </td>
              <td className="no-right-border">
                {isEditing && editableValueName === "CO2" ? (
                  <input
                    type="number"
                    value={editableValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={saveEditedValue}
                    autoFocus
                  />
                ) : (
                  <span
                    className="c2-value"
                    onDoubleClick={() => handleDoubleClick("CO2", CO2value)}
                  >
                    CO2: {CO2value}
                  </span>
                )}
              </td>

              <td className="no-left-border"></td>
            </tr>
            {/* Repeat for other rows */}
            <tr>
              <td className="no-top-border no-bottom-border">
                <section>
                  <div className="iconSVGPulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      viewBox="0 0 5184 3844.17"
                    >
                      {/* SVG path code */}
                    </svg>
                  </div>
                </section>
              </td>
              <td className="no-right-border">
                {isEditing && editableValueName === "IBP" ? (
                  <input
                    type="number"
                    value={editableValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={saveEditedValue}
                    autoFocus
                  />
                ) : (
                  <span
                    className="ib-value"
                    onDoubleClick={() => handleDoubleClick("IBP", IBPvalue)}
                  >
                    IBP(1,2): {IBPvalue}
                  </span>
                )}
              </td>

              <td className="no-left-border"></td>
            </tr>
            {/* Repeat for other rows */}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default HeartbeatMonitor;
