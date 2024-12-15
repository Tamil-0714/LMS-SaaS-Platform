const express = require("express");
const axios = require("axios");
const { insertUserAuthId } = require("./DB/DB");
const app = express();

// app.get("/dummyCourse", async (req, res) => {
//   try {
//     const courses = [
//       {
//         course_name: "Advanced React Patterns",
//         course_type: "Frontend",
//         course_description:
//           "Learn advanced techniques for building React applications.",
//         price: 1299,
//       },
//       {
//         course_name: "JavaScript Essentials",
//         course_type: "Frontend",
//         course_description:
//           "Master the fundamentals of JavaScript for web development.",
//         price: 799,
//       },
//       {
//         course_name: "Express.js for APIs",
//         course_type: "Programming",
//         course_description: "Build robust APIs with Express.js.",
//         price: 1199,
//       },
//       {
//         course_name: "Mastering TypeScript",
//         course_type: "Programming",
//         course_description:
//           "Learn TypeScript to enhance your JavaScript projects.",
//         price: 1399,
//       },
//       {
//         course_name: "Data Visualization with Python",
//         course_type: "Data Science",
//         course_description:
//           "Visualize complex data using Python libraries like Matplotlib and Seaborn.",
//         price: 1499,
//       },
//       {
//         course_name: "Machine Learning Basics",
//         course_type: "Data Science",
//         course_description:
//           "Understand the basics of machine learning algorithms.",
//         price: 1999,
//       },
//       {
//         course_name: "SQL Mastery",
//         course_type: "Backend",
//         course_description:
//           "Become an expert in writing efficient SQL queries.",
//         price: 599,
//       },
//       {
//         course_name: "Building REST APIs",
//         course_type: "Backend",
//         course_description: "Learn to design and implement RESTful APIs.",
//         price: 999,
//       },
//       {
//         course_name: "Adobe Illustrator Fundamentals",
//         course_type: "Designing",
//         course_description: "Create stunning graphics with Adobe Illustrator.",
//         price: 499,
//       },
//       {
//         course_name: "UI Prototyping in Adobe XD",
//         course_type: "Designing",
//         course_description:
//           "Learn to prototype and design user interfaces in Adobe XD.",
//         price: 799,
//       },
//     ];
//     for (const course of courses) {
//       const courseId = generateUUID();
//       const courseThumbnail = `/images/courseThumbnail/${courseId}`;
//       const rows = await insertDummy(
//         courseId,
//         course.course_name,
//         course.course_type,
//         course.course_description,
//         courseThumbnail,
//         course.price
//       );
//       console.log(rows);
//     }
//   } catch (error) {}
// });

app.get("/dummyUsers", async (req, res) => {
  for (let i = 0; i < 10; i++) {
    const response = await axios.get("https://randomuser.me/api/");
    const id = Math.floor(Math.random() * 1000000000000000000000);
    const name = response.data?.results[0]?.name.first;
    const email = response.data?.results[0]?.email;
    const picture = response.data?.results[0]?.picture.large;
    await insertUserAuthId(id, email, name, picture);
  }
  console.log("completed");
  res.send("ok");
});

app.listen(9021, () => {
  console.log(`dummy listent`);
});
