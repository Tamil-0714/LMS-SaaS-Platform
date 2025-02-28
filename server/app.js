const express = require("express");
const cors = require("cors");
const { verifyToken, verifyTokenSocket } = require("./middleware/middleware");
const videoRoute = require("./routes/videoRoute");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const crypto = require("crypto");
require("colors");
const {
  insertUserAuthId,
  fetchCourses,
  updateUserName,
  insertCourseEnrollment,
  fetchEnrollment,
  createUserChatRoom,
  fetchChatRoomWithId,
  fetchUnreadStatus,
  fetchUserChatRoom,
  insertMessage,
  fetchMessageWithGroupId,
  fetchUsersonChatRoomWithId,
  insertUnreadMessage,
  removeUnreadSts,
  fetchQuestionWithCourseId,
  fetchChoosedAns,
  insertAns,
} = require("./DB/DB");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Server } = require("socket.io");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require("dotenv").config();

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

app.use(cors());

app.use(
  "/images/courseThumbnails",
  express.static(path.join(__dirname, "images/courseThumbnails"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
});

function generateUUID() {
  return crypto.randomBytes(8).toString("hex"); // 8 bytes = 16 hex characters
}

const googleAuth = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const authToken = sub;

    const rows = await insertUserAuthId(sub, email, name, picture);

    if (rows.message === "ER_DUP_ENTRY") {
      return { authToken, userInfo: { name, email, picture }, duplicate: true };
    }

    return { authToken, userInfo: { name, email, picture }, duplicate: false };
  } catch (error) {
    console.error(error);
  }
};

