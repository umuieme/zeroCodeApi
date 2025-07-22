import dbConnect from "@/lib/db/dbConnect";
import Project from "@/models/Project";
import { createProjectSchema } from "@/lib/validation/projectSchemaValidator";
import { formatZodError } from "@/lib/validation/validationErrorFormatter";
import { NextResponse } from "next/server";
import { getUserId } from "../helper/userHelper";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = getUserId(request);
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    body.userId = getUserId(request);
    console.log("Creating project with data:", body);
    const parsed = createProjectSchema.safeParse(body);
    console.log("Parsed project data:", parsed);
    if (!parsed.success) {
      console.log("Project validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Validation failed", issues: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    console.log("Creating project with validated data:", parsed.data);
    const newProject = await Project.create(parsed.data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
