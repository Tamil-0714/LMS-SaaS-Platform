const mysql = require("mysql2");

// function connectDB() {
//   const pool = mysql.createPool({
//     host: "localhost",
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: "Elearning",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   });
//   return pool.promise();
// }

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "TooJoo_1967",
  database: "Elearning",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// async function queryDB(sql, params) {
//   try {
//     const connection = await connectDB();
//     const [rows] = await connection.query(sql, params);
//     connection.releaseConnection();
//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }

async function queryDB(sql, params) {
  const connection = await pool.promise().getConnection(); // Get a connection from the pool
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

/*
mysql> desc userAuthId;
+-------------+--------------+------+-----+-------------------+-------------------+
| Field       | Type         | Null | Key | Default           | Extra             |
+-------------+--------------+------+-----+-------------------+-------------------+
| authId      | varchar(32)  | NO   | PRI | NULL              |                   |
| email       | varchar(32)  | NO   |     | NULL              |                   |
| google_name | varchar(64)  | NO   |     | NULL              |                   |
| pictureURL  | varchar(255) | YES  |     | NULL              |                   |
| created_at  | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| idKey       | int          | YES  |     | NULL              |                   |
+-------------+--------------+------+-----+-------------------+-------------------+
 */
async function insertUserAuthId(id, email, google_name, pictureURL) {
  try {
    const query =
      "INSERT INTO userAuthId(authId, email, google_name, pictureURL) VALUES (?,?,?,?)";
    const params = [id, email, google_name, pictureURL];
    const rows = await queryDB(query, params);
    console.log("rows from db : ", rows);

    return rows;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.error("Duplicate entry error: ", error.message);
      // Handle duplicate entry, e.g., log it, update the record, or ignore it
      return {
        success: false,
        message: "ER_DUP_ENTRY",
      };
    } else {
      console.error("Database error: ", error);
      throw error; // Re-throw for unexpected errors
    }
  }
}
async function fetchUserAuthId(id) {
  try {
    const query = "SELECT * FROM userAuthId WHERE authId = ?";
    const params = [id];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
    // throw error;
  }
}
async function updateUserName(userName, authId) {
  try {
    const query = "UPDATE userAuthId SET userId = ? WHERE authId = ?";
    const params = [userName, authId];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
    // throw error;
  }
}

async function insertCourseEnrollment(
  enrollmentId,
  userId,
  courseId,
  enrolledDate,
  completionStatus
) {
  try {
    const query = "INSERT INTO enrolement VALUES (?, ?, ?, ?, ?)";
    const params = [
      enrollmentId,
      userId,
      courseId,
      enrolledDate,
      completionStatus,
    ];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// async function insertDummy(
//   courseId,
//   course_name,
//   course_type,
//   course_description,
//   courseThumbnail,
//   price
// ) {
//   try {
//     const query = `INSERT INTO course (course_id, course_name, course_type, course_description, course_thumbnail, price) VALUES (?, ?, ?, ?, ?, ?)`;
//     const params = [
//       courseId,
//       course_name,
//       course_type,
//       course_description,
//       courseThumbnail,
//       price
//     ];
//     const rows = await queryDB(query, params);
//     return rows;
//   } catch (error) {
//     console.error(error);
//   }
// }

async function fetchCourses() {
  try {
    const query = "SELECT * FROM course";
    const params = [];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function fetchEnrollment(userId) {
  try {
    const query =
      "SELECT * FROM course where course_id IN (SELECT course_id FROM enrolement WHERE user_id = ? )";
    const params = [userId];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function insertChatRoom(chatRoomID, chatRoomName, courseId, timestamp) {
  try {
    const query =
      "INSERT INTO chatRoom (chatroom_id, course_id, chatRoom_name, create_at) VALUES (?, ?, ?, ?)";
    const params = [chatRoomID, courseId, chatRoomName, timestamp];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function createUserChatRoom(userId, courseId, timestamp) {
  try {
    const query =
      "INSERT INTO usersChatRoom (userId, chatroom_id, joined_at) SELECT ?, chatroom_id, ? FROM chatRoom WHERE course_id = ?";
    const params = [userId, timestamp, courseId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchChatRoomWithId(courseId) {
  try {
    const query = "SELECT * FROM chatRoom WHERE course_id = ?";
    const params = [courseId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchUnreadStatus(userId, chatRoomId) {
  try {
    const query =
      "SELECT * FROM unread_message WHERE userId = ? AND chatroom_id = ?";
    const params = [userId, chatRoomId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchUserChatRoom(userId, chatRoomId) {
  try {
    const query =
      "SELECT * FROM usersChatRoom WHERE userId = ? AND chatroom_id = ?";
    const params = [userId, chatRoomId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function insertMessage(chatRoomId, userId, content, sendAt) {
  try {
    const query =
      "INSERT INTO `messages` (chatroom_id, userId, content, sent_at) VALUES ( ?, ?, ?, ?)";
    const params = [chatRoomId, userId, content, sendAt];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchMessageWithGroupId(chatRoomId) {
  try {
    const query = "SELECT * FROM messages WHERE chatroom_id = ?";
    const params = [chatRoomId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchUsersonChatRoomWithId(chatRoomId) {
  try {
    const query = "SELECT * FROM  usersChatRoom WHERE chatroom_id = ?";
    const params = [chatRoomId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function insertUnreadMessage(userId, chatRoomId, timestamp) {
  try {
    const query = "INSERT INTO unread_message VALUES(?, ?, ?)";
    const params = [userId, chatRoomId, timestamp];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function removeUnreadSts(userId, chatRoomId) {
  try {
    const query =
      "DELETE FROM unread_message WHERE userId = ? AND chatroom_id = ?";
    const params = [userId, chatRoomId];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  insertUserAuthId,
  fetchCourses,
  fetchUserAuthId,
  updateUserName,
  insertCourseEnrollment,
  fetchEnrollment,
  insertChatRoom,
  createUserChatRoom,
  fetchChatRoomWithId,
  fetchUnreadStatus,
  fetchUserChatRoom,
  insertMessage,
  fetchMessageWithGroupId,
  fetchUsersonChatRoomWithId,
  insertUnreadMessage,
  removeUnreadSts,
  // insertDummy
};
