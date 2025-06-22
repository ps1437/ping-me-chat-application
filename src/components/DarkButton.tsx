"use client";

import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun } from "lucide-react";

export default function DarkButton() {
  const { darkMode, toggleTheme } = useTheme();

  return (
   
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {darkMode ? (
          <Sun className="h-6 w-6 text-yellow-400" />
        ) : (
          <Moon className="h-6 w-6 text-gray-800" />
        )}
      </button>
 
  );
}
