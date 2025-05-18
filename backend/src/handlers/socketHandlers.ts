import { Server, Socket } from "socket.io";
import Message, { IMessage } from "../models/Message";
import prisma from "../lib/prisma";

interface JoiningData {
    serverId: number;
    userId: number;
}

interface MessageData {
    serverId: number;
    content: string;
    type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'POLL' | 'FILE' | 'SUMMARY';
    mediaUrls?: string[];
    pollOptions?: { option: string }[];
    replyTo?: { messageId: string; senderId: number };
    isAnonymous?: boolean;
}

const registerSocketHandlers = (socket: Socket, io: Server) => {
    socket.on('join-server', async (data: JoiningData) => {
        try {
            // Verify server exists and user has access
            const server = await prisma.server.findFirst({
                where: {
                    id: data.serverId,
                    audience: {
                        groups: {
                            some: {
                                OR: [
                                    { usns: { has: data.userId.toString() } },
                                    {
                                        AND: [
                                            { include: true },
                                            {
                                                userType: {
                                                    equals: await prisma.user.findUnique({
                                                        where: { id: data.userId },
                                                        select: { type: true }
                                                    }).then(user => user?.type)
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            });

            if (!server) {
                socket.emit('error', 'Server not found or access denied');
                return;
            }

            socket.join(data.serverId.toString());
            socket.data.userId = data.userId; // Store userId in socket data
            console.log(`🟢 ${socket.id} joined server ${data.serverId}`);
            
            // Load recent messages
            const recentMessages = await Message.find({ serverId: data.serverId })
                .sort({ createdAt: -1 })
                .limit(50)
                .exec();
            
            socket.emit('recent-messages', recentMessages);
            
            // Notify others
            socket.to(data.serverId.toString()).emit('user-joined', {
                userId: data.userId,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error joining server:', error);
            socket.emit('error', 'Failed to join server');
        }
    });

    socket.on('send-message', async (msg: MessageData) => {
        try {
            // Create and save message to MongoDB
            const message = new Message({
                ...msg,
                senderId: socket.data.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await message.save();

            // Broadcast to everyone in the server
            io.to(msg.serverId.toString()).emit('new-message', message);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Failed to send message');
        }
    });
    
    socket.on('leave-server', async ({ serverId }: { serverId: number }) => {
        await socket.leave(serverId.toString());
        console.log(`🟡 ${socket.id} left server ${serverId}`);
        
        // Notify others
        socket.to(serverId.toString()).emit('user-left', {
            userId: socket.data.userId,
            timestamp: new Date()
        });
    });
};

export { registerSocketHandlers };