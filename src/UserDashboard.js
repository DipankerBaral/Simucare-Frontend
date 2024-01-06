import React from "react";
import { useNavigate } from "react-router-dom";
import "./userdashboard.css";
import CardComponent from "./CardComponent";

const UserDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="user-dashboard">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="card-container">
        <CardComponent
          title="Add Scenario State"
          body=""
          buttonText="Add Now"
          route="/ScenarioState"
        />
        <CardComponent
          title="Add a Scenario"
          body=""
          buttonText="Add Now"
          route="/Scenario"
        />
        <CardComponent
          title="Handle Monitor"
          body=""
          buttonText="Handle Monitors"
          route="/Monitor"
        />
      </div>
    </div>
  );
};

export default UserDashboard;
