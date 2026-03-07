import mongoose from "mongoose";

const emotionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  emotion: {
    type: String,
    required: true,
    maxLength: 50,
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  note: {
    type: String,
    maxLength: 500,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
emotionSchema.index({ userId: 1, timestamp: -1 });

const emotionModel = mongoose.model("emotion", emotionSchema);
export default emotionModel;
