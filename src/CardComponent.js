import React from "react";
import "./card.css";
import { Link } from "react-router-dom";

const CardComponent = ({ title, body, buttonText, route }) => (
  <div className="card">
    <div className="card-content">
      <h2 className="card-title">{title}</h2>
      <p className="card-body">{body}</p>
      <Link to={route} className="button">
        {buttonText}
      </Link>
    </div>
  </div>
);

export default CardComponent;