app.post("/auth/google/callback", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token missing" });
  }

  try {
    const { authToken, userInfo, duplicate } = await googleAuth(token);
    res.status(200).json({ authToken, userInfo, duplicate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.post("/api/setusername", verifyToken, async (req, res) => {
  try {
    const { userName } = req.body;
    const rows = await updateUserName(userName, req.user[0]?.authId);
    if (rows.affectedRows === 1) {
      res.status(200).json({ message: "success" });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/runCode", verifyToken, async (req, res) => {
  const { language, code } = req.body;
  try {
    const response = await axios.post("http://localhost:3000/execute", {
      language,
      code,
    });

    return res.status(200).json({ output: response.data.output }); // Return the output for further use
  } catch (error) {
    console.error(
      "Error during code execution:",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/verify/auth", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token verified", user: req.user });
});

app.get("/courses", async (req, res) => {
  const rows = await fetchCourses();
  res.status(200).json(rows);
});

app.get("/images/courseThumbnail/:courseId", (req, res) => {
  const { courseId } = req.params;
  const imagePath = path.join(
    __dirname,
    "images/courseThumbnails",
    `${courseId}.jpg`
  );

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: "Image not found" });
  }

  // Serve the image
  res.sendFile(imagePath);
});

app.post("/imgToCode", verifyToken, upload.single("file"), async (req, res) => {
  // "file" matches the key in FormData.append("file", file)

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Extract the MIME type
  const mimeType = req.file.mimetype;

  // Convert the file buffer to a Base64-encoded string
  const base64String = req.file.buffer.toString("base64");

  // Respond with the Base64 string and MIME type
  const body = {
    mimeType: mimeType,
    base64String: base64String,
  };
  try {
    const result = await axios.post(
      "http://localhost:3030/proxyImgToCode",
      body
    );

    res.status(200).send(result.data);
  } catch (error) {
    console.error(error);
  }
});

function getCurrentDateForMySQL() {
  const now = new Date();

  // Extract year, month, and day
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");

  // Combine into YYYY-MM-DD format
  return `${year}-${month}-${day}`;
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
app.post("/enrollcourse/:id", verifyToken, async (req, res) => {
  try {
    const enrollmentId = generateUUID();
    const courseId = req.params.id;
    const userId = req.user[0]?.userId;
    const enrolledDate = getCurrentDateForMySQL();
    const completionStatus = 0;
    const rows = await insertCourseEnrollment(
      enrollmentId,
      userId,
      courseId,
      enrolledDate,
      completionStatus
    );
    if (rows?.affectedRows === 1) {
      try {
        const chatRoom = await createUserChatRoom(
          userId,
          courseId,
          getMySQLTimestamp()
        );

        if (chatRoom.affectedRows > 0) {
          res
            .status(200)
            .json({ userInfo: userId, success: true, duplicate: false });
        } else {
          console.warn("somewned wrong with insertion ");
        }
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(200).json({ userInfo: null, success: false, duplicate: true });
    }
    console.error("course error : ", error.code);
  }
});

app.get("/enrollments", verifyToken, async (req, res) => {
  try {
    const userId = req.user[0]?.userId;
    const rows = await fetchEnrollment(userId);
    if (rows && rows[0]) {
      res
        .status(200)
        .json({ success: true, message: "courses found", data: rows });
    } else {
      res
        .status(200)
        .json({ success: false, message: "courses not found", data: [] });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "internal server error", success: false, data: [] });
  }
});

app.get("/questions/:id", verifyToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const questions = await fetchQuestionWithCourseId(courseId);
    if (questions.length > 0) {
      return res.status(200).json({ success: true, data: questions });
    } else
      res.status(200).json({
        success: false,
        data: [],
        message: "no question found for this course... ",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

app.get("/chosenAns/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user[0]?.userId;
    const quizId = req.params.id;
    const rows = await fetchChoosedAns(quizId, userId);
    if (rows.length > 0)
      return res.status(200).json({ success: true, data: rows });
    else
      return res
        .status(200)
        .json({ success: false, message: "no data found", data: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

app.post("/insertAns", verifyToken, async (req, res) => {
  try {
    const userId = req.user[0]?.userId;
    const { quizId, chosenOption } = req.body;
    const rows = await insertAns(generateUUID(), quizId, chosenOption, userId);
    if (rows.affectedRows === 1)
      return res
        .status(200)
        .json({ message: "answer inserted", success: true });
    else
      return res
        .status(200)
        .json({ message: "something went wrong in insertion", success: false });
  } catch (error) {
    console.error(error);

    return res
      .status(200)
      .json({ message: "internal server error", success: false });
  }
});

// app.get("/groups/:id", verifyToken, async (req, res) => {
//   try {
//     const courseId = req.params.id;
//     const rows = await fetchChatRoomWithId(courseId);
//     if (rows && rows[0]) {
//       rows.forEach(async (group) => {
//         const status = await fetchUnreadStatus(
//           req.user[0]?.userId,
//           group.chatroom_id
//         );
//         if (status && status[0]) {
//           group[unread] = true;
//         } else {
//           group[unread] = false;
//         }
//       });
//       res
//         .status(200)
//         .json({ success: true, message: "groups found", data: rows });
//     } else {
//       res
//         .status(200)
//         .json({ success: false, message: "groups not found", data: rows });
//     }
//   } catch (error) {
//     res
//       .status(200)
//       .json({ success: false, message: "internal server error", data: [] });
//   }
// });
const getRelativeTime = (timestamp) => {
  const now = new Date(); // Current time
  const past = new Date(timestamp); // Convert timestamp to Date object
  const diffInMs = now - past; // Difference in milliseconds

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
  const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return `yesterday`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInWeeks < 5) {
    return `${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else {
    return `${diffInYears} years ago`;
  }
};
app.get("/groups/:id", verifyToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const rows = await fetchChatRoomWithId(courseId);

    if (rows && rows[0]) {
      // Use Promise.all with map to wait for all async operations

      const updatedRows = await Promise.all(
        rows.map(async (group) => {
          const status = await fetchUnreadStatus(
            req.user[0]?.userId,
            group.chatroom_id
          );
          // Add the unread field to the group object
          group.unread = status && status[0] ? true : false;
          group.timestamp =
            status && status[0] ? getRelativeTime(status[0].sent_time) : false;
          return group; // Return the updated group
        })
      );

      res.status(200).json({
        success: true,
        message: "groups found",
        data: updatedRows,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "groups not found",
        data: rows,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: [],
    });
  }
});

app.get("/video/:id", videoRoute);

app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }

  try {
    // Fetch the image with axios
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", // Important for binary data
    });

    // Set the appropriate content-type
    res.contentType(response.headers["content-type"]);

    // Send the binary image data
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).send("Error fetching image");
  }
});
app.use((req, res, next) => {
  res.status(404).json({ message: "End point not found" });
});

const PORT = process.env.PORT || 8020;
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// WebSocket event handling
io.use(verifyTokenSocket);

const connectedUsers = new Map();

// git test commadn

const userJoinedGroup = async (user, groupId) => {
  try {
    const rows = await fetchUserChatRoom(user, groupId);
    if (rows && rows[0]) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

io.on("connection", (socket) => {
  const thisUser = socket.user.userId;

  // Add user to connectedUsers if not already present
  console.log(
    `user ${socket.user.userId} connected with socket id ${socket.id}`
  );

  socket.on("oldMessages", async ({ groupId }) => {
    try {
      if (await userJoinedGroup(socket.user.userId, groupId)) {
        const oldMessages = await fetchMessageWithGroupId(groupId);

        socket.emit("oldMessagesResponse", { groupId, messages: oldMessages });
      }
    } catch (error) {}
  });

  if (!connectedUsers.has(thisUser)) {
    connectedUsers.set(thisUser, {
      user: thisUser,
      sockets: [],
      joinedGroups: [],
    });
  }
  // Add this socket to the user's sockets array
  const userData = connectedUsers.get(thisUser);
  userData.sockets.push(socket.id);

  // Listen for a user joining a group
  socket.on("joinGroup", async ({ groupId, unreadSts }) => {
    if (!userData.joinedGroups.includes(groupId)) {
      userData.joinedGroups = [];
      userData.joinedGroups.push(groupId);
      if (unreadSts) {
        const unreadUpdateResult = await removeUnreadSts(
          socket.user.userId,
          groupId
        );
      }
    } else {
    }
  });
  // Handle receiving a message for a group
  socket.on("sendMessageToGroup", async ({ groupId, message }) => {
    const timestamp = getMySQLTimestamp();
    const userId = socket.user.userId;
    if (!userData.joinedGroups.includes(groupId)) {
      return;
    }
    try {
      const rows = await insertMessage(groupId, userId, message, timestamp);
      const thisRoomUsers = await fetchUsersonChatRoomWithId(groupId);
      let unreadInsertionResult = true;
      for (let i = 0; i < thisRoomUsers.length; i++) {
        try {
          const user = thisRoomUsers[i];
          const currectUserOnMap = connectedUsers.get(user.userId);

          if (currectUserOnMap?.joinedGroups.includes(user.chatroom_id)) {
            continue;
          }

          if (user.userId !== userId) {
            const Unreadresult = await insertUnreadMessage(
              user.userId,
              user.chatroom_id,
              getMySQLTimestamp()
            );
            if (Unreadresult.affectedRows !== 1) {
              unreadInsertionResult = false;
            } else {
            }
          }
        } catch (error) {
          console.error("just unread duplicaton".yellow);
        }
      }
      if (!unreadInsertionResult) {
        console.error("unreadr insertion fialed ");
      }
      if (rows.affectedRows === 1) {
        connectedUsers.forEach((user, userId) => {
          if (user.joinedGroups.includes(groupId)) {
            // Broadcast the message to all sockets of this user
            // {
            //     "text": "hey you nice",
            //     "sent": false,
            //     "sender": "vitry_me",
            //     "messageId": 23,
            //     "sent_at": "2025-01-18T10:25:02.000Z"
            // }
            user.sockets.forEach((socketId) => {
              io.to(socketId).emit("groupMessage", {
                groupId,
                message,
                sender: socket.user.userId,
                messageId: rows.insertId,
                sent_at: new Date().toISOString(),
              });
            });
          }
        });
      }
    } catch (error) {
      console.error("Error at sendMessageToGroup : ", error);
    }
    // Find all users in the group
  });
  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log(
      `user ${socket.user.userId} disconnected with socket id `,
      socket.id
    );

    // Remove this socket from the user's sockets array
    userData.sockets = userData.sockets.filter((id) => id !== socket.id);

    // If the user has no more active sockets, clean up their data
    if (userData.sockets.length === 0) {
      console.log(`No active connections for user: ${thisUser}`);
      connectedUsers.delete(thisUser);
    }
  });
});

server.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
