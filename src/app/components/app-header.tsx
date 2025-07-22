'use client';

import { User } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import LogoutButton from "./logoutButton";

interface AppHeaderProps {
  onNewProjectClick: () => void; 
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
        <button
          onClick={onNewProjectClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          + New Project
        </button>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-700 rounded-full p-2">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                  userButtonTrigger: "text-white focus:shadow-none"
                }
              }}
            />
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}