const jwt = require("jsonwebtoken");
const { fetchUserAuthId } = require("../DB/DB");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log(req.headers);

    return res.status(403).json({ error: "No token provided" });
  }
  console.log(`token from server ${token}`);

  const rows = await fetchUserAuthId(token);
  if (rows && rows[0] && rows[0].authId == token) {
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
    req.user = rows;
    next();
  }

  // Verify the TOkern here
};

module.exports = {
  verifyToken,
};
