import dbConnect from "@/lib/db/dbConnect";
import { createEndpointSchema } from "@/lib/validation/endpointSchemaValidator";
import { formatZodError } from "@/lib/validation/validationErrorFormatter";
import Endpoint from "@/models/Endpoint";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

/**
 * Type definition for route parameters when handling specific endpoint operations.
 */
type EndpointParams = {
  params: {
    projectId: string;
    endpointId: string;
  };
};

/**
 * Handles GET requests to fetch a single endpoint by ID within a project.
 * Route: GET /api/projects/[projectId]/endpoints/[endpointId]
 */
export async function GET(request: Request, context: EndpointParams) {
  try {
    await dbConnect();
    const { projectId, endpointId } = context.params;

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(endpointId)) {
      return NextResponse.json({ error: "Invalid Project ID or Endpoint ID" }, { status: 400 });
    }

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
    console.error("GET /api/projects/[projectId]/endpoints/[endpointId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch endpoint" },
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to update a single endpoint by ID within a project.
 * Route: PUT /api/projects/[projectId]/endpoints/[endpointId]
 */
export async function PUT(request: Request, context: EndpointParams) {
  try {
    await dbConnect();
    const { projectId, endpointId } = context.params;

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(endpointId)) {
      return NextResponse.json({ error: "Invalid Project ID or Endpoint ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = createEndpointSchema.safeParse(body);

    if (!parsed.success) {
      console.log("Endpoint update validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Validation failed", issues: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { name, description, endpoint, schema } = parsed.data;
    const updated = await Endpoint.findOneAndUpdate(
      {
        _id: new Types.ObjectId(endpointId),
        projectId: new Types.ObjectId(projectId),
      },
      { name, description, endpoint, schema },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Endpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[projectId]/endpoints/[endpointId] error:", error);
    return NextResponse.json({ error: "Failed to update endpoint" }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to delete a single endpoint by ID within a project.
 * Route: DELETE /api/projects/[projectId]/endpoints/[endpointId]
 */
export async function DELETE(request: Request, context: EndpointParams) {
  try {
    await dbConnect();
    const { projectId, endpointId } = context.params;

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(endpointId)) {
      return NextResponse.json({ error: "Invalid Project ID or Endpoint ID" }, { status: 400 });
    }

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
    return NextResponse.json({ success: true, message: "Endpoint deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[projectId]/endpoints/[endpointId] error:", error);
    return NextResponse.json({ error: "Failed to delete endpoint" }, { status: 500 });
  }
}
