import React, { useState } from "react";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import "./CourseCard.css"; // Optional CSS file for styles
import { Button } from "../ui/button";
import StarRating from "./starRating";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Badge } from "lucide-react";
import config from "@/config";
import axios from "axios";
const CourseList = ({ courseMetaData }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [openDialogCourseId, setOpenDialogCourseId] = useState(null);

  const handleOpenDialog = (courseId) => setOpenDialogCourseId(courseId);
  const handleCloseDialog = () => setOpenDialogCourseId(null);
  // const handleEnrollCorse = async (courseId, courseName) => {
  //   try {
  //     const headers = {
  //       "Content-Type": "application/json",
  //       authorization: localStorage.getItem("authToken"),
  //     };
  //     console.log(headers);

  //     const res = await axios.post(
  //       `${config.apiBaseUrl}/enrollcourse/${courseId}`,
  //       {},
  //       {
  //         headers: headers,
  //       }
  //     );

  //     if (res.status === 200) {
  //       const { userInfo, success, duplicate } = res.data;

  //       if (!duplicate && success) {
  //         console.log("success user info : ", userInfo);
  //         toast("Course enrolled succes", {
  //           description: `User ${userInfo} Enrolled to course ${courseName}`,
  //           action: {
  //             label: "Undo",
  //             onClick: () => console.log("Undo"),
  //           },
  //           duration: 5000,
  //         });
  //       } else if (!success && duplicate) {
  //         alert("you already register for this course ");
  //       }
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Invalid Course selection or Error Occurred:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  const handleEnrollCorse = async (courseId, courseName) => {
    handleCloseDialog();
    let undoClicked = false; // Flag to track if "Undo" was clicked

    const headers = {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("authToken"),
    };
    console.log(headers);

    // Show the toast notification with "Undo" button
    toast("Course enrollment pending...", {
      style: {
        color: "yellow",
      },
      description: `User will be enrolled to course ${courseName} in 5 seconds.`,
      action: {
        label: "Undo",
        onClick: () => {
          undoClicked = true; // Set the flag if "Undo" is clicked
          console.log("Undo clicked, enrollment canceled.");
        },
      },
      duration: 5000, // Set toast duration to 5 seconds
    });

    // Wait for the toast duration before making the network call
    setTimeout(async () => {
      if (!undoClicked) {
        try {
          const res = await axios.post(
            `${config.apiBaseUrl}/enrollcourse/${courseId}`,
            {},
            {
              headers: headers,
            }
          );

          if (res.status === 200) {
            const { userInfo, success, duplicate } = res.data;

            if (!duplicate && success) {
              console.log("Success! User info:", userInfo);

              toast.success("Course successfully enrolled!", {
                description: `User ${userInfo} enrolled in course ${courseName}`,
              });
            } else if (!success && duplicate) {
              // alert("You are already registered for this course.");
              toast.warning("Unable to enroll course !", {
                description: `You're already enrolled in course ${courseName}`,
              });
            }
          }
        } catch (error) {
          console.error(
            "Invalid Course selection or Error Occurred:",
            error.response?.data || error.message
          );
          toast.error("Failed to enroll in course.");
        }
      }
    }, 5000); // Wait 5 seconds for the toast duration
  };

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
                <>
                  <Dialog
                    open={openDialogCourseId === course.course_id}
                    onOpenChange={(isOpen) =>
                      isOpen
                        ? handleOpenDialog(course.course_id)
                        : handleCloseDialog()
                    }
                  >
                    <DialogTrigger asChild>
                      <CarouselItem
                        className={
                          courseMetaData.length > 4
                            ? `basis-1/4`
                            : `basis-1/${courseMetaData.length}`
                        }
                        key={index}
                      >
                        <Card
                          style={{
                            width: "300px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: "10px",
                            justifyContent: "space-evenly",
                            transition: "all 0.2s ease-in",
                          }}
                          className="single-course-card"
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
                            <CardDescription>
                              {course.course_type}
                            </CardDescription>
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
                              {/* <Button>Enrol now</Button> */}
                              <StarRating
                                rating={1 + Math.floor(Math.random() * 9) * 0.5}
                              />
                            </p>
                          </CardFooter>
                        </Card>
                      </CarouselItem>
                    </DialogTrigger>
                    <DialogContent
                      style={{
                        minWidth: "1400px",
                        marginLeft: "7%",
                        height: "80%",
                      }}
                    >
                      <DialogHeader style={{ display: "none" }}>
                        <DialogTitle> </DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <CarouselItem
                        className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        key={index}
                      >
                        <Card
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          style={
                            isHovered
                              ? {
                                  width: "90%",
                                  minHeight: "600px",
                                }
                              : {}
                          }
                          className="relative overflow-hidden group h-[400px] w-[300px] transition-all duration-300 hover:shadow-lg dark"
                        >
                          <div className="absolute inset-0">
                            <img
                              src={`http://localhost:8020${course.course_thumbnail}`}
                              style={
                                isHovered
                                  ? {
                                      opacity: "0.2",
                                    }
                                  : {}
                              }
                              alt={course.course_name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
                          </div>

                          <div className="relative h-full flex flex-col justify-end p-6">
                            {/* <Badge className="absolute top-4 left-4 bg-primary/80 hover:bg-primary">
                              {course.course_type}
                            </Badge> */}

                            <div className="space-y-2">
                              <h3 className="text-xl font-bold text-white">
                                {course.course_name}
                              </h3>
                              <p
                                className={
                                  isHovered
                                    ? "text-sm text-gray-300 line-clamp-10"
                                    : "text-sm text-gray-300 line-clamp-2"
                                }
                              >
                                {course.course_description}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-400">Price</p>
                                <p className="text-lg font-bold text-white">
                                  ₹{course.price}
                                </p>
                              </div>
                              <StarRating
                                rating={1 + Math.floor(Math.random() * 9) * 0.5}
                              />
                            </div>
                          </div>
                        </Card>
                      </CarouselItem>

                      <DialogFooter
                        className=""
                        style={{
                          alignItems: "end",
                        }}
                      >
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                        <div className="enroll-now">
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button type="button" variant="enroll">
                                Enroll Now
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  To enroll this course.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async () => {
                                    await handleEnrollCorse(
                                      course.course_id,
                                      course.course_name
                                    );
                                  }}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
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
