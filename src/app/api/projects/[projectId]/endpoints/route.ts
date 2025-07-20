import { getUserId } from "@/app/api/helper/userHelper";
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

export async function GET(
  _: Request, // Request object is not used directly, hence '_'
  context: ProjectEndpointParams
) {
  const { projectId } = await context.params;

  try {
    await dbConnect();
    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
    }

    // TODO: Add project existence check here if necessary
    // const projectExists = await Project.findById(projectId);
    // if (!projectExists) {
    //   return NextResponse.json({ error: "Project not found" }, { status: 404 });
    // }

    console.log("Fetching endpoints for projectId: %s", projectId);

    const endpoints = await Endpoint.find({
      projectId: new Types.ObjectId(projectId),
    });

    return NextResponse.json(endpoints);
  } catch (error) {
    console.error("GET /api/projects/[projectId]/endpoints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: ProjectEndpointParams
) {
  await dbConnect(); // Ensure DB connection is established
  try {
    const { projectId } = context.params;

    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
    }

    const body = await request.json();
    body.userId = getUserId(request); 
    const parsed = createEndpointSchema.safeParse(body);

    if (!parsed.success) {
      console.log("Endpoint validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Validation failed", issues: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const newEndpoint = await Endpoint.create({
      ...parsed.data,
      projectId: new Types.ObjectId(projectId),
    });

    return NextResponse.json(newEndpoint, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/[projectId]/endpoints error:", error);
    return NextResponse.json({ error: "Failed to create endpoint" }, { status: 500 });
  }
}
