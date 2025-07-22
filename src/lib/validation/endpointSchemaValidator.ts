import { z } from 'zod';
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import mongoose, { Types } from 'mongoose';

extendZodWithOpenApi(z);
export const jsonSchemaValidator = z.object({
    type: z.literal("object"),
    properties: z.record(
        z.object({
            type: z.enum(["string", "number", "boolean", "integer", "date", "array", "object"]),
            format: z.string().optional(), // for "email", "date-time", etc.
        })
    ),
    required: z.array(z.string()).optional(),
    additionalProperties: z.boolean().optional(),
})
    .openapi({ description: "JSON schema defining the structure of the data for this endpoint" });

export const createEndpointSchema = z.object({
    name: z.string().min(1, "Name is required").describe("Endpoint name"),
    description: z.string().optional().describe("Optional description"),
    endpoint: z.string().min(1, "Endpoint is required").describe("Path like /users"),
    projectId: z.instanceof(mongoose.Types.ObjectId).describe("Mongoose ObjectId of the project"),
    userId: z.string().min(1, "User ID is required").describe(" ID of the user creating the endpoint"),
    jsonSchema: z.any(),
    data: z.array(z.any()).default([]),
})
    .openapi({ description: "Schema for creating a new endpoint" });

export const updateEndpointSchema = z.object({
    
    name: z.string().min(1, "Name is required").describe("Endpoint name"),
    description: z.string().optional().describe("Optional description"),
    endpoint: z.string().min(1, "Endpoint is required").describe("Path like /users"),
    jsonSchema: z.any(),
    data: z.array(z.any()).default([]),
})
    .openapi({ description: "Schema for updating an existing endpoint" });
