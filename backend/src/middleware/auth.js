import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const token = req.headers["token"];
  jwt.verify(token, "mennaalyfahmy", (err, decoded) => {
    if (err) return res.json({ message: "invalid token", err });
    req.userId = decoded.user._id;
    next();
  });
};
