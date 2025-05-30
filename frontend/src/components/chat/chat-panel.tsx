import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatInput } from "./ChatInput";
import { AlertCircle, TriangleAlert, TriangleAlertIcon } from "lucide-react";

export function ChatPanel({ serverId, messages, refetchMessages, socket, serverName, serverAbout, serverOwnerId }:{
    serverId: number;
    messages: any[];
    serverName?: string;
    serverAbout?:string;
    serverOwnerId?: number;
    refetchMessages: () => void;
    socket?: any;
}) {
  const queryClient = useQueryClient();

  // Send message mutation (REST or Socket.IO)
  const sendMessage = useMutation({
    mutationFn: async ({ message, image, audio }:{
        message?: string;
        image?: File | null;
        audio?: File | null;
        serverId: number;
    }) => {
      const formData = new FormData();
      formData.append("serverId", serverId as any);
      if (message) formData.append("content", message);
      if (image) formData.append("image", image);
      if (audio) formData.append("audio", audio);

      // Send via REST
      await fetch("/api/messages", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      // Or emit via Socket.IO:
      // socket.emit("send-message", { serverId, message, image, audio });

      // Optionally: refetch messages or rely on real-time update
      refetchMessages();
    },
  });

  return (
    <div className="flex flex-col h-full border rounded-3xl border-gray-800 p-2">
      {/* Server Info */}
      <div className="border rounded-xl px-4 py-2 bg-red-500/50 flex items-center justify-between border-red-800">
        {/* Server Info */}
        <section>
          <h1 className="md:text-2xl font-bold">{serverName}
            <span className="text-sm pl-2 text-red-300">created by #{serverOwnerId}</span>
          </h1>
          <h2 className="text-sm text-red-200 pl-2">{serverAbout}</h2>
        </section> 
        <section>
          <button className="rounded-xl px-2 py-1 md:px-4 md:py-2 bg-red-600 text-xs md:text-sm flex gap-1 items-center hover:bg-red-500/20">
            <TriangleAlertIcon size={16}/>
            Report</button>
        </section>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {/* Render messages here */}
        {messages.map((msg:any) => (
          <div key={msg._id} className="mb-2">
            <span className="font-semibold">{msg.senderName}:</span> {msg.content}
            {msg.imageUrl && <img src={msg.imageUrl} alt="attachment" className="w-32 mt-1 rounded" />}
            {msg.audioUrl && (
              <audio controls src={msg.audioUrl} className="mt-1 w-48" />
            )}
          </div>
        ))}
      </div>
      <ChatInput
        onSend={async (data) =>
          sendMessage.mutateAsync({ ...data, serverId })
        }
      />
    </div>
  );
}
