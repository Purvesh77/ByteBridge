import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="me">profile</Link>
    </div>
  );
};

export default Home;
