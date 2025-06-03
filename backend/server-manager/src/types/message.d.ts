export interface IVote {
    userId: number;
    votedAt: Date;
}
  
export interface IPoll {
    option: string;
    votes: IVote[];
}
  
export interface IReaction {
    type: 'UPVOTE' | 'DOWNVOTE';
    userId: number;
    createdAt: Date;
}
  
export interface IMessage {
    serverId: number;
    senderId: number;
    type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'POLL' | 'FILE' | 'SUMMARY';
    content: string;
    mediaUrls: string[];
    pollOptions: IPoll[];
    replyTo?: {
      messageId: mongoose.Types.ObjectId;
      senderId: number;
    };
    reactions: IReaction[];
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
}
  