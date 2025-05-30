import { useRef, useState } from "react";
import { Paperclip, Mic, Send } from "lucide-react";

export function ChatInput({ onSend }:{
    onSend: (data: { message?: string; image?: File | null; audio?: File | null }) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  // Text input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  // File/image attachment handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  // Audio recording handlers
  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    recorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/webm" });
      setAudio(new File([audioBlob], "voice-note.webm"));
      chunks.current = [];
    };
    recorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
  };

  // Send handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message && !image && !audio) return;
    await onSend({ message, image, audio });
    setMessage("");
    setImage(null);
    setAudio(null);
  };

  return (
    <form className="flex gap-2 items-center px-4 py-2 bg-background border border-zinc-700 rounded-full" onSubmit={handleSend}>
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
      {/* Voice Note */}
      <button
        type="button"
        className="p-1"
        onClick={recording ? stopRecording : startRecording}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        <Mic className={recording ? "text-red-500 animate-pulse" : "text-muted-foreground"} />
      </button>
      {/* Text Input */}
      <input
        type="text"
        className="flex-1 rounded-full bg-muted px-3 py-2 text-sm outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={handleInputChange}
        autoComplete="off"
      />
      {/* Send Button */}
      <button type="submit" className="p-1" disabled={!message && !image && !audio}>
        <Send className="w-5 h-5 text-primary" />
      </button>
      {/* Preview for attachments */}
      {image && (
        <div className="ml-2">
          <img src={URL.createObjectURL(image)} alt="preview" className="w-8 h-8 object-cover rounded" />
        </div>
      )}
      {audio && (
        <div className="ml-2">
          <audio controls src={URL.createObjectURL(audio)} className="w-24" />
        </div>
      )}
    </form>
  );
}
