import { Socket } from "socket.io";

export const configRoutes = (socket: Socket, io: any): void => {
    socket.on("connect",(data:connectMessage)=>{
        try {
            if (!data.serverId || !data.senderId) {
                socket.emit('error', 'Invalid serverId or userId');
                return;
            }
            
            // Join the server room
            socket.join(data.serverId.toString());
            socket.data.userId = data.senderId; // Store.senderId in socket data
            console.log(`🟢 ${socket.id} joined server ${data.serverId}`);
            
            // Notify others
            socket.to(data.serverId.toString()).emit('user-joined', {
                senderId: data.senderId,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error connecting to server:', error);
            socket.emit('error', 'Failed to connect to server');
        }
    });
}