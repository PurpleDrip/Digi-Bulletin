import mongoose, { Schema, Document } from "mongoose";

// 1. Use string enums for better readability and storage
enum TitleType {
  QUESTION = "QUESTION",
  ALERT = "ALERT",
  INFO = "INFO",
  WARNING = "WARNING",
}

enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  POLL = "POLL",
  FILE = "FILE",
  SUMMARY = "SUMMARY",
}

enum ReactionType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

// 2. Define sub-schemas first
const PollOptionSchema = new Schema({
  option: { type: String, required: true },
  votes: [{
    userId: { type: Number, required: true }, // Should ideally be ObjectId if using MongoDB references
    votedAt: { type: Date, default: Date.now }
  }]
});

const ReactionSchema = new Schema({
  type: { type: String, enum: Object.values(ReactionType), required: true },
  userId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 3. Main Message Schema
const MessageSchema = new Schema({
  serverId: { type: Number, required: true, index: true }, 
  senderId: { type: Number, required: true, index: true }, 
  
  type: { 
    type: String, 
    enum: Object.values(MessageType),
    required: true,
    default: MessageType.TEXT
  },

  title: { 
    type: String, 
    enum: Object.values(TitleType),
    required: false 
  },

  // 4. Handle different content types properly
  content: { 
    type: String,
    required: function(this: any) {
      return this.type === 'TEXT' || this.type === 'SUMMARY';
    } 
  },
  
  mediaUrls: {
    type: [String],
    required: function(this: any) {
      return [
        MessageType.IMAGE, 
        MessageType.VIDEO, 
        MessageType.FILE
      ].includes(this.type);
    }
  },

  pollOptions: { 
    type: [PollOptionSchema],
    validate: {
      validator: function(this: any, value: any) {
        if (this.type === MessageType.POLL) {
          return Array.isArray(value) && value.length > 0;
        }
        return true;
      },
      message: 'pollOptions is required when type is POLL'
    }
  },
  
  replyTo: {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
    senderId: { type: Number }, // Should match senderId type
  },
  
  reactions: {
    type: [ReactionSchema],
    default: []
  },

  isAnonymous: {
    type: Boolean,
    default: false,
    required: true
  }

}, { 
  timestamps: true, // 5. Auto-manage createdAt/updatedAt
  toJSON: { virtuals: true } // Include virtuals in JSON output
});

// 6. Compound indexes
MessageSchema.index({ serverId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ 'replyTo.messageId': 1 });

// 7. Virtual for reaction counts
MessageSchema.virtual('reactionCounts').get(function() {
  return this.reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);
});

// 8. TypeScript interfaces
export interface IPollOption {
  option: string;
  votes: Array<{
    userId: number;
    votedAt: Date;
  }>;
}

export interface IReaction {
  type: ReactionType;
  userId: number;
  createdAt: Date;
}
export interface IMessage {
  serverId: number;
  senderId: number;
  type: MessageType;
  title?: TitleType;
  content?: string;
  mediaUrls?: string[];
  pollOptions?: IPollOption[];
  replyTo?: {
    messageId: mongoose.Types.ObjectId;
    senderId: number;
  };
  reactions: IReaction[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends IMessage, Document {
  reactionCounts: Record<ReactionType, number>;
}

// 9. Model export
export default mongoose.model<MessageDocument>('Message', MessageSchema);
