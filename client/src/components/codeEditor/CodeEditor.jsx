import { useEffect, useRef, useState } from "react";
import React from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocalEditor from "./LocalEditor";
import config from "@/config";

const verifyAuthToken = async (authToken, setUser, setGlobUser) => {
  const headers = {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true',
    authorization: authToken,
  };
  try {
    const res = await axios.get(`${config.apiBaseUrl}/api/verify/auth`, {
      headers: headers,
    });
    if (res.status === 200) {
      const userData = res.data.user[0];
      const verifiedUser = {
        name: userData.google_name,
        email: userData.email,
        picture: userData.pictureURL,
      };
      setUser(verifiedUser);
      setGlobUser(verifiedUser);
      const signInButton = document.getElementById("googleSignInButton");
      if (signInButton) {
        signInButton.innerHTML = ""; // Clear the button's content
      }
      console.log(res.data);
    }
  } catch (error) {}
};

const executeCode = async (language, code, setOutput) => {
  const headers = {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true',
    authorization: localStorage.getItem("authToken"),
  };
  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/runCode`,
      {
        language,
        code,
      },
      { headers: headers }
    );
    console.log("status : ", response.status);

    if (response.status == 403) {
      setOutput(
        "Un-Authorized acces to an proted end point , login to acces this future"
      );
      return;
    }
    console.log("Execution Result:", response.data.output);
    setOutput(response?.data?.output);
    // return response.data.output; // Return the output for further use
  } catch (error) {
    console.log("status : ", error.response.status);
    // {
    //   `<span style={{ color: "red" }}>
    //     Un-Authorized acces to an proted end point,
    //     <br />
    //     login to acces this future
    //   </span>`
    // }
    if (error.response.status == 403) {
      setOutput(
        "Un-Authorized acces to an proted end point\nlogin to acces this future"
      );
      return;
    }
    console.error(
      "Error during code execution:",
      error.response?.data || error.message
    );
    return (
      error.response?.data?.error ||
      "An error occurred while executing the code"
    );
  }
};

const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("c");
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [editorContent, setEditorContent] = useState(
    "// Write your C code here"
  );
  useEffect(() => {
    console.log("selected language chagned : ", selectedLanguage);
    const getDefaultEditorContent = (language) => {
      switch (language) {
        case "c":
          return "// Write your C code here";
        case "cpp":
          return "// Write your C++ code here";
        case "java":
          return "// Write your Java code here";
        case "python":
          return "# Write your Python code here";
        case "javascript":
          return "// Write your JavaScript code here";
        default:
          return "// Start coding here";
      }
    };

    setEditorContent(getDefaultEditorContent(selectedLanguage));
  }, [selectedLanguage]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };
  return (
    <div
      className="container"
      style={{
        width: "80vw",
      }}
    >
      {/* selector bar start*/}
      <div
        className="selectors"
        style={{
          height: "50px",
          display: "flex",
          padding: "5px 0 5px 0",
          width: "600px",
          marginLeft: "60px",
          gap: "20px",
          // paddingTop: "10px",
          // paddingLeft: "30px",
        }}
      >
        <div className="language-container">
          <Select onValueChange={handleLanguageChange} defaultValue="c">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>  
            <SelectContent>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">c++</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="theme-container">
          <Select onValueChange={handleThemeChange} defaultValue="vs-dark">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Dark</SelectItem>
              <SelectItem value="light">light</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* selector bar end */}

      <LocalEditor
        selectedLanguage={selectedLanguage}
        defaultValue={editorContent}
        executeCode={executeCode}
        theme={selectedTheme}
       
      />
    </div>
  );
};

export default CodeEditor;
