import mongoose, { Schema } from "mongoose";

const PollOptionSchema = new Schema({
  option: { type: String, required: true },
  votes: [{
    userId: { type: Number, required: true },
    votedAt: { type: Date, default: Date.now }
  }]
});

const ReactionSchema = new Schema({
  type: { type: String, enum: ['UPVOTE', 'DOWNVOTE'], required: true },
  userId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new Schema({
  serverId: { type: Number, required: true, index: true }, // References PostgreSQL Server.id
  senderId: { type: Number, required: true, index: true }, // References PostgreSQL User.id
  
  type: { 
    type: String, 
    enum: ['TEXT', 'IMAGE', 'VIDEO', 'POLL', 'FILE', 'SUMMARY'], 
    default: 'TEXT' 
  },
  
  content: { type: String ,required:true}, // if TEXT then just a string or else if media the URL.

  pollOptions:{ type:[PollOptionSchema], required:false},
  
  replyTo: {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
    senderId: { type: Number },
    required:false
  },
  
  reactions: {type:[ReactionSchema],required:false},
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date }
});

// Compound indexes for better query performance
MessageSchema.index({ serverId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ 'replyTo.messageId': 1 });

// Virtual for getting reaction counts
MessageSchema.virtual('reactionCounts').get(function() {
  const counts = {
    UPVOTE: 0,
    DOWNVOTE: 0
  };
  
  this.reactions?.forEach(reaction => {
    counts[reaction.type]++;
  });
  
  return counts;
});

export interface IMessage {
  serverId: number;
  senderId: number;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'POLL' | 'FILE' | 'SUMMARY';
  content?: string;
  mediaUrls?: string[];
  pollOptions?: {
    option: string;
    votes: { userId: number; votedAt: Date }[];
  }[];
  replyTo?: {
    messageId: mongoose.Types.ObjectId;
    senderId: number;
  };
  reactions: {
    type: 'UPVOTE' | 'DOWNVOTE';
    userId: number;
    createdAt: Date;
  }[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MessageDocument extends IMessage, mongoose.Document {
  reactionCounts: { UPVOTE: number; DOWNVOTE: number };
}

export default mongoose.model<MessageDocument>('Message', MessageSchema);