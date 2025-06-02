import React, { useState } from "react";
import { Send, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type ChatInputProps = {
  onSend: (data: {
    message?: string;
    title?: string;
    isAnonymous?: boolean;
  }) => Promise<void>;
  onSendPoll: (data: {
    question: string;
    options: string[];
    isAnonymous?: boolean;
    title?: string;
  }) => Promise<void>;
  allowAnonymous?: boolean;
  userUSN?: string;
};

export function ChatInput({
  onSend,
  onSendPoll,
  allowAnonymous = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  // Send regular message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    await onSend({ message, title, isAnonymous });
    setMessage("");
    setTitle("");
  };

  // Send poll
  const handlePollSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = pollOptions.filter((opt) => opt.trim() !== "");
    if (!pollQuestion || options.length < 2) return;
    await onSendPoll({ question: pollQuestion, options, isAnonymous, title });
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setTitle("");
  };

  return (
    <div>
      {/* Poll Modal */}
      {showPoll && (
        <form
          className="border border-white/20 rounded-lg p-4 mb-2 bg-background"
          onSubmit={handlePollSend}
        >
          <div className="font-semibold mb-2 flex justify-between items-center">
            
            <div>
              <span className="text-2xl text-red-500">Create a Poll</span>
              <h1 className="text-sm text-gray-400 font-normal">Enter the question and options for your poll. At least two options are required.</h1>
            </div>
            <button
              type="button"
              className="text-xs text-red-400 border border-red-400 rounded px-2 py-1 ml-2 hover:bg-red-900/30"
              onClick={() => setShowPoll(false)}
            >
              Exit Poll Mode
            </button>
          </div>
          <div className="grid w-full gap-3 mt-8">
            <Label htmlFor="message" className="text-red-500/80">Poll Question</Label>
            <Textarea placeholder="Type your question here." id="message" className="bg-inherit"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}/>
          </div>
          <h1 className="font-semibold mt-4 text-red-500/80">Options</h1>
          {pollOptions.map((opt, idx) => (
            <div className="flex items-center gap-2 mb-1" key={idx}>
              <Input
                type="text"
                className="mt-4 flex-1 rounded px-2 py-1 text-sm outline-none"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) =>
                  setPollOptions((prev) =>
                    prev.map((o, i) => (i === idx ? e.target.value : o))
                  )
                }
              />
              {pollOptions.length > 2 && (
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() =>
                    setPollOptions((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-red-400 text-xs"
            onClick={() => setPollOptions((prev) => [...prev, ""])}
          >
            + Add Option
          </button>
          <div className="flex gap-2 mt-4 justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="w-32 rounded bg-muted px-2 py-1 text-xs outline-none"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {allowAnonymous && (
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous((v) => !v)}
                  />
                  Anonymous
                </label>
              )}
            </div>
              <button
                type="submit"
                className={`bg-red-500/40 border border-red-500/20 text-white rounded px-2 py-1 text-md font-semibold `}
              >
                Create Poll
              </button>
            </div>

        </form>
      )}

      {/* Regular Chat Input */}
      {!showPoll && (
        <form
          className="flex gap-2 items-center px-4 py-2 bg-background border border-zinc-700 rounded-full"
          onSubmit={handleSend}
        >
          <input
            type="text"
            className="flex-1 rounded-full bg-muted px-3 py-2 text-sm outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <input
            type="text"
            className="w-32 rounded bg-muted px-2 py-1 text-xs outline-none"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {allowAnonymous && (
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous((v) => !v)}
              />
              Anonymous
            </label>
          )}
          <button
            type="button"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs"
            onClick={() => setShowPoll(true)}
          >
            <PlusCircle size={16} />
            Poll
          </button>
          <button
            type="submit"
            className="p-1"
            disabled={!message}
          >
            <Send className="w-5 h-5 text-primary" />
          </button>
        </form>
      )}
    </div>
  );
}
