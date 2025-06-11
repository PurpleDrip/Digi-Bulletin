import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bot, TriangleAlertIcon } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { useSocket } from "@/context/SocketContext";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "react-toastify";

type PollOption = {
  option: string;
  votes: Array<{
    userUSN: string;
    votedAt: string;
  }>;
};

type MessageType = {
  _id: string;
  serverId: number;
  senderUSN: string;
  senderName?: string;
  title?: string;
  content: string;
  type: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  createdAt: string;
  pollOptions?: PollOption[];
  reactionCounts?: { UPVOTE?: number; DOWNVOTE?: number };
};

type ChatPanelProps = {
  serverId: number;
  serverName?: string;
  serverAbout?: string;
  serverType?: string;
  serverOwnerId?: number;
  userUSN?: string;
  allowAnonymous?: boolean;
};

function useServerMessages(serverId: number | null) {
  return useQuery<MessageType[]>({
    queryKey: ["messages", serverId],
    queryFn: async () => {
      if (!serverId) return [];
      const res = await fetch(
        `http://15.207.20.226:3001/api/messages/get-messages?serverId=${serverId}`,
        { credentials: "include" }
      );
      const json = await res.json();
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
  serverType,
}) => {
  const socket = useSocket();
  const { data: messages = [], refetch: refetchMessages } = useServerMessages(serverId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const seminarToastId = useRef<string | number | null>(null);

    const handleShowSummary = () => {
    if (serverType !== "SEMINAR") return;
    if (seminarToastId.current !== null) return; 
    seminarToastId.current = toast.info(
      <div>
        <div className="font-bold mb-4">Seminar Summary</div>
        <div className="text-gray-300">
          This seminar covered the fundamentals of React, including hooks, state management, and component lifecycle. We also discussed best practices for building scalable applications.
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-zinc-900 text-white rounded-lg shadow-lg mt-28",
        onClose: () => {
          seminarToastId.current = null;
        }
      }
    );
  };

  // Real-time updates (Socket.IO)
  useEffect(() => {
    if (!socket || !serverId) return;

    socket.emit("join_server", { serverId, senderUSN: userUSN });

    const handleNewMessage = () => refetchMessages();
    const handleMessageReacted = () => refetchMessages();
    const handlePollUpdated = () => refetchMessages();

    socket.on("new_message", handleNewMessage);
    socket.on("message_reacted", handleMessageReacted);
    socket.on("poll_updated", handlePollUpdated);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_reacted", handleMessageReacted);
      socket.off("poll_updated", handlePollUpdated);
    };
  }, [socket, serverId, userUSN, refetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (serverType !== "SEMINAR" && seminarToastId.current !== null) {
      toast.dismiss(seminarToastId.current);
      seminarToastId.current = null;
    }
  }, [serverType]);

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
        socket.emit("poll", {
          serverId,
          senderUSN: userUSN,
          title,
          question: message,
          options: pollOptions,
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

  // Vote on a poll
  const handleVote = (messageId: string, optionIndex: number) => {
    if (!socket) return;
    socket.emit("vote_poll", { messageId, optionIndex });
  };

  // Helper: find which option the user voted for
  const getUserPollVote = (msg: MessageType) => {
    if (!msg.pollOptions || !userUSN) return undefined;
    return msg.pollOptions.findIndex(opt =>
      opt.votes && opt.votes.some(vote => vote.userUSN === userUSN)
    );
  };

  return (
    <div className="flex flex-col h-full border rounded-3xl border-zinc-700 p-2">
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
      <div className="flex-1 overflow-y-auto px-2 py-4 relative">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-8 flex flex-col items-start relative min-w-max max-w-[30vw] bg-zinc-800/50 px-4 py-2 rounded-3xl border
              ${msg.senderUSN === userUSN ? "border-red-700" : "border-zinc-700"}`}
          >
            {/* Title and MsgId */}
            <div className="flex items-center justify-between w-full">
              {msg.title && (
                <span className={`italic text-xs mr-auto border px-2 rounded-xl
                  ${msg.title === "WARNING" ? "text-yellow-400 bg-yellow-400/30" :
                    msg.title === "ALERT" ? "text-red-400 bg-red-400/30" :
                    msg.title === "INFO" ? "text-blue-400 bg-blue-400/30" :
                    "text-green-400 bg-green-400/30"
                  }`}>
                  {msg.title.toLowerCase()}
                </span>
              )}
              <div className="ml-auto">
                <h1 className="text-xs text-zinc-500">Msg Id - {msg._id}</h1>
              </div>
            </div>
            {/* Sender */}
            <span className="text-md text-red-400">
              {msg.isAnonymous
                ? "Anonymous"
                : msg.senderUSN
                ? msg.senderUSN
                : `User`}
            </span>
            <Separator className="mt-2" />
            {/* Message or Poll */}
            {msg.type === "POLL" && msg.pollOptions ? (
              <div className="w-full py-2 rounded-lg text-gray-100 bg-inherit px-4 my-4 shadow-2xl">
                <div className="font-bold text-red-500/80">{msg.content || "Poll"}</div>
                <Separator className="my-4 bg-white/20"/>
                {msg.pollOptions.map((opt, idx) => {
                  const userVoted = getUserPollVote(msg) === idx;
                  return (
                    <div key={idx} className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-400">{opt.option}</span>
                      <button
                        className={`rounded px-2 py-1 text-xs border
                          ${userVoted
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-zinc-700 text-white border-zinc-600 hover:bg-green-700"
                          }`}
                        onClick={() => handleVote(msg._id, idx)}
                        disabled={userVoted}
                      >
                        {userVoted ? "Voted" : "Vote"}
                      </button>
                      <span className="text-xs text-gray-400 ml-auto">
                        {opt.votes?.length || 0} votes
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-fit max-w-lg py-2 mt-1 rounded-lg text-gray-100 shadow">
                {msg.content}
              </div>
            )}
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
      {serverType==="SEMINAR" &&
      (<div className="absolute bottom-20 right-10 border rounded-full p-2 cursor-pointer border-red-500/40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span onClick={handleShowSummary}>
                <Bot />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Summarize this seminar with AI.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>)}

      <ChatInput
        onSend={async (data) => sendMessage.mutateAsync(data)}
        allowAnonymous={allowAnonymous}
        userUSN={userUSN}
        onSendPoll={async (data) => {
          socket?.emit("poll", {
            ...data,
            serverId,
            senderUSN: userUSN,
          });
        }}
      />
    </div>
  );
};
