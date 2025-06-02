import { Server, Socket } from "socket.io";
import Message, { MessageDocument } from "../models/Message";

type MessageType={
    serverId:number,
    senderUSN:String,

    type:MessageDocument['type'],
    title?: MessageDocument['title'],
    content?: MessageDocument['content'],
    mediaUrls?: MessageDocument['mediaUrls'],
    pollOptions?: MessageDocument['pollOptions'],
    reactions?: MessageDocument['reactions'],
    replyTo?: {
        messageId: MessageDocument['_id'],
        senderId: number
    },
    isAnonymous?: boolean,
}

type ReactionType={
    messageId: MessageDocument['_id'],
    type: MessageDocument['reactions'][0]['type']
}

type PollType = {
    serverId: number,
    senderUSN: string,
    title?: string,
    question: string,
    options: string[],
    isAnonymous?: boolean,
}

type VotePollType = {
    messageId: MessageDocument['_id'],
    optionIndex: number,
}

export const chatRoutes = (socket: Socket, io: Server): void => {
    socket.on("message",async (data:MessageType)=>{
        console.log(`🟢 ${socket.id} sent a message to server ${data.serverId}`);
        try {
            const message=await Message.create({
                ...data,
                title: data.title || undefined,
            });

            io.to(data.serverId.toString()).emit('new_message',message );
        } catch (error) {
            console.log('Error sending message:', error);
            socket.emit('error', 'Failed to send message');
        }
    });

    socket.on("react",async (data:ReactionType)=>{
        console.log(`🟢 ${socket.id} reacted to a message`);
        try{
            await Message.updateOne(
                { _id: data.messageId },
                { $pull: { reactions: { userUSN:socket.data.userUSN } } }
            );
            // Add the new reaction
            const result = await Message.updateOne(
                { _id: data.messageId },
                { $push: { reactions: { type:data.type, userUSN:socket.data.userUSN } } }
            );

            if (result.modifiedCount > 0) {
                // Fetch the updated message to emit
                const updatedMessage = await Message.findById(data.messageId);
                if (updatedMessage) {
                    io.to(updatedMessage.serverId.toString()).emit('message_reacted', updatedMessage);
                }   
            }
        }catch(err){
            console.log('Error reacting to message:', err);
            socket.emit('error', 'Failed to react to message');
        }
    });

    socket.on("poll", async (data: PollType) => {
        console.log(`🟢 ${socket.id} created a poll in server ${data.serverId}`);
        try {
            const pollOptions = data.options.map(option => ({
                option,
                votes: []
            }));

            const message = await Message.create({
                serverId: data.serverId,
                senderUSN: data.senderUSN,
                type: "POLL",
                title: data.title || undefined,
                content: data.question,
                pollOptions,
                isAnonymous: data.isAnonymous || false,
                reactions: [],
            });

            io.to(data.serverId.toString()).emit('new_message', message);
        } catch (error) {
            console.log('Error creating poll:', error);
            socket.emit('error', 'Failed to create poll');
        }
    });

    socket.on("vote_poll", async (data: VotePollType) => {
        console.log(`🟢 ${socket.id} voted on poll ${data.messageId}`);
        try {
            const userUSN = socket.data.userUSN;
            
            await Message.updateOne(
                { _id: data.messageId },
                { 
                    $pull: { 
                        "pollOptions.$[].votes": { userUSN } 
                    } 
                }
            );

            const result = await Message.updateOne(
                { 
                    _id: data.messageId,
                    [`pollOptions.${data.optionIndex}`]: { $exists: true }
                },
                { 
                    $push: { 
                        [`pollOptions.${data.optionIndex}.votes`]: {
                            userUSN,
                            votedAt: new Date()
                        }
                    } 
                }
            );

            if (result.modifiedCount > 0) {
                const updatedMessage = await Message.findById(data.messageId);
                if (updatedMessage) {
                    io.to(updatedMessage.serverId.toString()).emit('poll_updated', updatedMessage);
                }
            } else {
                socket.emit('error', 'Invalid poll option or poll not found');
            }
        } catch (err) {
            console.log('Error voting on poll:', err);
            socket.emit('error', 'Failed to vote on poll');
        }
    });
}