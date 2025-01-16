const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const { insertUserAuthId, insertChatRoom } = require("./DB/DB");
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

function generateUUID() {
  return crypto.randomBytes(8).toString("hex"); // 8 bytes = 16 hex characters
}
function getMySQLTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

app.get("/dummyChatRoom", async (req, res) => {
  try {
    const data = [
      {
        course_id: "09b8bf0345b3258c",
        course_name: "Building REST APIs",
        group_name: "API-Builders-Hub",
      },
      {
        course_id: "0afc64d55106a723",
        course_name: "Machine Learning Basics",
        group_name: "ML-Starters",
      },
      {
        course_id: "15fb246ee263fe17",
        course_name: "Adobe Illustrator Fundamentals",
        group_name: "Illustrator-Gurus",
      },
      {
        course_id: "38c4917849ba6abe",
        course_name: "React Fundamentals",
        group_name: "React-Rookies",
      },
      {
        course_id: "457076d2120ecf59",
        course_name: "Node.js Basics",
        group_name: "Node-Navigators",
      },
      {
        course_id: "4853f6de661874fd",
        course_name: "SQL Mastery",
        group_name: "SQL-Masters",
      },
      {
        course_id: "64b7052bfd54d2f5",
        course_name: "Data Visualization with Python",
        group_name: "PyViz-Community",
      },
      {
        course_id: "680f202d4f57cb0c",
        course_name: "Mastering TypeScript",
        group_name: "TS-Mastery",
      },
      {
        course_id: "752f54c1fc1276f9",
        course_name: "Hacking",
        group_name: "Hackers-Den",
      },
      {
        course_id: "952a5495fc1976f8",
        course_name: "Advanced React Patterns",
        group_name: "React-Wizards",
      },
      {
        course_id: "aab1f6a5c916afbf",
        course_name: "Express.js for APIs",
        group_name: "Express-Experts",
      },
      {
        course_id: "bc2b84a376d612b6",
        course_name: "UI Prototyping in Adobe XD",
        group_name: "XD-Prototypers",
      },
      {
        course_id: "c06ca6f335cc8f35",
        course_name: "Python for Data Science",
        group_name: "PyData-Pros",
      },
      {
        course_id: "c57a07f256300e3f",
        course_name: "Database Design",
        group_name: "DB-Designers",
      },
      {
        course_id: "d340e9ec80ff737e",
        course_name: "Figma Design",
        group_name: "Figma-Creators",
      },
      {
        course_id: "e84049d131c0925a",
        course_name: "JavaScript Essentials",
        group_name: "JS-Essentials",
      },
    ];

    data.forEach(async (datum) => {
      await insertChatRoom(
        generateUUID(),
        datum.group_name,
        datum.course_id,
        getMySQLTimestamp()
      );
    });
    res.send("hey")
  } catch (error) {
    res.send(error);
  }
});

app.listen(9021, () => {
  console.log(`dummy listent`);
});
