import React from "react";

export default function ChatHeader({ title }: { title?: string }) {
  return (
    <header className="w-full px-6 py-4 border-b border-zinc-200 bg-white/60 backdrop-blur-md shadow-md flex items-center rounded-t-2xl">
      <h2 className="text-lg font-semibold text-zinc-900 truncate">
        {title || "New Chat"}
      </h2>
    </header>
  );
}
