import { Server, Socket } from "socket.io";

type JoinServerMessage = {
  serverId: number;
  senderUSN: String;
};

export const configRoutes = (socket: Socket, io: Server): void => {
    socket.on("join_server", (data: JoinServerMessage) => { 
        try {
            if (!data.serverId || !data.senderUSN) {
                socket.emit('error', 'Invalid serverId or userId');
                return;
            }
            
            socket.join(data.serverId.toString());
            socket.data.userUSN = data.senderUSN;
            console.log(`🟢 ${socket.id} joined server ${data.serverId}`);
            
            io.to(data.serverId.toString()).emit('user_joined', { 
                userUSN: data.senderUSN,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Join server error:', error);
            socket.emit('error', 'Failed to join server');
        }
    });
}
