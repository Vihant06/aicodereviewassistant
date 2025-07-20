"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/sign-up", label: "Sign Up" },
  { href: "/sign-in", label: "Sign In" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-gray-800 shadow-sm font-sans">
      <nav
        className="container mx-auto flex items-center justify-between px-4"
        style={{ minHeight: "68px" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={36}
            height={36}
            priority
            className="h-9 w-auto object-contain ml-1 rounded-md shadow-sm"
          />
        </Link>
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-white font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/chat">Chat</Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link href="/sign-up">Sign Up</Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-blue-400 hover:text-blue-600"
                >
                  Sign In
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || user.email || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-zinc-700 shadow"
                  />
                )}
                <span>{user.name ? user.name : user.email}</span>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-400 hover:text-red-600"
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center px-2 py-1 border border-gray-700 rounded transition-colors hover:bg-gray-800"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>
      {/* Mobile Nav */}
      <div
        className={`md:hidden bg-black shadow transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ pointerEvents: menuOpen ? "auto" : "none" }}
      >
        <ul className="flex flex-col gap-2 px-4 pb-4 pt-2 text-white font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-2 px-2 rounded-md hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li className="flex items-center gap-2 px-2 py-2">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || user.email || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-zinc-700 shadow"
                  />
                )}
                <span>{user.name ? user.name : user.email}</span>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left text-red-400 hover:text-red-600 py-2"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/sign-in"
                className="w-full block text-left text-blue-400 hover:text-blue-600 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
