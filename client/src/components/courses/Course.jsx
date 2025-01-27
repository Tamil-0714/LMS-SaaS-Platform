import React, { useEffect, useState } from "react";
import CourseNav from "./CourseNav";
import axios from "axios";
import config from "@/config";
import CourseList from "./CourseList";

const Course = () => {
  const [courseMetaData, setCourseMetaData] = useState(null);
  const [backUPCourseMetaData, setBackUpCourseMetaData] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const headers = {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
        authorization: localStorage.getItem("authToken"),
      };
      const url = `${config.apiBaseUrl}/courses`;
      try {
        const res = await axios.get(url, { headers: headers });
        if (res.status === 200 && res.data) {
          setCourseMetaData(res.data);
          setBackUpCourseMetaData(res.data); // Set the backup data
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourse();
  }, []);

  const updateFilter = (sortBy, orderBy, category = undefined) => {
    console.log("Filter triggered");

    if (!backUPCourseMetaData) {
      setBackUpCourseMetaData([...courseMetaData]);
    }

    let dataToFilter = [...(backUPCourseMetaData || courseMetaData)];

    if (sortBy === "category" && category) {
      // Filter by category
      const filteredCourses = dataToFilter.filter(
        (course) => course.course_type === category
      );
      setCourseMetaData(filteredCourses);
      return;
    }

    if (sortBy === "price") {
      // Sort by price
      const sortedCourses = dataToFilter.sort((a, b) => {
        return orderBy === "ascending" ? a.price - b.price : b.price - a.price;
      });
      setCourseMetaData(sortedCourses);
      return;
    }

    // Reset to original data if no valid filter is applied
    setCourseMetaData(backUPCourseMetaData);
  };
  const clearFilter = () => {
    if (backUPCourseMetaData) {
      setCourseMetaData([...backUPCourseMetaData]);
    } else {
      console.warn("No backupdata");
    }
  };

  return (
    <>
      <CourseNav
        courseMetaData={backUPCourseMetaData}
        updateFilter={updateFilter}
        clearFilter={clearFilter}
      />
      {courseMetaData === null ? (
        <p>Loading courses...</p>
      ) : (
        <div
          className="courses-wrapper"
          style={{
            marginTop: "10px",
            width: "1400px",
            userSelect: "none",
          }}
        >
          <CourseList courseMetaData={courseMetaData} />
        </div>
      )}
    </>
  );
};

export default Course;
