import dbConnect from "@/lib/db/dbConnect";
import { createEndpointSchema, updateEndpointSchema } from "@/lib/validation/endpointSchemaValidator";
import Endpoint from "@/models/Endpoint";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

type ProjectEndpointParams = {
  params: {
    projectId: string;
    endpointId: string;
  };
};

export async function verifyEndpoint(userId: string, projectId: string, endpointId: string) {
  return await Endpoint.findOne({ _id: endpointId, projectId: projectId, userId: userId });
}

export async function GET(request: Request, context: ProjectEndpointParams) {
  try {
    await dbConnect();
    const { projectId, endpointId } = await context.params;
    const endpoint = await Endpoint.findOne({
      _id: new Types.ObjectId(endpointId),
      projectId: new Types.ObjectId(projectId),
    });
    if (!endpoint) {
      return NextResponse.json(
        { message: "Endpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(endpoint);
  } catch (error) {
    console.error("GET /endpoints/:id error:", error);
    return NextResponse.json(
      { error: "Failed to fetch endpoint" },
      { status: 500 }
    );
  }

}

export async function PUT(request: Request, context: ProjectEndpointParams) {
  try {
    await dbConnect();
    const { projectId, endpointId } = await context.params;
    const body = await request.json();
    
    console.log("PUT /endpoints/:id body:", body);

    const parsed = updateEndpointSchema.safeParse(body);
    console.log("Parsed data:1", parsed.error);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    console.log("Updating endpoint with data:", parsed.data);
    const { name, description, endpoint, jsonSchema } = parsed.data;
    const updated = await Endpoint.findOneAndUpdate({
      _id: new Types.ObjectId(endpointId),
      projectId: new Types.ObjectId(projectId),
    }, { name, description, endpoint, jsonSchema }, { new: true });
    if (!updated) {
      return NextResponse.json(
        { message: "Endpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /endpoints/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update endpoint" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: ProjectEndpointParams) {
  await dbConnect();
  const { projectId, endpointId } = await context.params;
  const deleted = await Endpoint.findOneAndDelete({
    _id: new Types.ObjectId(endpointId),
    projectId: new Types.ObjectId(projectId),
  });
  if (!deleted) {
    return NextResponse.json(
      { message: "Endpoint not found" },
      { status: 404 }
    );

  }
  return NextResponse.json({ success: true, message: "Endpoint deleted" });

}