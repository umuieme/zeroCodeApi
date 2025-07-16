'use client'; // This directive is necessary for client-side interactivity like click handlers

import { User } from "lucide-react";
import Image from "next/image";

// Define the props that AppHeader will accept
interface AppHeaderProps {
  onNewProjectClick: () => void; // A function that will be called when the button is clicked
}

export default function AppHeader({ onNewProjectClick }: AppHeaderProps) {
  return (
    <header className="w-full flex bg-neutral-900 text-white justify-between shadow-sm px-4 py-2">
      <Image
        src="/svg/horizontal_logo.svg"
        width={150}
        height={50}
        alt="Logo"
      />
      <div className="flex items-center gap-4">
        {/* Attach the onNewProjectClick function to the button's onClick event */}
        <button
          onClick={onNewProjectClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + New Project
        </button>
        <div className="flex bg-gray-700 rounded-full p-2">
          <User size={32} />
        </div>
      </div>
    </header>
  );
}
