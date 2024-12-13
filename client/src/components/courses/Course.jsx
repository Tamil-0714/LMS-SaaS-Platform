import React, { useEffect, useState } from "react";

import CourseNav from "./CourseNav";
import CourseCard from "./CourseCard";
import axios from "axios";
import config from "@/config";

const Course = () => {
  const [courseMetaData, setCourseMetaData] = useState(null);
  useEffect(() => {
    const fetchCourse = async () => {
      const headers = {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("authToken"),
      };
      const url = `${config.apiBaseUrl}/courses`;
      try {
        const res = await axios.get(url, { headers: headers });
        if (res.status === 200 && res.data) {
          setCourseMetaData(res.data);
        }
      } catch (error) {}
    };
    fetchCourse();
  }, []);
  return (
    <>
      {/* {
    "course_id": "d340e9ec80ff737e",
    "course_name": "Figma Design",
    "course_type": "Designing",
    "course_description": "Learn to create UI/UX designs with Figma.",
    "course_thumbnail": "/images/courseThumbnail/d340e9ec80ff737e"
} */}
      <CourseNav />
      {courseMetaData === null ? (
        <p>Loading courses...</p>
      ) : (
        <div
          className="course-list"
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* If courseMetaData is an array, map over it and render CourseCard for each item */}
          {courseMetaData.length > 0 ? (
            courseMetaData.map((course, index) => (
              <CourseCard
                key={index}
                courseType={course.course_type}
                courseDes={course.course_description}
                courseTitle={course.course_name}
                courseThumbnai={course.course_thumbnail}
              />
            ))
          ) : (
            <p>No courses found.</p> // If no courses are returned
          )}
        </div>
      )}
    </>
  );
};

export default Course;
