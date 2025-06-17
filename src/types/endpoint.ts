export type EndpointInfo = {
    name: string;
    endpoint: string;
    description?: string;
};

export type SchemaField = {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required: boolean;
};

export type Endpoint = {
  _id: string;
  projectId: string;
  name: string;
  endpoint: string;
  description?: string;
  schema: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

