import { SchemaField } from "@/types/endpoint";

export const convertFieldsToJsonSchema = (fields: SchemaField[]): any => {
    // Return a default empty schema if fields is null, undefined, or empty
    if (!fields || fields.length === 0) {
        return {
            type: "object",
            properties: {},
        };
    }

    const schema = {
        type: "object",
        properties: fields.reduce((acc, field) => {
            if (field.type === 'date') {
                // Use the standard format: type "string" with format "date"
                acc[field.name] = { type: 'string', format: 'date' };
            } else {
                acc[field.name] = { type: field.type };
            }
            return acc;
        }, {} as Record<string, any>),
        required: fields.filter(f => f.required).map(f => f.name),
    };

    return schema;
};