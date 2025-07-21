import { useAuth } from "@clerk/nextjs";

const LogoutButton = () => {
  const { signOut } = useAuth();

  return <button onClick={() => signOut()}>Log Out</button>;
};

export default LogoutButton;
