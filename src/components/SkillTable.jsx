import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Badge from "../images/Badge.png";

const SkillTable = ({ skills, handleUpdate }) => {
  // eslint-disable-next-line no-unused-vars
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const skillsPercentage = skills.filter((skill) => skill.resume !== 0);
  const finalPercentage = Math.round(
    (skillsPercentage.length / skills.length) * 100
  );
  let suggestions = "";

  if (finalPercentage >= 0 && finalPercentage <= 20) {
    suggestions =
      "Consider adding more relevant skills and experiences to better align with the job description.";
  } else if (finalPercentage > 20 && finalPercentage <= 40) {
    suggestions =
      "Highlight key achievements and projects that demonstrate your qualifications for the position.";
  } else if (finalPercentage > 40 && finalPercentage <= 60) {
    suggestions =
      "Tailor your resume by using specific keywords and phrases from the job description to showcase your fit for the role.";
  } else if (finalPercentage > 60 && finalPercentage <= 80) {
    suggestions =
      "Ensure your resume reflects a strong match with the job requirements and emphasizes your most relevant skills and experiences.";
  } else if (finalPercentage > 80 && finalPercentage <= 100) {
    suggestions =
      "Your resume is well-aligned with the job description. Focus on refining the presentation and ensuring clarity and professionalism in your content.";
  }

  useEffect(() => {
    setTimeout(() => {
      const block = document.querySelector(".block");
      if (block) {
        let numElement = block.querySelector(".num");
        let num = finalPercentage;
        let time = 2000 / num;
        let circle = block.querySelector(".circle");
        let dots = block.querySelector(".dots");

        let interval = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount === num) {
              clearInterval(interval);
              return prevCount;
            } else {
              numElement.innerText = prevCount + 1;
              return prevCount + 1;
            }
          });
        }, time);

        circle.style.strokeDashoffset = 503 - 503 * (num / 100);
        dots.style.transform = `rotate(${360 * (num / 100)}deg)`;
        if (num === 100) {
          dots.style.opacity = 0;
        }

        return () => {
          clearInterval(interval);
        };
      }
    }, 3000); // Delay execution by 3 seconds
  }, [finalPercentage]);

  useEffect(() => {
    // Simulating an async operation
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds (simulating data fetching)
    }, 2900);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <table width="100%" border="0" cellPadding="5" cellSpacing="0">
            {finalPercentage <= 100 && (
              <div className="overallScore-wrapper">
                <div className="score-wrapper">
                  <div className="block">
                    <div className="box">
                      <p className="number">
                        <span className="num">0</span>
                        <span className="sub">%</span>
                      </p>
                    </div>
                    <span className="dots"></span>
                    <svg className="svg">
                      <circle className="circle" cx="90" cy="90" r="80" />
                    </svg>
                  </div>
                  <p className="skill-lable">Your ResCom Score</p>
                </div>
                <div className="result-suggestion">
                  <img src={Badge} alt="" />
                  <div className="sugesstionWrapper">
                    <p className="suggestion_text">{suggestions}</p>
                  </div>
                </div>
              </div>
            )}
            <thead className="header-row">
              <tr>
                <td width="25%">Key Skills</td>
                <td width="25%">Job Description</td>
                <td width="25%">Resume</td>
              </tr>
            </thead>
            <tbody>
              {skills
                .sort((a, b) => {
                  if (b.job - a.job !== 0) return b.job - a.job;
                  else return b.resume - a.resume;
                })
                .map((skill) => (
                  <SkillRow key={skill.skill} skill={skill} />
                ))}
            </tbody>
          </table>
          <button className="updateButton" onClick={handleUpdate}>
            Update Resume or JD
          </button>
        </>
      )}
    </>
  );
};

const SkillRow = (props) => {
  const skill = props.skill;
  return (
    <tr>
      <td width="50%">{skill.skill}</td>
      <td width="25%">{skill.job}</td>
      <td width="25%">{skill.resume ? skill.resume : "🚫"}</td>
    </tr>
  );
};

export default SkillTable;
