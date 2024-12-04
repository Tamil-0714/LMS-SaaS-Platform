import React, { useEffect, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import "./scroll.css";
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
          position: "absolute",
          left: "680px",
          top: "5px",
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
      <div
        className="editor-wrapper"
        style={{
          marginLeft: "50px",
        }}
      >
        <Editor
          style={{
            borderRadius: "50px",
          }}
          height="90vh"
          width="40vw"
          theme={theme}
          language={selectedLanguage}
          value={editorValue}
          onMount={handleEditorDidMount}
        />
      </div>
      {/* Optional: display output */}

      {output && (
        <div
          className="output-wrapper scrollable-container"
          style={{
            marginLeft: "20px",
            width: "45%",
            overflowX: "auto",
            backgroundColor: "rgb(61 61 65 / 18%)",
            padding: "12px",
          }}
        >
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default LocalEditor;
