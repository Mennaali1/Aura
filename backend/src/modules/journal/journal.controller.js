import journalModel from "../../../database/model/journal.model.js";
import errHandling from "../../utils/errorHandling.js";
import appError from "../../utils/appError.js";
import mongoose from "mongoose";

// Create journal entry
const createJournal = errHandling(async (req, res, next) => {
  const { title, content, mood, tags } = req.body;
  const userId = req.user.userId;

  const journalEntry = await journalModel.create({
    userId,
    title,
    content,
    mood,
    tags: tags || [],
    date: new Date(),
  });

  res.status(201).json({
    message: "Journal entry created successfully",
    journal: journalEntry,
  });
});

// Get user's journal entries
const getJournals = errHandling(async (req, res, next) => {
  const userId = req.user.userId;
  const { page = 1, limit = 10, mood, tag } = req.query;

  let query = { userId };

  if (mood) {
    query.mood = mood;
  }

  if (tag) {
    query.tags = { $in: [tag] };
  }

  const journals = await journalModel
    .find(query)
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await journalModel.countDocuments(query);

  res.json({
    journals,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  });
});

// Get single journal entry
const getJournal = errHandling(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const journal = await journalModel.findOne({ _id: id, userId });

  if (!journal) {
    return next(new appError("Journal entry not found", 404));
  }

  res.json({ journal });
});

// Update journal entry
const updateJournal = errHandling(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, mood, tags } = req.body;
  const userId = req.user.userId;

  const journal = await journalModel.findOneAndUpdate(
    { _id: id, userId },
    {
      title,
      content,
      mood,
      tags: tags || [],
      updatedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!journal) {
    return next(new appError("Journal entry not found", 404));
  }

  res.json({
    message: "Journal entry updated successfully",
    journal,
  });
});

// Delete journal entry
const deleteJournal = errHandling(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const journal = await journalModel.findOneAndDelete({ _id: id, userId });

  if (!journal) {
    return next(new appError("Journal entry not found", 404));
  }

  res.json({
    message: "Journal entry deleted successfully",
  });
});

// Get journal statistics
const getJournalStats = errHandling(async (req, res, next) => {
  const userId = req.user.userId;

  const stats = await journalModel.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$mood",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalEntries = await journalModel.countDocuments({ userId });
  const totalTags = await journalModel.distinct("tags", { userId });

  res.json({
    moodStats: stats,
    totalEntries,
    totalTags: totalTags.length,
  });
});

export {
  createJournal,
  getJournals,
  getJournal,
  updateJournal,
  deleteJournal,
  getJournalStats,
};
