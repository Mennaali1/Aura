import mongoose from "mongoose";

const journalSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 100,
  },
  content: {
    type: String,
    required: true,
    maxLength: 5000,
  },
  mood: {
    type: String,
    enum: [
      "very-happy",
      "happy",
      "neutral",
      "sad",
      "very-sad",
      "anxious",
      "angry",
      "excited",
      "calm",
      "other",
    ],
    default: "neutral",
  },
  tags: [
    {
      type: String,
      maxLength: 20,
    },
  ],
  isPrivate: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
journalSchema.index({ userId: 1, date: -1 });
journalSchema.index({ userId: 1, tags: 1 });

const journalModel = mongoose.model("journal", journalSchema);
export default journalModel;
