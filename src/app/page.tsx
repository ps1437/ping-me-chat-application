"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import DarkButton from "@/components/DarkButton";
import Lottie from "lottie-react";
import chatAnimation from "@/../public/home.json";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { darkMode } = useTheme();

  const handleJoin = (event:any) => {
    event.preventDefault();
    if (name.trim()) {
      const encodedName = encodeURIComponent(name);
      router.push(`/chat?name=${encodedName}`);
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100"
      }`}
    >
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 max-w-5xl w-full justify-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <Lottie
            animationData={chatAnimation}
            loop={true}
            className="w-60 h-60 md:w-80 md:h-80"
          />
        </div>

<form   onSubmit={handleJoin}

          className={`rounded-2xl shadow-xl p-8 w-full md:w-1/2 space-y-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Welcome to PingMe 💬</h1>
            
            <DarkButton />
          </div>

          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="w-full" type="submit" >
            Join Chat
          </Button>
       </form>
      </div>
      
    </main>
  );
}
