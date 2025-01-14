const { fetchUserAuthId } = require("../DB/DB");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;  
  
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }
  const rows = await fetchUserAuthId(token);
  if (rows && rows[0] && rows[0].authId == token) {
    req.user = rows;
    next();
  } else {
    return res.status(403).json({ error: "Invalid Token provided" });
  }
};
const verifyTokenSocket = async (socket, next) => {
  try {
    // Get token from the handshake auth or query
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    console.log("socket token : ", token);

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Validate the token using the same logic as in the HTTP middleware
    const rows = await fetchUserAuthId(token);

    if (rows && rows[0] && rows[0].authId === token) {
      socket.user = rows[0]; // Attach user data to the socket object
      return next();
    } else {
      return next(new Error("Authentication error: Invalid token"));
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return next(new Error("Authentication error: Internal server error"));
  }
};

module.exports = {
  verifyToken,
  verifyTokenSocket,
};

/*
    [
      {
        authId: '106068292256063451762',
        email: 'tom.jerry.07.05.06@gmail.com',
        google_name: 'Tamil 07',
        pictureURL: 'https://lh3.googleusercontent.com/a/ACg8ocIPoZh48EA9WbI7nEA8CSeMrHg1S8ujRIOHN3JnElDM7T3Tl2g=s96-c',
        created_at: 2024-11-27T07:45:44.000Z,
        idKey: null
      }
    ]
 */
