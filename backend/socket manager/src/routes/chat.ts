import { Socket } from "socket.io";

export const chatRoutes = (socket: Socket, io: any): void => {
    socket.on("message",(data:any)=>{
        try {
            if (!data.serverId || !data.userId || !data.message) {
                socket.emit('error', 'Invalid data');
                return;
            }

            // Broadcast the message to the server room
            io.to(data.serverId.toString()).emit('new-message', {
                userId: data.userId,
                message: data.message,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Failed to send message');
        }
    });
}