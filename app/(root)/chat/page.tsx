"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import ChatHeader from "../../../components/ChatHeader";
import ChatBubble from "../../../components/ChatBubble";
import InputBox from "../../../components/InputBox";
import Particles from "../../../components/Particles";
import { useRouter } from "next/navigation";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    sender: "assistant",
    content:
      "Hello! I'm CodeMuse, your AI code review assistant. Paste your code to get started!",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-save chat after each message (except initial assistant message)
  useEffect(() => {
    if (!user || messages.length < 2) return;
    const save = async () => {
      const title =
        messages[1]?.content?.slice(0, 40) ||
        `Chat ${new Date().toLocaleString()}`;
      const res = await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.email,
          title,
          messages: messages.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatId(data._id);
        setChatTitle(data.title);
      }
    };
    save();
  }, [messages, user]);

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    const userMsg = {
      id: messages.length + 1,
      role: "user",
      sender: "user",
      content: msg,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (res.headers.get("content-type")?.includes("text/event-stream")) {
        // Streaming response
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream reader");
        let partial = "";
        let done = false;
        let assistantMsgId = newMessages.length + 1;
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            sender: "assistant",
            content: "",
          },
        ]);
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = new TextDecoder().decode(value);
            chunk.split("\n").forEach((line) => {
              if (line.startsWith("data: ")) {
                const data = line.replace("data: ", "").trim();
                if (data === "[DONE]") return;
                try {
                  const json = JSON.parse(data);
                  const delta = json.choices?.[0]?.delta?.content;
                  if (delta) {
                    partial += delta;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: partial } : m
                      )
                    );
                  }
                } catch (e) {}
              }
            });
          }
        }
      } else {
        // Fallback: non-streaming
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              role: "assistant",
              sender: "assistant",
              content: data.reply,
            },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          sender: "assistant",
          content: "Sorry, there was an error contacting the AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages(initialMessages);
    setChatTitle("New Chat");
    setChatId(null);
  };

  const handleSelectChat = async (id: string) => {
    if (!user) return;
    const res = await fetch(
      `/api/chat/${id}?userId=${encodeURIComponent(user.email)}`
    );
    if (res.ok) {
      const data = await res.json();
      setMessages(
        data.messages.map((m: any, idx: number) => ({
          id: idx + 1,
          role: m.role,
          sender: m.role,
          content: m.content,
        }))
      );
      setChatTitle(data.title);
      setChatId(data._id);
    }
  };

  return (
    <div className="relative min-h-screen flex bg-transparent">
      {/* Particles background */}
      <div className="absolute inset-0 -z-10">
        <Particles />
      </div>
      {/* Sidebar */}
      <Sidebar onNewChat={handleNewChat} onSelectChat={handleSelectChat} />
      {/* Main chat area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <ChatHeader title={chatTitle} />
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-transparent"
        >
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              sender={msg.sender as "user" | "assistant"}
              message={msg.content}
            />
          ))}
          {loading && <ChatBubble sender="assistant" message="Thinking..." />}
        </div>
        <div className="px-4 pb-4 pt-2 bg-transparent">
          <InputBox onSend={handleSend} disabled={loading} />
        </div>
      </main>
    </div>
  );
}
