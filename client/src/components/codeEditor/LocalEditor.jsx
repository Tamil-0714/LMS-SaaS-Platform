import React, { useEffect, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
// import ClipLoader from "react-spinners/ClipLoader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import "./scroll.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RingLoader } from "react-spinners";
import { Input } from "../ui/input";
import { FileUpload } from "./FileUpload";
import config from "@/config";
const LocalEditor = ({
  selectedLanguage,
  defaultValue,
  executeCode,
  theme,
}) => {
  const [editorValue, setEditorValue] = useState(defaultValue);
  let [outputLoading, setOutputLoading] = useState(false);
  const [output, setOutput] = useState("");
  const editorRef = useRef(null);

  // Update editor content when defaultValue changes
  useEffect(() => {
    console.log("value changned");

    setEditorValue(defaultValue);
  }, [defaultValue]);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  async function showOutput() {
    setOutput("");
    setOutputLoading(true);
    console.log(editorRef.current.getValue());

    await executeCode(
      selectedLanguage,
      editorRef.current.getValue(),
      setOutput
    );
    setOutputLoading(false);
  }

  const imgToCode = async (file) => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${config.apiBaseUrl}/imgToCode`, {
        method: "POST",
        body: formData, // Send the file
      });

      if (response.ok) {
        const result = await response.json();
        alert(`File uploaded successfully: ${result.message}`);
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger
          className="athandaithu"
          style={{
            position: "absolute",
            zIndex: "99",
            top: "35px",
            left: "870px",
          }}
        >
          <div
            className="btn-wrapper"
            style={{
              height: "42px",
            }}
          >
            <Button
              // onClick={imgToCode}
              style={{
                height: "40px",
              }}
            >
              Image To Code
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          style={{
            width: "600px",
          }}
        >
          <div className="file-upload-container">
            <FileUpload imgProcessFun={imgToCode}/>
          </div>
        </PopoverContent>
      </Popover>

      <div
        className="wrapper"
        style={{
          display: "flex",
        }}
      >
        <div
          className="btn-wrapper"
          style={{
            position: "relative",
            marginTop: "-44px",
            left: "460px",
            height: "42px",
            // outline:"1px solid red"
          }}
        >
          <Button
            onClick={showOutput}
            style={{
              height: "40px",
            }}
          >
            Show output
          </Button>
        </div>

        {/* <button></button> */}

        <ResizablePanelGroup
          direction="horizontal"
          style={{
            marginLeft: "-80px",
          }}
        >
          <ResizablePanel>
            <div
              className="editor-wrapper"
              style={{
                border: "1px solid rgb(168 162 158)",
                padding: "5px 10px",
                marginRight: "20px",
                borderRadius: "10px",
              }}
            >
              <Editor
                height="86vh"
                width="100%"
                theme={theme}
                language={selectedLanguage}
                value={editorValue}
                onMount={handleEditorDidMount}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div
              className="output-wrapper scrollable-container"
              style={{
                marginLeft: "20px",
                border: "1px solid rgb(168 162 158)",
                height: "87vh",
                width: "75%",
                borderRadius: "10px",
                overflowX: "auto",
                backgroundColor: "rgb(61 61 65 / 18%)",
                padding: "12px",
                position: "relative",
                resize: "vertical",
              }}
            >
              <h4 style={{ textAlign: "center" }}>output</h4>
              {/* <Button>clear</Button> */}
              <pre>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <RingLoader
                    color={"#ffffff"}
                    loading={outputLoading}
                    // cssOverride={override}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
                {output}
              </pre>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Optional: display output */}
      </div>
    </>
  );
};

export default LocalEditor;
