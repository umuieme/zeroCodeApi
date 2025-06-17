import dbConnect from "@/lib/db/dbConnect";
import { createEndpointSchema } from "@/lib/validation/endpointSchemaValidator";
import { formatZodError } from "@/lib/validation/validationErrorFormatter";
import Endpoint from "@/models/Endpoint";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

type ProjectEndpointParams = {
  params: {
    projectId: string;
  }
}

export async function GET(_: Request, context: ProjectEndpointParams) {
  const { projectId } = await context.params;

  try {
    await dbConnect();
    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // later add project existence check
   
    console.log("Fetching endpoints for projectId: %s", projectId);

    const endpoints = await Endpoint.find({
      projectId: new Types.ObjectId(projectId),
    });

    return NextResponse.json(endpoints);
  } catch (error) {
    console.error("GET /endpoints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: ProjectEndpointParams) {
  await dbConnect();
  try {
      const { projectId } = await context.params;

    const body = await request.json();
    const parsed = createEndpointSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error);
      
      return NextResponse.json(
        { error: "Validation failed", data: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const newEndpoint = await Endpoint.create({
      ...parsed.data,
      projectId: new Types.ObjectId(projectId),
      
    });

    return NextResponse.json(newEndpoint, { status: 201 });
  } catch (error) {
    console.error("POST /endpoints error:", error);
    return NextResponse.json({ error: "Failed to create endpoint" }, { status: 500 });
  }
}
