import { useState } from "react";
import { required } from "zod/v4-mini";
import { z } from "zod";
import { set } from "mongoose";
import { EndpointInfo } from "@/types/endpoint";


type Props = {
    info: EndpointInfo;
    onSubmit: (fields: Field[]) => void;
    submitting: boolean;
};

const fieldSchema = z.object({
    name: z
        .string()
        .min(1, "Field name is required")
        .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
            message: "Must start with a letter or _, and only contain letters, numbers, and _",
        }),
    type: z.enum(["string", "number", "boolean", "date"]),
    required: z.boolean(),
});

type Field = z.infer<typeof fieldSchema>;

export default function SchemaBuilder({ submitting, onSubmit }: Props) {

    const [fields, setFields] = useState<Field[]>([])
    const [nameError, setNameError] = useState("");
    const [newField, setNewField] = useState<Field>({
        name: "",
        type: "string",
        required: false,
    });

    const handleAddField = () => {
        const result = fieldSchema.safeParse(newField);
        if (!result.success) {
            const error = result.error.errors[0]?.message || "Invalid field data";
            setNameError((prev) => error);
            return;
        }
        if (fields.some((field) => field.name === newField.name)) {
            setNameError((prev) => "Field name must be unique");
            return;
        }
        setNameError("");
        setFields((prev) => [...prev, newField]);
        setNewField({ name: "", type: "string", required: false });
    };

    const handleDeleteField = (index: number) => {
        setFields((prev) => prev.filter((_, i) => i !== index));
    };




    return (
        <div className="space-y-4 border rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-bold">📐 Define Schema</h2>
            <table className="w-full border text-sm">
                <thead>
                    <tr>
                        <th className="p-2 border">Field Name</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Required</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => (
                        <tr key={index}>
                            <td className="p-2 border">{field.name}</td>
                            <td className="p-2 border">{field.type}</td>
                            <td className="p-2 border">{field.required ? "Yes" : "No"}</td>
                            <td className="p-2 border">
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleDeleteField(index)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td className="p-2 border">
                            <input
                                type="text"
                                value={newField.name}
                                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                                placeholder="Field Name"
                                className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="p-2 border">
                            <select
                                value={newField.type}
                                onChange={(e) => setNewField({ ...newField, type: e.target.value as Field["type"] })}
                                className="w-full p-1 border rounded"
                            >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="date">Date</option>
                            </select>
                        </td>
                        <td className="p-2 border">
                            <input
                                type="checkbox"
                                checked={newField.required}
                                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                            />
                        </td>
                        <td className="p-2 border">
                            <button
                                className="text-blue-500 hover:underline"
                                onClick={handleAddField}
                            >
                                Add
                            </button>
                        </td>
                    </tr>

                </tbody>
            </table>
            <button
                onClick={() => onSubmit(fields)}
                disabled={fields.length === 0 || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {submitting ? "Saving..." : "Save Endpoint"}

            </button>
        </div>
    );

}