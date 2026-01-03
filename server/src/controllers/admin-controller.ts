import { Request, Response } from "express";
import Member from "../models/Member.js";
import Message from "../models/Message.js";
import Activity from "../models/Activity.js";
import Task from "../models/Task.js";

export async function getDashboardData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    let end = new Date();
    let start = new Date();
    start.setMonth(end.getMonth() - 11);
    start.setDate(1); // Start at the beginning of the month

    // Aggregate by month
    const matchStage = { $match: { createdAt: { $gte: start, $lte: end } } };
    const memberGrowth = await Member.aggregate([
      matchStage,
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing months with 0 registrations for the selected range
    let filledData = [];
    if (memberGrowth.length > 0) {
      let current = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
      const growthMap = Object.fromEntries(
        memberGrowth.map((item) => [item._id, item.count])
      );
      while (current <= endMonth) {
        const monthStr = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}`;
        filledData.push({
          date: monthStr,
          count: growthMap[monthStr] || 0,
        });
        current.setMonth(current.getMonth() + 1);
      }
    }

    // get the branch distribution info
    const branchDistribution = await Member.aggregate([
      {
        $group: {
          _id: "$branch",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // quick stats
    const totalMembers = await Member.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalTasks = await Task.countDocuments();

    // get the batch distribution info
    const batchDistribution = await Member.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // filter and sort batchDistribution
    const filteredBatchDistribution = batchDistribution.map((item) => ({
      batch: parseInt(item._id, 10),
      count: item.count,
    }));
    filteredBatchDistribution.sort((a, b) => a.batch - b.batch);

    res.status(200).json({
      memberGrowth: filledData,
      startDate: start.toISOString().slice(0, 7),
      endDate: end.toISOString().slice(0, 7),
      branchDistribution,
      quickStats: { totalMembers, totalMessages, totalActivities, totalTasks },
      batchDistribution: filteredBatchDistribution.slice(0, 12), // limit to top 10 batches
    });
  } catch (err) {
    console.log("Error getting dashboard data - ", "\n---\n", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
