// lib/docs/generateOpenApi.ts
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { createEndpointSchema } from "../validation/endpointSchemaValidator";
import z from "zod";

export function generateOpenAPISpec() {
    const registry = new OpenAPIRegistry();

    registry.registerPath({
        method: "post",
        path: "/api/projects/{projectId}/endpoints",
        summary: "Create a new endpoint",
        tags: ["Endpoints"],
        request: {
            params: z.object({
                projectId: z.string().openapi({ description: "The ID of the project" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: createEndpointSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Endpoint created successfully",
            },
            400: {
                description: "Validation error",
            },
        },
    });

     registry.registerPath({
        method: "get",
        path: "/api/projects/{projectId}/endpoints",
        summary: "Get all endpoint for a project",
        tags: ["Endpoints"],
        request: {
            params: z.object({
                projectId: z.string().openapi({ description: "Project ID" }),
            }),
        },
        responses: {
            200: { description: "Endpoint list" },
            404: { description: "Project not found" },
        },
    });


    registry.registerPath({
        method: "get",
        path: "/api/projects/{projectId}/endpoints/{endpointId}",
        summary: "Get an endpoint by ID",
        tags: ["Endpoints"],
        request: {
            params: z.object({
                projectId: z.string().openapi({ description: "Project ID" }),
                endpointId: z.string().openapi({ description: "Endpoint ID" }),
            }),
        },
        responses: {
            200: { description: "Endpoint details" },
            404: { description: "Endpoint not found" },
        },
    });

    registry.registerPath({
        method: "put",
        path: "/api/projects/{projectId}/endpoints/{endpointId}",
        summary: "Update an existing endpoint",
        tags: ["Endpoints"],
        request: {
            params: z.object({
                projectId: z.string(),
                endpointId: z.string(),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: createEndpointSchema,
                    },
                },
            },
        },
        responses: {
            200: { description: "Endpoint updated" },
            400: { description: "Validation error" },
            404: { description: "Not found" },
        },
    });

    registry.registerPath({
        method: "delete",
        path: "/api/projects/{projectId}/endpoints/{endpointId}",
        summary: "Delete an endpoint",
        tags: ["Endpoints"],
        request: {
            params: z.object({
                projectId: z.string(),
                endpointId: z.string(),
            }),
        },
        responses: {
            200: { description: "Endpoint deleted" },
            404: { description: "Not found" },
        },
    });

    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "ZeroCodeApi",
            version: "1.0.0",
            description: "API documentation for ZeroCodeApi core routes",
        },
    });
}
