import React, { useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const modePrompts = {
  "Explain Code":
    "You are a senior software engineer. Explain the code step-by-step in simple terms. Be concise and clear.",
  "Find Bugs":
    "You're an expert code reviewer. Carefully analyze the code and highlight any bugs or potential issues with line references.",
  Optimize:
    "You are a performance optimization specialist. Suggest improvements to make the code more efficient or readable.",
  "Check Style":
    "You are a code style guide enforcer. Review the code against common style conventions and suggest formatting fixes.",
  "Security Review":
    "You're a security expert. Identify any potential security flaws or vulnerabilities in this code, and suggest fixes.",
};
const modeOptions = Object.keys(modePrompts);

interface InputBoxProps {
  onSend: (msg: string, mode: string) => void;
  disabled?: boolean;
}

export default function InputBox({ onSend, disabled }: InputBoxProps) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<string>(modeOptions[0]);
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
        onSend(value, mode);
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value, mode);
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-end gap-2 bg-zinc-900/95 rounded-xl shadow-md p-2 w-full">
        {/* Mode Selector integrated into input */}
        <div className="flex flex-col items-center justify-end mr-2">
          <label
            htmlFor="mode-select"
            className="text-[10px] font-medium text-zinc-400 mb-1"
          >
            Mode
          </label>
          <select
            id="mode-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
          >
            {modeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-transparent outline-none p-2 text-zinc-100 rounded-xl min-h-[40px] max-h-40 focus:ring-2 focus:ring-blue-400 placeholder:text-zinc-400"
          placeholder="Type your message..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 shadow transition-colors flex items-center justify-center disabled:opacity-50"
          aria-label="Send"
          type="button"
          disabled={disabled || !value.trim()}
        >
          <PaperAirplaneIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
