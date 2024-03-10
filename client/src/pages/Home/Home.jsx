import React from "react";
import Question from "../../components/Question/Question";
import SocialCard from "../../components/SocialCard/SocialCard";
import { Link } from "react-router-dom";
import Recommend from "../../components/Recommendtion/recommend";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Question />
      {/* <SocialCard /> */}
      {/* <Discussion /> */}
      <Recommend />
      <Link to="me">profile</Link>
    </div>
  );
};

export default Home;
