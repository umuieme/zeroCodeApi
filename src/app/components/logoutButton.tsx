'use client';

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = () => {
    signOut().then(() => router.push("/signin"));
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
    >
      Sign Out
    </button>
  );
}