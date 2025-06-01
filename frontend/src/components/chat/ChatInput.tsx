import { useState } from "react";
import { Paperclip, Send, PlusCircle } from "lucide-react";

export function ChatInput({
  onSend,
  userUSN,
  allowAnonymous,
}: {
  onSend: (data: {
    message?: string;
    image?: File | null;
    isAnonymous?: boolean;
    title?: string;
    isPoll?: boolean;
    pollOptions?: string[];
  }) => Promise<void>;
  userUSN?: String;
  allowAnonymous?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  // Handle poll option changes
  const handlePollOptionChange = (idx: number, value: string) => {
    setPollOptions((prev) =>
      prev.map((opt, i) => (i === idx ? value : opt))
    );
  };
  const addPollOption = () => setPollOptions((prev) => [...prev, ""]);
  const removePollOption = (idx: number) =>
    setPollOptions((prev) => prev.filter((_, i) => i !== idx));

  // File/image attachment handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  // Send handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showPoll) {
      const validOptions = pollOptions.filter((o) => o.trim() !== "");
      if (validOptions.length < 2) return;
      await onSend({
        isPoll: true,
        pollOptions: validOptions,
      });
      setShowPoll(false);
      setPollOptions(["", ""]);
    } else {
      if (!message && !image) return;
      await onSend({ message, image, isAnonymous, title });
      setMessage("");
      setImage(null);
      setTitle("");
    }
  };

  return (
    <form
      className="flex flex-col gap-2 px-4 py-2 bg-background border border-zinc-700 rounded-xl"
      onSubmit={handleSend}
    >
      {/* Poll Creation Modal */}
      {showPoll && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-2">
          <div className="font-semibold mb-2">Create a Poll</div>
          {pollOptions.map((opt, idx) => (
            <div className="flex items-center gap-2 mb-1" key={idx}>
              <input
                type="text"
                className="flex-1 rounded bg-muted px-2 py-1 text-sm outline-none"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handlePollOptionChange(idx, e.target.value)}
              />
              {pollOptions.length > 2 && (
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removePollOption(idx)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-blue-400 text-xs"
            onClick={addPollOption}
          >
            + Add Option
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center">
        {/* File/Image Attach */}
        <label className="cursor-pointer">
          <Paperclip className="w-5 h-5 text-muted-foreground" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {/* Title */}
        <input
          type="text"
          className="w-32 rounded bg-muted px-2 py-1 text-xs outline-none"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Anonymous toggle */}
        {allowAnonymous && (
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous((v) => !v)}
          />
          Anonymous
        </label>)}
        {/* Create Poll */}
        <button
          type="button"
          className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs"
          onClick={() => setShowPoll((v) => !v)}
        >
          <PlusCircle size={16} />
          Poll
        </button>
        {/* Send Button */}
        <button
          type="submit"
          className="ml-auto p-1"
          disabled={
            (!message && !image && !showPoll) ||
            (showPoll && pollOptions.filter((o) => o.trim() !== "").length < 2)
          }
        >
          <Send className="w-5 h-5 text-primary" />
        </button>
        {/* Preview for attachments */}
        {image && (
          <div className="ml-2">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-8 h-8 object-cover rounded"
            />
          </div>
        )}
      </div>
      {/* Message input (hide if poll) */}
      {!showPoll && (
        <input
          type="text"
          className="flex-1 rounded-full bg-muted px-3 py-2 text-sm outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
        />
      )}
    </form>
  );
}
