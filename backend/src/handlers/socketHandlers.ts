import { Server, Socket } from "socket.io"
import { MessageDocument } from "../models/Message"

type joiningData={
    serverId:string,
    userId:string
}

const registerSocketHandlers=(socket:Socket,io:Server)=>{
    socket.on('join-server',(data:joiningData)=>{
        socket.join(data.serverId);
        console.log(`🟢 ${socket.id} joined server ${data.serverId}`);
    })

    socket.on('send-message', (msg: any) => {
        console.log("Sent message: ",msg)
        io.to(msg.roomId).emit("message", { msg, senderId: msg.senderId });
    });
    
    socket.on('leave-server', ({ serverId }: { serverId: string }) => {
        socket.leave(serverId);
        console.log(`🟡 ${socket.id} left server ${serverId}`);
    });
}

export {registerSocketHandlers}