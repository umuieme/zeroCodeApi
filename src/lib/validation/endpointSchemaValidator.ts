import { z } from 'zod';
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

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
    schema: z.any(),
})
    .openapi({ description: "Schema for creating a new endpoint" });
