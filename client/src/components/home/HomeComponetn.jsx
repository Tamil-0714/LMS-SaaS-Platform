import React from "react";
import HomeButton from "./HomeButton";
import Top from "./Top";
import HomeToy from "./HomeToy";

const HomeComponetn = () => {
  return (
    <div>
      <Top />
      <div
        className="btn-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "24px",
        }}
      >
        <HomeButton content={"Get statred"} />
        <HomeButton content={"Etho button"} />
      </div>
      <div
        className="hoem-quote"
        style={{ textAlign: "center", marginTop: "24px" }}
      >
        <h1
          style={{
            fontSize: "24px",
          }}
        >
          "Discover a world of learning—everything you need to elevate your
          skills, all in one place."
        </h1>
      </div>
      <div
        className="top-wrapper"
        style={{ display: "flex", justifyContent: "center", marginTop:"30px" }}
      >
        <HomeToy />
      </div>
    </div>
  );
};

export default HomeComponetn;

/*


position: absolute;
width: 1059px;
height: 64px;
left: 306px;
top: 397px;

font-family: 'Poppins';
font-style: normal;
font-weight: 400;
font-size: 24px;
line-height: 64px;

text-align: center;

color: #FFFFFF;


*/
