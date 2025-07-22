// export const getUserId = (request: Request): string => "6877b06963cc4fa7c97eac98";

import dbConnect from "@/lib/db/dbConnect";
import Endpoint from "@/models/Endpoint";
import Project from "@/models/Project";
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

export const validateUserProjectAccess = async (userId: string, projectId: string) => {
  await dbConnect();
  const project = await Project.findById(projectId);
  if (!project || project.userId.toString() !== userId) {
    throw new Error("User does not have access to this project");

  }
}

export const validateUserEndpointAccess = async (userId: string, projectId: string, endpointId: string) => {
  await dbConnect();
  const endpoint = await Endpoint.findOne({ _id: endpointId, projectId, userId });
  if (!endpoint) {
    throw new Error("Endpoint not found or access denied");
  }
  return endpoint;
};