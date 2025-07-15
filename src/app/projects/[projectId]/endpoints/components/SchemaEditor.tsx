"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { SchemaField } from "@/types/endpoint";

const fieldSchema = z.object({
    name: z.string().min(1, "Field name is required").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Must start with a letter or _, and only contain letters, numbers, and _."),
    type: z.enum(["string", "number", "boolean", "date"]),
    required: z.boolean(),
});

type SchemaEditorProps = {
    initialFields: SchemaField[];
    onFieldsChange: (fields: SchemaField[]) => void;
};

export default function SchemaEditor({ initialFields, onFieldsChange }: SchemaEditorProps) {

    const [fields, setFields] = useState<SchemaField[]>(initialFields || []);
    const [newField, setNewField] = useState<SchemaField>({ name: "", type: "string", required: false });
    const [error, setError] = useState("");

    useEffect(() => {
        setFields(initialFields || []);
    }, [initialFields]);

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
        const updatedFields = [...fields, newField];
        setFields(updatedFields);
        onFieldsChange(updatedFields);
        setNewField({ name: "", type: "string", required: false });
    };

    const handleDeleteField = (fieldName: string) => {
        const updatedFields = fields.filter(f => f.name !== fieldName);
        setFields(updatedFields);
        onFieldsChange(updatedFields);
    };

    return (
        <div className="space-y-4">
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
                            <tr key={field.name} className="border-t dark:border-gray-700">
                                <td className="p-3 font-mono">{field.name}</td>
                                <td className="p-3 capitalize">{field.type}</td>
                                <td className="p-3 text-center">{field.required ? "✓" : "✗"}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => handleDeleteField(field.name)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
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
                            <td className="p-3 text-right"><button onClick={handleAddField} className="text-blue-500 hover:underline font-semibold">Add</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {fields.length === 0 && <p className="text-center text-gray-500 py-4">No fields defined. Add a field to get started.</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
