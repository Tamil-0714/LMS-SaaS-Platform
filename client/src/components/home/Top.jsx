import React from "react";

const Top = () => {
  const baseStyle = {
    fontSize: "58px",
    textAlign: "center",
    display: "block",
    width: "100%",
  };
  const degbugStyle = {
    outline: "1px solid red",
  };
  return (
    <div
      style={{
        ...{
          marginTop: "97px",
          width: "100%",
          lineHeight:"77px"
        },
      }}
    >
      <span style={{ ...baseStyle }}>
        Learn a New thing everyday{" "}
        <span
          style={{
            ...baseStyle,
            ...{ color: "rgba(255, 255, 255,0.5)" },
          }}
        >
          The Gateway to Endless Innovation
        </span>
      </span>
    </div>
  );
};

export default Top;
