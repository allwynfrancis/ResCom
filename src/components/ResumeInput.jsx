import React, { useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";
import axios from "axios";

const ResumeInput = ({
  resumeSource,
  resume,
  changeResume,
  fileContent,
  setFileContent,
  setFileName,
  setResumeSource,
  fileName,
  handleSourceChange,
  userEmail,
  setUserName,
}) => {
  // console.log("User Data:", userEmail);
  useEffect(() => {


    function showPopup(message) {
      var popup = document.getElementById("popup");
      var notificationMessage = document.getElementById("notificationMessage");
      notificationMessage.innerText = message;
      popup.classList.add("active");
      setTimeout(() => {
        closePopup();
      }, 3000); // Hide the message after 3 seconds
    }
  
    function closePopup() {
      var popup = document.getElementById("popup");
      if (popup) {
        popup.classList.remove("active");
      }
    }

    const fetchResume = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/resume/${userEmail}`
        );
        const { resumeContent, fileName, firstName } = response.data;
        if (localStorage.getItem("token") && (resumeContent !== "")) {
          // Display a notification message
          showPopup("Here is your previous resume");
          localStorage.setItem("token", "true");
        }
        setUserName(firstName);
        if (fileName) {
          setResumeSource("file");
          changeResume(resumeContent);
          setFileContent(resumeContent);
          setFileName(fileName);
        } else {
          setResumeSource("text");
          changeResume(resumeContent);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    if (userEmail) {
      fetchResume();
    }
  }, [
    userEmail,
    changeResume,
    setResumeSource,
    setUserName,
    setFileContent,
    setFileName,
  ]);

  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      // Show a warning message if the file is not selected or not a PDF
      const warningMessage = document.getElementById("warning-message");
      warningMessage.style.display = "block";
      setTimeout(() => {
        warningMessage.style.display = "none";
      }, 3000); // Hide the message after 3 seconds
      return;
    }
    setFileName(file.name);
    if (file) {
      try {
        const fileReader = new FileReader();

        fileReader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const textContent = await extractTextFromPdf(arrayBuffer);
          setFileContent(textContent);
          changeResume(textContent);
          setResumeSource("file");

          try {
            console.log("Resume content saved:", file.name);
            const response = await axios.post(
              "http://localhost:8080/api/auth/resume",
              {
                email: userEmail, // Assuming userEmail is the user's email
                content: textContent,
                fileName: file.name,
              }
            );
            console.log("Resume content saved:", response.data);
          } catch (error) {
            console.error("Error saving resume content:", error);
          }
        };
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error reading the file:", error);
      }
    }
  };

  const extractTextFromPdf = async (arrayBuffer) => {
    const loadingTask = pdfjs.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    let textContent = "";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const pageText = await page.getTextContent();
      const pageString = pageText.items.map((item) => item.str).join(" ");
      textContent += pageString + "\n";
    }
    return textContent;
  };

  const handleChange = async (e) => {
    const newText = e.target.value;
    changeResume(newText);
    setFileContent(newText);
    setResumeSource("text");
    try {
      console.log("Resume content saved from text");
      const response = await axios.post(
        "http://localhost:8080/api/auth/resume",
        {
          email: userEmail, // Assuming userEmail is the user's email
          content: newText,
          fileName: null,
        }
      );
      console.log("Resume content saved:", response.data);
    } catch (error) {
      console.error("Error saving resume content:", error);
    }
  };

  return (
    <div className={"resume-input " + resumeSource}>
      <div id="popup" class="popup">
        <span class="close" onclick="closePopup()">
          &times;
        </span>
        <p id="notificationMessage"></p>
      </div>
      <div className="source-toggle">
        {resumeSource === "text" && (
          <button onClick={() => handleSourceChange("file")}>
            Upload File
          </button>
        )}
        {resumeSource === "file" && (
          <button onClick={() => handleSourceChange("text")}>Paste Text</button>
        )}
      </div>
      <div className="separator">
        <span> or </span>
      </div>
      {resumeSource === "text" ? (
        <div className="text-inputs">
          <textarea
            className="resumeInputArea"
            value={resume}
            onChange={handleChange}
            placeholder="Paste Your Resume"
          />
        </div>
      ) : (
        <div className="file-upload-wrapper">
          <div className="file-upload">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              accept=".pdf"
            />
            <label htmlFor="file-input" className="file-upload-label">
              Choose a file
            </label>
          </div>
          {fileName && (
            <div className="selected-file">
              <strong>Selected File is: {fileName}</strong>
            </div>
          )}
          <div id="warning-message" style={{ display: "none", color: "red" }}>
            Please select a PDF file.
          </div>
        </div>
      )}
    </div>
  );
};
export default ResumeInput;
