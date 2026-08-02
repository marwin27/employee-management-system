const adminOnly = (req, res, next) => {
    if (req.user.role !=="Admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
};

module.exports = {
    adminOnly,
}