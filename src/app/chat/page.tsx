"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { useTheme } from "@/lib/theme-provider";

function ChatPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name")?.trim();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!name) router.push("/");
  }, [name, router]);

  if (!name) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <div className="text-red-500 text-center text-lg">
          Name is missing in query params.
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100"
      }`}
    >
      <div className="w-full sm:w-3/6 -mt-14">
        <ChatWindow username={name} />
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading chat...</div>}>
      <ChatPageInner />
    </Suspense>
  );
}
