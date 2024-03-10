import React from "react";
import "./Question.css";

const Question = () => {
  return (
    <div className="question">
      <div className="question-txt">
        <h3>Container With Most Water</h3>
        <div className="question-tag">
          <p>Greedy</p>
          <p>string</p>
          <p>Greedy</p>
        </div>
      </div>
      <p className="question-level">Easy</p>
      <p className="question-acceptance">69.69%</p>
      <a href="#" className="btn-cta-orange">
        Solve Problem
      </a>
    </div>
  );
};

export default Question;
