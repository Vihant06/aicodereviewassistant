import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ChatBubble({
  message,
  sender,
}: {
  message: string;
  sender: "user" | "assistant";
}) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      } w-full my-2 items-end`}
    >
      {sender === "assistant" && (
        <Image
          src="/icon.jpg"
          alt="AI Avatar"
          width={32}
          height={32}
          className="rounded-full mr-2"
        />
      )}
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md transition-all duration-200 ${
          sender === "user"
            ? "bg-blue-600 text-white rounded-br-md hover:bg-blue-700"
            : "bg-zinc-100 text-zinc-900 rounded-bl-md hover:bg-zinc-200"
        } whitespace-pre-wrap break-words text-sm md:text-base`}
        style={{ wordBreak: "break-word" }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
              [key: string]: any;
            }) {
              const match = /language-(\w+)/.exec(className || "");
              // Remove 'ref' from props to avoid linter error
              const { ref, ...rest } = props;
              return !inline ? (
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match ? match[1] : ""}
                  PreTag="div"
                  className="rounded-lg text-xs md:text-sm"
                  {...rest}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className="bg-zinc-200 text-zinc-900 rounded px-1 py-0.5 text-xs md:text-sm"
                  {...rest}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              // If the only child is a code block, just render the code block
              if (
                Array.isArray(children) &&
                children.length === 1 &&
                (children[0] as any)?.type?.name === "code"
              ) {
                return <>{children}</>;
              }
              return <p>{children}</p>;
            },
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
      {sender === "user" &&
        (user && user.image ? (
          <Image
            src={user.image}
            alt={user.name || user.email || "User"}
            width={32}
            height={32}
            className="rounded-full ml-2"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-700 text-white font-bold ml-2">
            {user && user.name
              ? user.name[0]
              : user && user.email
              ? user.email[0]
              : "U"}
          </div>
        ))}
    </div>
  );
}
