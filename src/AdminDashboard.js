import React, { useState, useEffect } from "react";
import "./admindashboard.css";

function AdminDashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your API
    fetch("https://serviceunibackend.onrender.com/api/getdata")
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // Function to sort data in descending order of ID
  const sortDataDescending = () => {
    return [...data].sort((a, b) => {
      const idA = parseInt(a.Id.S, 10);
      const idB = parseInt(b.Id.S, 10);
      return idB - idA;
    });
  };

  const sortedData = sortDataDescending();

  return (
    <div className="AdminDashboard">
      <h1>Anonymous Reporting</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : sortedData.length > 0 ? (
        sortedData.map((item) => (
          <div key={item.Id.S} className="data-item">
            <h2>{item.Subject.S}</h2>
            <p>Location: {item.Location.S}</p>
            <p>Time: {item.Time.S}</p>
            <p>Description: {item.Description.S}</p>
          </div>
        ))
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default AdminDashboard;
