// src/app/api/projects/[projectId]/data/[endpointId]/[dataId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Endpoint from "@/models/Endpoint";
// Use the specific import path from your example
import Ajv from "@rjsf/validator-ajv8/node_modules/ajv/dist/core";
import addFormats from "ajv-formats";
// Assume this helper function exists at the specified path
import { getUserId } from "@/app/api/helper/userHelper";
import { verifyEndpoint } from "../../route";
import { isObject } from "@/lib/validation/validator";

const ajv = new Ajv({ strict: false });
addFormats(ajv);

type ProjectEndpointDataParams = {
  params: {
    projectId: string;
    endpointId: string;
    dataId: string;
  };
};

export async function PUT(request: Request, context: ProjectEndpointDataParams) {
    try {
        await dbConnect();
        const { projectId, endpointId, dataId } = await context.params;
        const userId = getUserId(request);

        const endpoint = await verifyEndpoint(userId, projectId, endpointId);
        if (!endpoint || !endpoint.schema) {
            return NextResponse.json({ error: "Endpoint or schema not found" }, { status: 404 });
        }

        const body: any = await request.json();
        if (!isObject(body)) {
            return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
        }

        const validate = ajv.compile(endpoint.schema);
        if (!validate(body)) {
            return NextResponse.json({ error: "Data validation failed", details: validate.errors }, { status: 400 });
        }

        const updatedDataItem = { ...(body as Record<string, any>), _id: dataId };

        const result = await Endpoint.updateOne(
            { _id: endpointId, "data._id": dataId },
            { $set: { "data.$": updatedDataItem } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Data entry not found" }, { status: 404 });
        }

        return NextResponse.json(updatedDataItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: ProjectEndpointDataParams) {
    try {
        await dbConnect();
        const { projectId, endpointId, dataId } = await context.params;
        const userId = getUserId(request);

        const endpoint = await verifyEndpoint(userId, projectId, endpointId);
        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
        }

        const result = await Endpoint.updateOne(
            { _id: endpointId },
            { $pull: { data: { _id: dataId } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "Data entry not found or already deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Data deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
    }
}
