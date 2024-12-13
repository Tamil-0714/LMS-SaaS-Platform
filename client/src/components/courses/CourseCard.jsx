import React from "react";
import { Button } from "../ui/button";
// import "./CourseCard.css"; // Optional CSS file for styles

const CourseCard = ({ courseType, courseTitle, courseDes, courseThumbnai }) => {
  return (
    <section>
      <div
        className="card"
        style={{
          maxWidth: "20rem",
          minHeight: "25rem",
          width: "100%",
          margin: "10px",
          boxShadow: "1px 12px 25px rgb(0 0 0 / 78%)",
          borderRadius: "2.25rem",
          background: "#151419 100%",
        }}
      >
        <div className="card-header">
          <img
            style={{
              width: "100%",
              borderRadius: "2.25rem 2.25rem  0 0",
            }}
            src={`http://localhost:8020${courseThumbnai}`}
            alt=""
          />
        </div>

        <div className="card-body">
          <span
            className="course-type"
            style={{
              padding: "0 12px 12px 12px ",
              fontSize: "1.2em",
              marginTop: "40px",
            }}
          >
            {courseType}
          </span>
          <h2
            style={{
              padding: "0 10px",
              height: "50px",
              fontSize: "1.2rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "50px",
            }}
            className="course-title"
          >
            {courseTitle}
          </h2>
          <h2
            className="course-des"
            style={{
              padding: "0 10px",
            }}
          >
            {courseDes}
          </h2>
        </div>
        <div
          className="card-footer"
          style={{
            // outline:"1px solid red",
            height: "100px",
            borderRadius: "0 0 2.25rem 2.25rem ",
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <div
            className="btn-container"
            style={{
              margin: "20px 10px 0 0",
            }}
          >
            <Button>Enroll Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCard;
