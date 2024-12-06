import React, { useEffect, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import "./scroll.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
const LocalEditor = ({
  selectedLanguage,
  defaultValue,
  executeCode,
  theme,
}) => {
  const [editorValue, setEditorValue] = useState(defaultValue);
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
    console.log(editorRef.current.getValue());
    await executeCode(
      selectedLanguage,
      editorRef.current.getValue(),
      setOutput
    );
  }

  return (
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
              height:"87vh",
              width: "75%",
              borderRadius: "10px",
              overflowX: "auto",
              backgroundColor: "rgb(61 61 65 / 18%)",
              padding: "12px",
            }}
          >
            <h4 style={{textAlign:"center"}}>output</h4>
            <pre>{output}</pre>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Optional: display output */}
    </div>
  );
};

export default LocalEditor;
