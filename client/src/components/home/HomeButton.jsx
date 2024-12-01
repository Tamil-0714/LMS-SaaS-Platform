import React from "react";
import { Button } from "../ui/button";

const HomeButton = ({content,style}) => {
  return (
    <div style={style}>
      <Button
        style={{
          background:
            "linear-gradient(90deg, rgba(214, 255, 127, 0) -70.34%, #D6FF7F 50.07%, rgba(214, 255, 127, 0) 160.54%)",
        fontSize:"1.2rem",
        padding:"26px 16px"
        }}
      >
        {content}
      </Button>
    </div>
  );
};

export default HomeButton;

/**
 * 

display: flex;
flex-direction: row;
align-items: flex-start;
padding: 12px 48px;
gap: 10px;
isolation: isolate;

position: absolute;
width: 287px;
height: 59px;
left: 195px;
top: 183px;

background: linear-gradient(90deg, rgba(214, 255, 127, 0) -70.34%, #D6FF7F 50.07%, rgba(214, 255, 127, 0) 160.54%);
border-radius: 18px;

 */
