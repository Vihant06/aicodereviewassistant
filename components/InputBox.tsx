import React, { useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface InputBoxProps {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

export default function InputBox({ onSend, disabled }: InputBoxProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value);
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value);
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="flex items-end gap-2 bg-white/80 rounded-xl shadow-md p-2">
      <textarea
        ref={textareaRef}
        className="flex-1 resize-none bg-transparent outline-none p-2 text-zinc-900 rounded-xl min-h-[40px] max-h-40 focus:ring-2 focus:ring-blue-400"
        placeholder="Type your message..."
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 shadow transition-colors flex items-center justify-center disabled:opacity-50"
        aria-label="Send"
        type="button"
        disabled={disabled || !value.trim()}
      >
        <PaperAirplaneIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
