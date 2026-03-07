import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/MVC")
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("error", err);
    });
};
