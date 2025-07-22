import { getUserId, validateUserProjectAccess } from "@/app/api/helper/userHelper";
import dbConnect from "@/lib/db/dbConnect";
import { createEndpointSchema } from "@/lib/validation/endpointSchemaValidator";
import { formatZodError } from "@/lib/validation/validationErrorFormatter";
import Endpoint from "@/models/Endpoint";
import Project from "@/models/Project";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

type ProjectEndpointParams = {
  params: {
    projectId: string;
  };
};

export async function GET(req: Request, context: ProjectEndpointParams) {
  const { projectId } = await context.params;
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  try {
    await dbConnect();
    const userId = getUserId(req);
    validateUserProjectAccess(userId, projectId);

    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const projectExists = await Project.exists({ _id: projectId });
    if (!projectExists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const filter: any = { projectId };
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const total = await Endpoint.countDocuments(filter);
    const endpoints = await Endpoint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      data: endpoints,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request, context: ProjectEndpointParams) {
  const { projectId } = await context.params;

  try {
    await dbConnect();
    const userId = getUserId(req);
    await validateUserProjectAccess(userId, projectId);
    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await req.json();
    body.projectId = new Types.ObjectId(projectId);
    body.userId = userId;
    console.log("Creating endpoint with data:", body);
    const parsed = createEndpointSchema.safeParse(body);
    console.log("Parsed endpoint data:", parsed);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: formatZodError(parsed.error),
        },
        { status: 400 }
      );
    }
    console.log("zz: ",parsed.data.jsonSchema, { depth: null });

    console.log("Creating endpoint with validated data:", parsed.data);
    const newEndpoint = await Endpoint.create({
      ...parsed.data,
    });

    return NextResponse.json(newEndpoint, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/[projectId]/endpoints error:", error);
    return NextResponse.json(
      { error: "Failed to create endpoint" },
      { status: 500 }
    );
  }
}
