import dbConnect from "@/lib/db/dbConnect";
import Endpoint from "@/models/Endpoint";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import Ajv from "@rjsf/validator-ajv8/node_modules/ajv/dist/core";
import addFormats from "ajv-formats";
import { getUserId } from "@/app/api/helper/userHelper";
import { verifyEndpoint } from "../route";

const ajv = new Ajv({strict: false});
addFormats(ajv);


type ProjectEndpointParams = {
  params: {
    projectId: string;
    endpointId: string;
  };
};

// static for now, need to update after auth merging



export async function GET(request: Request, context: ProjectEndpointParams) {
  try {
    await dbConnect();

    const { projectId, endpointId } = await context.params;
    const userId = getUserId(request);
    const endpoint = await verifyEndpoint(userId, projectId, endpointId);
    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
    }
    return NextResponse.json(endpoint.data || []);

  } catch (error) {
    console.error("GET /api/projects/[projectId]/endpoints/[endpointId]/data error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

}

export async function POST(request: Request, context: ProjectEndpointParams) {
  try {
    await dbConnect();

    const { projectId, endpointId } = await context.params;

    const userId = getUserId(request);
    await dbConnect();
    console.log("POST zzzz", projectId, endpointId, userId);
    const endpoint = await verifyEndpoint(userId, projectId, endpointId);
    console.log("Endpoint found:", endpoint);
    if (!endpoint || !endpoint.jsonSchema) {
      return NextResponse.json({ error: "Endpoint or schema not found" }, { status: 404 });
    }
    const body = await request.json();
    const validate = ajv.compile(endpoint.jsonSchema);
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
    }

    if (!validate(body)) {
      return NextResponse.json({ error: "Data validation failed", details: validate.errors }, { status: 400 });
    }

    const newDataItem = {
      ...(body as Record<string, any>),
      _id: randomUUID()
    };
    await Endpoint.updateOne(
      { _id: endpoint._id },
      { $push: { data: newDataItem } }
    );

    return NextResponse.json(newDataItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

}


