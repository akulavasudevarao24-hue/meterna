import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecommendation } from "@/context/RecommendationContext";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const location = useLocation();
  const { results } = useRecommendation();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedChat: ChatMessage[] = [
      ...chat,
      { role: "user", text: message },
    ];

    setChat(updatedChat);
    setMessage("");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updatedChat.map((msg) => ({
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.text,
        })),
        currentPage: location.pathname,
        recommendationData: results,
      }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      { role: "ai", text: data.reply },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border shadow-lg rounded-lg p-3 z-[9999]">
      <div className="h-60 overflow-y-auto mb-2">
        {chat.map((msg, i) => (
          <div key={i} className="text-sm mb-1">
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-3 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}