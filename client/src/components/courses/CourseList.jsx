import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "../ui/button";
const CourseList = ({ courseMetaData }) => {
  return (
    <div
      className="course-list"
      style={{
        display: "flex",
      }}
    >
      <div
        className="carosel-wrapper"
        style={{
          height: "500px",
          width: "100%",
          marginLeft: "5%",
          outline: "1px solid white",
          borderRadius: "8px",
        }}
      >
        <center>
          <h2
            style={{
              margin: "10px 0 20px 0",
              fontSize: "1.1rem",
            }}
          >
            Courses
          </h2>
        </center>
        <Carousel
          style={{
            width: "100%",
            // outline: "1px solid red",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            paddingLeft: "20px",
          }}
        >
          <CarouselContent>
            {courseMetaData.length > 0 ? (
              courseMetaData.map((course, index) => (
                <CarouselItem className="basis-1/4" key={index}>
                  <Card
                    style={{
                      width: "300px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <CardHeader>
                      <CardTitle
                        style={{
                          height: "150px",
                        }}
                      >
                        <img
                          src={`http://localhost:8020${course.course_thumbnail}`}
                          alt=""
                        />
                      </CardTitle>
                      <CardDescription>{course.course_type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{course.course_name}</p>
                      <br />
                      <p
                        style={{
                          whiteSpace: "nowrap",
                          // outline:"1px solid red"  ,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "270px",
                          height: "50px",
                        }}
                      >
                        {course.course_description}
                      </p>
                    </CardContent>
                    <CardFooter
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // outline:"1px solid red",
                        width: "100%",
                      }}
                    >
                      <div className="price">
                        <p>₹ {course.price}</p>
                      </div>
                      <p>
                        <Button>Enrol now</Button>
                      </p>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default CourseList;
