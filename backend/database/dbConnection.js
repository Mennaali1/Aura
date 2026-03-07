import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("error", err);
    });
};
