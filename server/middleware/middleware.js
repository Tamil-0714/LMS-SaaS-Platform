function authUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token || token !== "secureToken") {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  next();
}


module.exports = {
    authUser
}