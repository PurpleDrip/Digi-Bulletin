import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TriangleAlertIcon } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { useSocket } from "@/context/SocketContext";
import { Separator } from "../ui/separator";

type MessageType = {
  _id: string;
  serverId: number;
  senderUSN: number;
  senderName?: string;
  title?: string;
  content: string;
  type: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  createdAt: string;
  reactionCounts?: { UPVOTE?: number; DOWNVOTE?: number };
};

type ChatPanelProps = {
  serverId: number;
  serverName?: string;
  serverAbout?: string;
  serverOwnerId?: number;
  userUSN?: String;
  allowAnonymous?: boolean;
};

function useServerMessages(serverId: number | null) {
  return useQuery<MessageType[]>({
    queryKey: ["messages", serverId],
    queryFn: async () => {
      if (!serverId) return [];
      const res = await fetch(`http://localhost:5000/api/message/get-messages?serverId=${serverId}`, {
        credentials: "include",
      });
      const json = await res.json();
      console.log("Fetched messages:", json);
      return json.messages;
    },
    enabled: !!serverId,
    staleTime: 60 * 1000,
  });
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  serverId,
  serverName,
  serverAbout,
  serverOwnerId,
  userUSN,
  allowAnonymous,
}) => {
  const socket = useSocket();
  const { data: messages = [], refetch: refetchMessages } = useServerMessages(serverId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Real-time updates (Socket.IO)
  useEffect(() => {
    if (!socket || !serverId) return;

    socket.emit("join_server", { serverId, senderUSN: userUSN });

    const handleNewMessage = () => refetchMessages();
    const handleMessageReacted = () => refetchMessages();

    socket.on("new_message", handleNewMessage);
    socket.on("message_reacted", handleMessageReacted);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_reacted", handleMessageReacted);
    };
  }, [socket, serverId, userUSN, refetchMessages]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Send message (Socket.IO only)
  const sendMessage = useMutation({
    mutationFn: async ({
      message,
      image,
      isAnonymous,
      title,
      isPoll,
      pollOptions,
    }: {
      message?: string;
      image?: File | null;
      isAnonymous?: boolean;
      title?: string;
      isPoll?: boolean;
      pollOptions?: string[];
    }) => {
      if (!socket) return;
      if (isPoll && pollOptions && pollOptions.length > 0) {
        socket.emit("message", {
          serverId,
          senderUSN: userUSN,
          type: "POLL",
          content: "",
          pollOptions,
          isAnonymous: !!isAnonymous,
        });
      } else {
        socket.emit("message", {
          serverId,
          senderUSN: userUSN,
          type: "TEXT",
          content: message,
          title,
          isAnonymous: !!isAnonymous,
        });
      }
    },
  });

  // React to a message
  const handleReact = (messageId: string, type: "UPVOTE" | "DOWNVOTE") => {
    if (!socket) return;
    socket.emit("react", { messageId, type });
  };

  return (
    <div className="flex flex-col h-full border rounded-3xl border-gray-800 p-2">
      {/* Server Info */}
      <div className="border rounded-xl px-4 py-2 bg-red-500/50 flex items-center justify-between border-red-800">
        <section>
          <h1 className="md:text-2xl font-bold">
            {serverName}
            <span className="text-sm pl-2 text-red-300">
              created by #{serverOwnerId}
            </span>
          </h1>
          <h2 className="text-sm text-red-200 pl-2">{serverAbout}</h2>
        </section>
        <section>
          <button className="rounded-xl px-2 py-1 md:px-4 md:py-2 bg-red-600 text-xs md:text-sm flex gap-1 items-center hover:bg-red-500/20">
            <TriangleAlertIcon size={16} />
            Report
          </button>
        </section>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="mb-8 flex flex-col items-start relative min-w-max max-w-[30vw] bg-zinc-800/50 px-4 py-2 rounded-3xl border border-zinc-700"
          >
            {/* First line: User name or ID */}
              <div className="flex items-center justify-between w-full">
                {msg.title && (
                  <span className={`italic text-xs mr-auto border px-2 rounded-xl
                    ${msg.title==="WARNING" ? "text-yellow-400 bg-yellow-400/30" :
                      msg.title==="ALERT" ? "text-red-400 bg-red-400/30" :
                      msg.title==="INFO" ? "text-blue-400 bg-blue-400/30" :
                      "text-green-400 bg-green-400/30"
                    }`}>
                    {msg.title.toLowerCase()}
                  </span>
                )}
                <div className="ml-auto">
                  <h1 className="text-xs text-zinc-500">Id - {msg._id}</h1>
                </div>
              </div>
            {/* Second line: Title */}
            <span className="text-md text-red-400">
              {msg.isAnonymous
                ? "Anonymous"
                : msg.senderUSN
                ? msg.senderUSN
                : `User`}
            </span>
            <Separator className="mt-2" />
            {/* Third line: Message */}
            <div className="w-fit max-w-lg py-2 mt-1 rounded-lg text-gray-100 shadow">
              {msg.content}
            </div>
            {/* Votes bottom right */}
            <div className="flex gap-4 mt-1 absolute right-4 bottom-0 bg-zinc-800 rounded-full px-2 py-1 translate-x-1/2 translate-y-1/2 border border-zinc-700">
              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => handleReact(msg._id, "DOWNVOTE")}
              >
                ▼ {msg.reactionCounts?.DOWNVOTE || 0}
              </button>
              <button
                className="text-green-400 hover:text-green-300"
                onClick={() => handleReact(msg._id, "UPVOTE")}
              >
                ▲ {msg.reactionCounts?.UPVOTE || 0}
              </button>
              
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={async (data) => sendMessage.mutateAsync(data)} 
        allowAnonymous={allowAnonymous}
        userUSN={userUSN}
        />
    </div>
  );
};
