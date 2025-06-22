"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/lib/theme-provider";
import { useChatSocket } from "@/hooks/useChatSocket";
import DarkButton from "./DarkButton";
import { Send, SkipForward } from "lucide-react";

interface ChatWindowProps {
    username: string;
}

export default function ChatWindow({ username }: ChatWindowProps) {
    const [message, setMessage] = useState("");
    const { darkMode } = useTheme();
    const { messages, sendMessage, isWaiting, skipUser } = useChatSocket(username);

    const handleSend = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage("");
    };

    return (

        <div className={`rounded-2xl shadow-xl p-4 max-w-xl w-full h-[80vh] flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Chatting as {username}</h2>
                <DarkButton />
            </div>

            {isWaiting ? (
                <p className="text-yellow-500">⏳ Waiting for a stranger to join...</p>
            ) : (
                <p className="text-green-500">✅ Connected to a stranger!</p>
            )}

            <ScrollArea className={`flex-1 border rounded-md p-2  overflow-y-auto ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 mt-2  rounded-xl max-w-[80%] break-words ${msg.user === username
                            ? darkMode
                                ? "ml-auto bg-blue-600 text-white"
                                : "ml-auto bg-blue-200"
                            : darkMode
                                ? "bg-gray-700"
                                : "bg-gray-200"
                            }`}
                    >
                        <span className="block text-xs font-medium">{msg.user}</span>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </ScrollArea>
            <div className="mt-2 flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} disabled={isWaiting} className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 md:hidden" />
                    <span className="hidden md:inline">Send</span>
                </Button>

                <Button onClick={skipUser} className="flex items-center justify-center gap-2">
                    <SkipForward className="w-4 h-4 md:hidden" />
                    <span className="hidden md:inline">Skip</span>
                </Button>

            </div>
        </div>
    );
}