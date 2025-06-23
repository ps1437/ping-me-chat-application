"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/lib/theme-provider";
import { useChatSocket } from "@/hooks/useChatSocket";
import DarkButton from "./DarkButton";
import { Send, SkipForward } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import type { Theme } from "emoji-picker-react";

interface ChatWindowProps {
    username: string;
}

export default function ChatWindow({ username }: ChatWindowProps) {
    const [message, setMessage] = useState("");
    const { darkMode } = useTheme();
    const { messages, sendMessage, isWaiting, skipUser, userCount } = useChatSocket(username);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage("");
        setShowEmojiPicker(false);

    };

    const handleEmojiClick = (emojiData: any) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    return (

        <div className={`rounded-2xl shadow-xl p-4 max-w-xl w-full h-[80vh] flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-xl font-semibold">Chatting as {username}</h2>

                </div>
                <DarkButton />
            </div>

            <div className="flex justify-between items-center mb-2 text-sm">
                {isWaiting ? (
                    <p className="text-yellow-500">⏳ Waiting for a stranger to join...</p>
                ) : (
                    <p className="text-green-500">✅ Connected to a stranger!</p>
                )}
                <p className="text-gray-500 dark:text-gray-400 font-bold">Active: {userCount}</p>
            </div>

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
            <div className="relative w-full">
                {showEmojiPicker && (
                    <div className="absolute bottom-14 left-0 z-10">
                        <EmojiPicker
                            theme={(darkMode ? "dark" : "light") as Theme}
                            onEmojiClick={handleEmojiClick}
                            height={350}
                            width={280}
                        />
                    </div>
                )}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="px-2"
                    >
                        <Smile className="w-5 h-5" />
                    </Button>

                    <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1"
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

        </div>
    );
}