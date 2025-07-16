import dbConnect from "@/lib/db/dbConnect";
import Project from "@/models/Project";
import { createProjectSchema } from "@/lib/validation/projectSchemaValidator";
import { formatZodError } from "@/lib/validation/validationErrorFormatter";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

type ProjectParams = {
  params: { projectId: string };
};

export async function GET(_: Request, { params }: ProjectParams) {
  try {
    const { projectId } = await params; 
    await dbConnect();

    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[projectId] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: ProjectParams) {
  try {
    const { projectId } = await params; // Await params

    await dbConnect();

    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      console.log("Project update validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Validation failed", issues: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const updated = await Project.findByIdAndUpdate(projectId, parsed.data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[projectId] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: ProjectParams) {
  try {
    const { projectId } = await params; // Await params

    await dbConnect();

    if (!Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const deleted = await Project.findByIdAndDelete(projectId);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[projectId] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
