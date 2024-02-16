import React, { useState } from "react";
import ResumeInput from "../ResumeInput";
import JobInput from "../JobInput";
import SkillTable from "../SkillTable";
import { compare } from "../../compare/compare";
import { useNavigate, useLocation } from "react-router-dom";

const Contents = () => {
  const [userName, setUserName] = useState("");
  const [resume, changeResume] = useState("");
  const [job, changeJob] = useState("");
  const [skillSet, changeSkillSet] = useState([]);
  const [resumeSource, setResumeSource] = useState("text");
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [showSkillTable, setShowSkillTable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Inside your component
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedEmail = queryParams.get("p4rM5");

  // Decode the email from Base64
  let userEmail = "";
  if (encodedEmail) {
    try {
      userEmail = atob(encodedEmail);
    } catch (error) {
      console.error("Error decoding email:", error);
    }
  }

  // console.log("Decoded email:", userEmail);

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token removed from localStorage");
    navigate("/login");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      job.trim() === "" ||
      resume.trim() === "" ||
      (resumeSource === "file" && fileContent.trim() === "")
    ) {
      setErrorMessage(
        "Job description or resume cannot be empty. Please provide both description and resume."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }
    const newSkillSet = compare(resume, job);
    changeSkillSet(newSkillSet);
    setShowSkillTable(true);
    setErrorMessage("");
  };

  const handleUpdate = () => {
    setShowSkillTable(false);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && event.metaKey) {
      handleSubmit(event);
    }
  };

  const handleSourceChange = (source) => {
    // Reset file content when switching sources
    setFileContent("");
    setResumeSource(source);
  };

  const handleReset = () => {
    changeResume(""); // Resetting the resume input
    changeJob(""); // Resetting the job input
    setFileName("");
  };

  return (
    <div>
      <div className="navbar-wrapper">
        <div className="navbar">
          <a href="/" className="brandLogo">
            <h1>ResCom</h1>
          </a>
          <div className="welcome-wrapper">
            <h2 className="userName">Welcome, {userName}</h2>
            <button className="button-77 logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className={"contents " + showSkillTable}>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="input-container">
            {!showSkillTable && (
              <>
                <ResumeInput
                  setUserName={setUserName}
                  resumeSource={resumeSource}
                  resume={resume}
                  changeResume={changeResume}
                  fileContent={fileContent}
                  fileName={fileName}
                  setFileContent={setFileContent}
                  setFileName={setFileName}
                  setResumeSource={setResumeSource}
                  handleSourceChange={handleSourceChange}
                  userEmail={userEmail}
                />
                <JobInput changeJob={changeJob} job={job} />
              </>
            )}
          </div>
          <div className="top">
            <button
              id="submit"
              className="button-77"
              type="submit"
              style={{ display: showSkillTable ? "none" : "block" }}
            >
              {showSkillTable ? "" : "Check Resume"}
            </button>
            <button
              type="button"
              style={{ display: showSkillTable ? "none" : "block" }}
              onClick={handleReset}
            >
              {showSkillTable ? "" : "Reset"}
            </button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
        {showSkillTable && (
          <div className="skill-table">
            <SkillTable skills={skillSet} handleUpdate={handleUpdate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Contents;
