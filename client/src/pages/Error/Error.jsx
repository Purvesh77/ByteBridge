import React from "react";
import { useNavigate } from "react-router-dom";
import error from "../../assets/error.png";
import "./Error.css";

const Error = () => {
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="error">
      <h1>Error 404 page not found</h1>
      <div className="btn-cta-orange" onClick={back}>
        Go Back
      </div>
      <img src={error} alt="error 404" />
    </div>
  );
};

export default Error;
