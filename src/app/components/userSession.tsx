import { useAuth } from "@clerk/nextjs";

const UserSession = () => {
  const { user, isLoaded, isSignedIn } = useAuth();

  // Wait until the authentication state is loaded
  if (!isLoaded) return <p>Loading...</p>;

  // If the user is not signed in
  if (!isSignedIn) return <p>No user found. Please sign in.</p>;

  // If the user is signed in, display user info
  return (
    <div>
      <h2>User Info</h2>
      <p>Email: {user.email}</p>
      <p>First Name: {user.firstName}</p>
    </div>
  );
};

export default UserSession;
