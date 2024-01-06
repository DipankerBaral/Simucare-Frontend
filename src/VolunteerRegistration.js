import React, { useState } from "react";
import "./VolunteerRegistration.css";
const VolunteerRegistration = () => {
  // Simulated data (you should replace this with data fetched from your database)
  const volunteerActivitiesData = [
    { id: 1, activity: "Activity 1", spotsLeft: 5, enrolled: false },
    { id: 2, activity: "Activity 2", spotsLeft: 10, enrolled: false },
    { id: 3, activity: "Activity 3", spotsLeft: 3, enrolled: false },
  ];

  // State to store the volunteer activities data
  const [volunteerActivities, setVolunteerActivities] = useState(
    volunteerActivitiesData
  );

  const handleEnrollLeave = (id) => {
    setVolunteerActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              enrolled: !activity.enrolled,
              spotsLeft: activity.enrolled
                ? activity.spotsLeft + 1
                : activity.spotsLeft - 1,
            }
          : activity
      )
    );
  };

  return (
    <div>
      <h2>Volunteer Registration</h2>
      <table>
        <thead>
          <tr>
            <th>Volunteer Activities</th>
            <th>Spots Left</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {volunteerActivities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.activity}</td>
              <td>{activity.spotsLeft}</td>
              <td>
                <button
                  onClick={() => handleEnrollLeave(activity.id)}
                  disabled={activity.spotsLeft === 0}
                >
                  {activity.enrolled ? "Leave" : "Enroll"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerRegistration;
