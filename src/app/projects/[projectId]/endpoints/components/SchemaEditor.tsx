// src/components/endpoints/SchemaEditor.tsx
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { SchemaField } from "@/types/endpoint"; // Assuming this type is defined as { name: string; type: string; required: boolean; }

// Zod schema for validating a single field. It's co-located with the component that uses it.
const fieldSchema = z.object({
    name: z.string().min(1, "Field name is required").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Must start with a letter or _, and only contain letters, numbers, and _."),
    type: z.enum(["string", "number", "boolean", "date"]),
    required: z.boolean(),
});

type SchemaEditorProps = {
    // The initial schema object from your endpoint data
    initialSchema: any;
    // Callback function to be executed when the user clicks save
    onSave: (newSchema: any) => Promise<void>;
    // Prop to control the disabled state of the save button from the parent
    isSaving: boolean;
};

export default function SchemaEditor({ initialSchema, onSave, isSaving }: SchemaEditorProps) {
    const [fields, setFields] = useState<SchemaField[]>([]);
    const [newField, setNewField] = useState<SchemaField>({ name: "", type: "string", required: false });
    const [error, setError] = useState("");

    // When the component loads or initialSchema changes, populate the fields state
    useEffect(() => {
        const initialFields = initialSchema?.properties ? Object.entries(initialSchema.properties).map(([name, props]: [string, any]) => ({
            name,
            type: props.type,
            required: initialSchema.required?.includes(name) || false,
        })) : [];
        setFields(initialFields);
    }, [initialSchema]);

    const handleAddField = () => {
        const result = fieldSchema.safeParse(newField);
        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }
        if (fields.some(f => f.name === newField.name)) {
            setError("Field name must be unique.");
            return;
        }
        setError("");
        setFields([...fields, newField]);
        setNewField({ name: "", type: "string", required: false });
    };

    const handleDeleteField = (fieldName: string) => {
        setFields(fields.filter(f => f.name !== fieldName));
    };

    const handleSave = () => {
        // Convert the local 'fields' array state back into the JSON Schema object format
        const newSchemaObject = {
            type: "object",
            properties: fields.reduce((acc, field) => {
                acc[field.name] = { type: field.type };
                return acc;
            }, {} as Record<string, { type: string }>),
            required: fields.filter(f => f.required).map(f => f.name),
        };
        console.log("Saving new schema object:", fields);
        console.log("Saving new schema:", newSchemaObject);
        // Call the onSave prop provided by the parent component
        onSave(newSchemaObject);
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="p-3 text-left font-medium">Field Name</th>
                            <th className="p-3 text-left font-medium">Type</th>
                            <th className="p-3 text-left font-medium">Required</th>
                            <th className="p-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map(field => (
                            <tr key={field.name} className="border-t">
                                <td className="p-3 font-mono">{field.name}</td>
                                <td className="p-3">{field.type}</td>
                                <td className="p-3">{field.required ? "Yes" : "No"}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => handleDeleteField(field.name)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {/* Form to add new field */}
                        <tr className="border-t bg-gray-50 dark:bg-gray-800">
                            <td className="p-3"><input type="text" placeholder="Field Name" value={newField.name} onChange={e => setNewField({ ...newField, name: e.target.value })} className="w-full p-1 border rounded bg-white dark:bg-gray-700" /></td>
                            <td className="p-3">
                                <select value={newField.type} onChange={e => setNewField({ ...newField, type: e.target.value as any })} className="w-full p-1 border rounded bg-white dark:bg-gray-700">
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="date">Date</option>
                                </select>
                            </td>
                            <td className="p-3 text-center"><input type="checkbox" checked={newField.required} onChange={e => setNewField({ ...newField, required: e.target.checked })} /></td>
                            <td className="p-3 text-right"><button onClick={handleAddField} className="text-blue-500 hover:underline">Add</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Schema Changes"}
            </button>
        </div>
    );
}
