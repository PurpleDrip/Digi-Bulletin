import { Server, Socket } from "socket.io";
import Message, { MessageDocument } from "../models/Message";

type MessageType={
    serverId:number,
    senderId:number,

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

export const chatRoutes = (socket: Socket, io: Server): void => {
    socket.on("message",async (data:MessageType)=>{
        console.log(`🟢 ${socket.id} sent a message to server ${data.serverId}`);
        try {
            const message=await Message.create(data);

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
                { $pull: { reactions: { userId:socket.data.userId } } }
            );
            // Add the new reaction
            const result = await Message.updateOne(
                { _id: data.messageId },
                { $push: { reactions: { type:data.type, userId:socket.data.userId } } }
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
    })
}