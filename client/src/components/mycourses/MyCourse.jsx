import React, { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { CourseContent } from "./CourseContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import "./scroller.css";
import { Label } from "../ui/label";
import axios from "axios";
import config from "@/config";

const MyCourse = ({ globeEnrolledCourses }) => {
  const [notes, setNotes] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const notesAreaRef = useRef(null);

  // const fetchEnrolledCourses = async () => {
  //   try {
  //     const headers = {
  //       "Content-Type": "application/json",
  //       authorization: localStorage.getItem("authToken") || "",
  //     };
  //     const response = await axios.get(`${config.apiBaseUrl}/enrollments`, {
  //       headers: headers,
  //     });
  //     const resData = response.data;
  //     if (response.status === 200 && resData.data[0]) {
  //       setEnrolledCourses(resData.data);
  //     }
  //   } catch (error) {}
  // };
  // useEffect(() => {
  //   fetchEnrolledCourses();
  // }, []);

  useEffect(() => {
    setEnrolledCourses(globeEnrolledCourses);
  }, [globeEnrolledCourses]);

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
        overflow: "hidden",
      }}
    >
      <div
        className="player-content"
        style={{
          display: "flex",
          margin: "20px 0 0 20px",
          gap: "20px",
          //   justifyContent: "space-around",
        }}
      >
        <VideoPlayer />
        <CourseContent />
      </div>

      <div
        className="notes-taking-area w-[600px]"
        style={{
          outline: "1px solid #262626",
          minHeight: "200px",
          marginLeft: "44px",
          position: "relative",
          top: "-100px",
          padding: "10px",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(notesAreaRef.current.value);
          }}
        >
          <Textarea
            className={cn("resize-none scroll-bar h-[120px]")}
            ref={notesAreaRef}
            placeholder="Let your Notes here."
          />
          <br />

          <Button
            style={{
              float: "right",
            }}
            type="submit"
          >
            Add Notes
          </Button>
          <Button
            style={{
              float: "right",
              marginRight: "10px",
            }}
            type="button"
          >
            Your Notes
          </Button>
        </form>
      </div>
      <div
        className="w-[940px]"
        style={{
          outline: "1px solid #262626",
          height: "330px",
          marginLeft: "684px",
          position: "relative",
          top: "-180px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        <div
          style={{
            alignSelf: "start",
            position: "absolute",
            left: "10px",
          }}
        >
          <Label className={"text-xl"}>Your other courses</Label>
        </div>
        {enrolledCourses[0] ? (
          <>
            {" "}
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
              style={{
                width: "770px",
              }}
            >
              <CarouselContent>
                {enrolledCourses.map((course, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <CardContent className=" aspect-square  items-center justify-center p-6">
                          <div className="course-img">
                            <img
                              style={{
                                width: "120px",
                              }}
                              src={`${config.apiBaseUrl}${course.course_thumbnail}`}
                              class="img-fluid rounded-top"
                              alt=""
                            />
                          </div>
                          <h4
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            {course.course_name} -{" "}
                            <span
                              style={{
                                color: "#00ff7e",
                              }}
                            >
                              {course.course_type}
                            </span>
                          </h4>
                          <span
                            className="line-clamp-2"
                            style={{
                              fontSize: "0.9rem",
                            }}
                          >
                            {course.course_description}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </>
        ) : (
          <>Loading ...</>
        )}
      </div>
    </div>
  );
};

export default MyCourse;
