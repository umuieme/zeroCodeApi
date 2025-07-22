// export const getUserId = (request: Request): string => "6877b06963cc4fa7c97eac98";

import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const getUserId = (request: NextRequest | Request): string => {
  const req = request instanceof Request ? 
    new NextRequest(request.url, { headers: request.headers }) : 
    request;

  const { userId } = getAuth(req);
  
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  console.log("Authenticated user ID:", userId);
  return userId;
};