import React, { useState, useEffect } from "react";
import "./AnonymousReporting.css";

const AnonymousReporting = () => {
  const [latestId, setLatestId] = useState(0); // Initialize latestId as 0
  const [formData, setFormData] = useState({
    Id: null,
    Time: "",
    Description: "",
    Subject: "",
    Location: "",
  });
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);

  useEffect(() => {
    // Fetch the latest ID from the server
    fetch("https://serviceunibackend.onrender.com/api/getLatestId")
      .then((response) => response.json())
      .then((data) => {
        setLatestId(data.latestId);
      })
      .catch((error) => {
        console.error("Error fetching latest ID:", error);
        // Handle error appropriatelya
      });
  }, []); // This useEffect runs only once on component mount

  useEffect(() => {
    // Update the formData Id field when latestId changes
    setFormData({
      ...formData,
      Id: (latestId + 1).toString(),
    });
  }, [latestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/createData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSubmissionMessage(true);
        // Hide the submission message after 5 seconds
        setTimeout(() => {
          setShowSubmissionMessage(false);
          // Refresh the page after hiding the message
          window.location.reload();
        }, 5000);
      } else {
        console.error("Error creating data");
        // Handle error, show an error message, or perform other actions as needed.
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors.
    }
  };

  return (
    <div className="anonymous-reporting">
      <div className="title">Anonymous Reporting of Security Concern</div>
      <form onSubmit={handleSubmit}>
        {showSubmissionMessage && (
          <div className="submission-message">
            Form submitted successfully. This page will refresh in 5 seconds.
          </div>
        )}
        <div className="form-group">
          <label htmlFor="Subject">Subject:</label>
          <input
            className="ainput"
            type="text"
            id="Subject"
            name="Subject"
            value={formData.Subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Time">Time:</label>
          <input
            className="ainput"
            type="text"
            id="Time"
            name="Time"
            value={formData.Time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Location">Location:</label>
          <input
            className="ainput"
            type="text"
            id="Location"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Description">Description:</label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AnonymousReporting;
