import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import config from "@/config";
import { Button } from "../ui/button";
import Question from "./Question";
import QuestionNumbers from "./QuestionNum";
import axios from "axios";

const Assignment = ({ globeEnrolledCourses }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [hoverCourseId, setHoverCourseId] = useState("");
  const [toggleBt, setToggleBt] = useState(false); //need to chage to false
  const [currentQuesNo, setCurrentQuesNo] = useState(1);
  const [answeredQues, setAnsweredQues] = useState([]);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    setEnrolledCourses(globeEnrolledCourses);
  }, [globeEnrolledCourses]);
  useEffect(() => {
    console.log("current course questison : ", questions);
  }, [questions]);
  const fetchQuestion = async (courseId) => {
    console.log("questions fetched succes for tis course id : ", courseId);
    try {
      const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        authorization: localStorage.getItem("authToken"),
      };
      const response = await axios.get(
        `${config.apiBaseUrl}/questions/${courseId}`,
        {
          headers: headers,
        }
      );
      if (response.status === 200) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (currentCourse != null) fetchQuestion(currentCourse);
  }, [currentCourse]);
  const incrementQues = (randomQues = null) => {
    if (randomQues !== null && randomQues !== undefined) {
      setAnsweredQues((prev) => [...prev, randomQues]);
      return;
    }
    const prevVal =
      answeredQues.length > 0 ? answeredQues[answeredQues.length - 1] : 0;
    setAnsweredQues((prev) => [...prev, prevVal + 1]);
  };

  return (
    <div className="assignment-wrapper">
      <div>
        <div
          onClick={() => {
            setCurrentQuesNo(1);
            setCurrentCourse(null);
            setAnsweredQues([]);
            setQuestions([]);
            setToggleBt(false);
          }}
          className="show-courses-btn"
          style={
            toggleBt
              ? {
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "10px",
                  // outline:"1px solid red"
                }
              : {
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "10px",
                  display: "none",
                  // outline:"1px solid red"
                }
          }
        >
          <Button>Show Courses</Button>
        </div>
        <div
          className="w-[940px]"
          style={
            toggleBt
              ? {
                  outline: "1px solid #262626",
                  height: "330px",
                  //   marginLeft: "684px",
                  position: "absolute",
                  top: "40px",
                  left: "50%",
                  transform: "translateX(-42%)",
                  padding: "10px",
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }
              : {
                  outline: "1px solid #262626",
                  height: "330px",
                  //   marginLeft: "684px",
                  position: "absolute",
                  top: "40px",
                  left: "50%",
                  transform: "translateX(-42%)",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }
          }
        >
          <div
            style={{
              alignSelf: "start",
              position: "absolute",
              left: "10px",
              width: "100%",
            }}
          >
            <Label
              className={"text-xl "}
              style={{ textAlign: "center", width: "100%", display: "block" }}
            >
              Select course to atten the test
            </Label>
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
                      {}
                      <div
                        className="p-1"
                        onClick={() => {
                          setToggleBt(true);
                          setCurrentCourse(course.course_id);
                        }}
                        onMouseEnter={() => {
                          setHoverCourseId(course.course_id);
                        }}
                        onMouseLeave={() => {
                          setHoverCourseId(null);
                        }}
                      >
                        <Card
                          style={
                            course.course_id == hoverCourseId ||
                            course.course_id == currentCourse
                              ? {
                                  cursor: "pointer",
                                  backgroundColor: "#7b7b7b61",
                                }
                              : {
                                  cursor: "pointer",
                                }
                          }
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

      {toggleBt && (
        <>
          {questions.length > 0 ? (
            <>
              {" "}
              <div
                className="quesitons"
                style={{
                  marginTop: "100px",
                  width: "80%",
                  marginLeft: "10%",
                }}
              >
                <Question
                  currentQuesNo={currentQuesNo}
                  setCurrentQuesNo={setCurrentQuesNo}
                  incrementQues={incrementQues}
                  maxQuexNo = {questions.length}
                  question={questions[currentQuesNo - 1]}
                />
              </div>
              <div className="bg-background flex  justify-center">
                <QuestionNumbers
                  answeredQues={answeredQues}
                  setCurrentQuesNo={setCurrentQuesNo}
                  count={questions.length}
                  currentQuesNo={currentQuesNo}
                />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  marginTop: "30px",
                }}
              >
                <center>no question found for this course... </center>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Assignment;
