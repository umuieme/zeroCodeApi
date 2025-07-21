import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",    
        height: "100vh",          
        flexDirection: "column",
      }}
    >
      <SignIn routing="hash" />
    </div>
  );
};

export default SignInPage;
