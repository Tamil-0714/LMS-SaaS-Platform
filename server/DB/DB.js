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

module.exports = {
  insertUserAuthId,
  fetchCourses,
  fetchUserAuthId,
  // insertDummy
};
