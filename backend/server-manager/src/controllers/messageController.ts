import { Request, Response } from "express";
import Message from "../models/Message";

export const getMessages=async (req:Request, res:Response):Promise<void> => {
  try {
    const { serverId } = req.query;
    if (!serverId) {
      res.status(400).json({ success: false, message: "serverId required" });
      return;
    }
    const messages = await Message.find({ serverId: Number(serverId) })
      .sort({ createdAt: 1 })
      .lean();

      const messagesWithCounts = messages.map(msg => {
      const reactionCounts = { UPVOTE: 0, DOWNVOTE: 0 };
      if (Array.isArray(msg.reactions)) {
        for (const r of msg.reactions) {
          if (r.type === "UPVOTE") reactionCounts.UPVOTE++;
          if (r.type === "DOWNVOTE") reactionCounts.DOWNVOTE++;
        }
      }
      return { ...msg, reactionCounts };
    });

    res.json({ success: true, messages: messagesWithCounts });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
    return;
  }
}