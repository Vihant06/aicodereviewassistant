"use client";
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ChatSummary {
  _id: string;
  title: string;
  updatedAt: string;
}

interface SidebarProps {
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
}

export default function Sidebar({ onNewChat, onSelectChat }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user && user.email) {
      fetch(`/api/chat?userId=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setChats(data);
        });
    }
  }, [user]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900 p-2 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-white" />
        )}
      </button>
      <aside
        className={`flex flex-col h-full w-72 min-w-[220px] bg-zinc-900 text-white shadow-lg rounded-r-2xl p-4 md:static fixed z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* App Name */}
        <div className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight select-none">
          <span className="text-blue-400">CodeMuse</span>
          <span className="text-xs bg-blue-500 text-white rounded px-2 py-0.5 ml-2">
            AI
          </span>
        </div>
        {/* New Chat Button */}
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-4 py-2 rounded-xl shadow mb-6"
          onClick={onNewChat}
        >
          <PlusIcon className="h-5 w-5" />
          New Code Review
        </button>
        {/* User Profile Section */}
        {user && (
          <div className="flex items-center gap-3 mb-6">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || user.email || "User"}
                width={40}
                height={40}
                className="rounded-full border border-zinc-700 shadow"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
                {user.name ? user.name[0] : user.email ? user.email[0] : "U"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-base text-zinc-100 truncate">
                {user.name || user.email}
              </span>
              <span className="text-xs text-zinc-400 truncate">You</span>
            </div>
          </div>
        )}
        {/* Past Chats */}
        <div className="flex-1 overflow-y-auto">
          <div className="text-xs text-zinc-400 mb-2">Past Chats</div>
          <ul className="space-y-2">
            {user &&
              chats.map((chat) => (
                <li
                  key={chat._id}
                  className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg px-3 py-2 flex items-center gap-2 shadow cursor-pointer"
                  onClick={() => onSelectChat && onSelectChat(chat._id)}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-sm text-zinc-100 truncate">
                      {chat.title}
                    </span>
                    <span className="text-xs text-zinc-400 truncate">
                      {user.name || user.email}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(chat.updatedAt).toLocaleString()}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        {/* User Info & Settings */}
        {user && user.email && (
          <div className="mt-6 flex items-center gap-3 border-t border-zinc-700 pt-4">
            <UserCircleIcon className="h-8 w-8 text-zinc-400" />
            <div className="flex-1">
              <div className="font-semibold text-sm">
                {user.name || user.email}
              </div>
              <div className="text-xs text-zinc-400">AI Reviewer</div>
            </div>
            <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
              <Cog6ToothIcon className="h-6 w-6 text-zinc-400" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
