import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // <-- must be first

export const connection = () => {
mongoose.connect(process.env.MONGODB_URI)    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("error", err);
    });
};
