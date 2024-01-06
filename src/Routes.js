import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Login from "./login";
import AnonymousReporting from "./AnonymousReporting";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import ScenarioStateForm from "./ScenarioState";
import ScenarioPage from "./Scenario";
import MonitorManagement from "./Monitor";
import HeartbeatMonitor from "./HeartbeatMonitor";
import VolunteerRegistration from "./VolunteerRegistration";
import Register from "./regitser";

const Routing = () => {
  // Your authentication logic to check if the user is logged in
  const isAuthenticated = true; // Replace this with your authentication check

  return (
    <Router>
      <Routes>
        {/* Public Route: Login page (accessible to everyone) */}
        <Route path="/" element={<Login />} />
        <Route path="/anonymousreporting" element={<AnonymousReporting />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route
          path="/VolunteerRegistration"
          element={<VolunteerRegistration />}
        />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ScenarioState" element={<ScenarioStateForm />} />
        <Route path="/Scenario" element={<ScenarioPage />} />
        <Route path="/Monitor" element={<MonitorManagement />} />
        <Route
          path="/HeartbeatMonitor/:monitorName"
          element={<HeartbeatMonitor />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Private Routes: Only accessible to authenticated users */}
      </Routes>
    </Router>
  );
};

export default Routing;
