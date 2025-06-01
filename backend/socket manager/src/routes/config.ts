import { Server, Socket } from "socket.io";

type JoinServerMessage = {
  serverId: number;
  senderId: number;
};

export const configRoutes = (socket: Socket, io: Server): void => {
    socket.on("join_server", (data: JoinServerMessage) => { 
        try {
            if (!data.serverId || !data.senderId) {
                socket.emit('error', 'Invalid serverId or userId');
                return;
            }
            
            socket.join(data.serverId.toString());
            socket.data.userId = data.senderId;
            console.log(`🟢 ${socket.id} joined server ${data.serverId}`);
            
            io.to(data.serverId.toString()).emit('user_joined', { 
                userId: data.senderId,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Join server error:', error);
            socket.emit('error', 'Failed to join server');
        }
    });
}
