import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Clipboard } from "lucide-react";

export function FileUpload({imgProcessFun}) {
  const [file, setFile] = useState(null); // State to hold a single file
  const containerRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Accept only the first file
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
  };
  const handleImgToCode = async () =>{
    await imgProcessFun(file)
  }
  const handlePaste = useCallback((event) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const pastedFile = new File(
              [blob],
              `pasted-image-${Date.now()}.png`,
              {
                type: "image/png",
              }
            );
            setFile(pastedFile); // Set the pasted image as the file
            break; // Only one file allowed
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("paste", handlePaste);
    }
    return () => {
      if (container) {
        container.removeEventListener("paste", handlePaste);
      }
    };
  }, [handlePaste]);

  return (
    <div className="w-full max-w-md mx-auto" ref={containerRef} tabIndex={0}>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag 'n' drop a file here, or click to select a file
        </p>
        <p className="mt-2 text-sm text-gray-600">
          You can also paste an image from your clipboard (Ctrl+V / Cmd+V)
        </p>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between p-2 bg-gray-100 rounded">
          <span className="text-sm truncate" style={{ color: "black" }}>
            {file.name}
          </span>
          <button
            onClick={removeFile}
            className="h-8 w-8 text-gray-600 hover:text-red-600"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </button>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]); // Accept only the first file
            }
          }}
        />
        <label
          htmlFor="file-upload"
          className="flex-1 bg-blue-600 text-white text-center p-2 rounded cursor-pointer hover:bg-blue-700"
        >
          Select File
        </label>
        <button
          className="flex items-center border border-gray-300 rounded p-2"
          onClick={handleImgToCode}
        >
          Process to Code
        </button>
      </div>
    </div>
  );
}
