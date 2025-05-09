import mongoose,{Schema} from "mongoose";

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
  serverId: { type: Number, required: true, index: true }, 
  senderId: { type: Number, required: true, index: true }, 
  
  type: { 
    type: String, 
    enum: ['TEXT', 'IMAGE', 'VIDEO', 'POLL', 'FILE', 'SUMMARY'], 
    default: 'TEXT' 
  },
  
  content: { type: String },
  
  mediaUrls: [{ type: String }],
  
  pollOptions: [PollOptionSchema],
  
  replyTo: {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
    senderId: { type: Number } 
  },
  
  reactions: [ReactionSchema],
  
  isAnonymous: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date }
});

MessageSchema.index({ serverId: 1, createdAt: -1 }); 
MessageSchema.index({ 'replyTo.messageId': 1 }); 
MessageSchema.index({ senderId: 1, createdAt: -1 });


MessageSchema.virtual('reactionCounts').get(function() {
  const counts = {
    UPVOTE: 0,
    DOWNVOTE: 0
  };
  
  this.reactions.forEach(reaction => {
    counts[reaction.type]++;
  });
  
  return counts;
});

export default mongoose.model('Message', MessageSchema);