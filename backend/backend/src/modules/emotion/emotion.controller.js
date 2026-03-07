import emotionModel from "../../../database/model/emotion.model.js";
import errHandling from "../../utils/errorHandling.js";
import appError from "../../utils/appError.js";
import mongoose from "mongoose";

// Save emotion entry
const saveEmotion = errHandling(async (req, res, next) => {
  const { emotion, intensity, note, timestamp } = req.body;
  const userId = req.user.userId;

  const emotionEntry = await emotionModel.create({
    userId,
    emotion,
    intensity,
    note: note || "",
    timestamp: timestamp || new Date(),
  });

  res.status(201).json({
    message: "Emotion recorded successfully",
    emotion: emotionEntry,
  });
});

// Get user's emotion history
const getEmotions = errHandling(async (req, res, next) => {
  const userId = req.user.userId;
  const { period, page = 1, limit = 50 } = req.query;

  // Build query based on period filter
  let query = { userId };
  if (period) {
    let startDate;
    const now = new Date();
    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "all":
      default:
        startDate = null;
    }
    if (startDate) {
      query.timestamp = { $gte: startDate };
    }
  }

  const emotions = await emotionModel
    .find(query)
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await emotionModel.countDocuments(query);

  res.json(emotions);
});

// Get emotion statistics
const getEmotionStats = errHandling(async (req, res, next) => {
  const userId = req.user.userId;

  // Get total emotions
  const totalEmotions = await emotionModel.countDocuments({ userId });

  // Get emotions from this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const thisWeek = await emotionModel.countDocuments({
    userId,
    timestamp: { $gte: weekStart },
  });

  // Calculate streak (consecutive days with emotions)
  const allEmotions = await emotionModel
    .find({ userId })
    .sort({ timestamp: -1 })
    .select("timestamp");

  let streakDays = 0;
  const today = new Date().setHours(0, 0, 0, 0);
  const uniqueDays = new Set();

  for (const emotion of allEmotions) {
    const emotionDay = new Date(emotion.timestamp).setHours(0, 0, 0, 0);
    uniqueDays.add(emotionDay);
  }

  const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a);
  let currentStreak = 0;
  let checkDate = today;

  for (const day of sortedDays) {
    if (day === checkDate) {
      currentStreak++;
      checkDate = checkDate - 24 * 60 * 60 * 1000;
    } else {
      break;
    }
  }
  streakDays = currentStreak;

  // Get most common emotion
  const emotionCounts = await emotionModel.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: "$emotion",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  const dominantEmotion =
    emotionCounts.length > 0
      ? {
          name: emotionCounts[0]._id,
          count: emotionCounts[0].count,
          icon: getEmotionIcon(emotionCounts[0]._id),
        }
      : null;

  res.json({
    totalEmotions,
    thisWeek,
    streakDays,
    dominantEmotion,
  });
});

// Helper function to get emotion icon
function getEmotionIcon(emotion) {
  const icons = {
    Joy: "😊",
    Excited: "😊",
    Grateful: "😊",
    Proud: "😊",
    Peaceful: "😊",
    Down: "😢",
    Disappointed: "😢",
    Lonely: "😢",
    Hurt: "😢",
    Depressed: "😢",
    Frustrated: "😠",
    Annoyed: "😠",
    Furious: "😠",
    Irritated: "😠",
    Resentful: "😠",
    Worried: "😰",
    Nervous: "😰",
    Scared: "😰",
    Overwhelmed: "😰",
    Stressed: "😰",
    Relaxed: "😌",
    Content: "😌",
    Serene: "😌",
    Balanced: "😌",
    Tranquil: "😌",
    Uncertain: "😕",
    Perplexed: "😕",
    Indecisive: "😕",
    Doubtful: "😕",
    Lost: "😕",
  };
  return icons[emotion] || "😊";
}

export { saveEmotion, getEmotions, getEmotionStats };
