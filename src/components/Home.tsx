// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (name.trim()) {
      const encodedName = encodeURIComponent(name);
      router.push(`/chat?name=${encodedName}`);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold text-center">Welcome to PingMe 💬</h1>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="w-full" onClick={handleJoin}>
          Join Chat
        </Button>
      </div>
    </main>
  );
}