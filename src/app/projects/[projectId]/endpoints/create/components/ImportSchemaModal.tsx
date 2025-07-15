"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SchemaField } from "@/types/endpoint";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onImport: (fields: SchemaField[]) => void;
};

export default function ImportSchemaModal({ isOpen, onClose, onImport }: Props) {
    const [jsonText, setJsonText] = useState("");
    const [error, setError] = useState("");

    const handleImport = () => {
        setError("");
        if (!jsonText.trim()) {
            setError("JSON input cannot be empty.");
            return;
        }

        try {
            const parsed = JSON.parse(jsonText);

            if (typeof parsed !== 'object' || parsed === null || typeof parsed.properties !== 'object') {
                throw new Error("Invalid schema structure. Must be an object with a 'properties' key.");
            }

            const fields: SchemaField[] = Object.entries(parsed.properties).map(([name, props]: [string, any]) => ({
                name,
                type: props.type || "string",
                required: parsed.required?.includes(name) || false,
            }));

            onImport(fields);
            onClose();
            setJsonText("");
        } catch (err: any) {
            setError(err.message || "Invalid JSON format.");
            toast.error("Failed to import schema.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Import Schema from JSON</h2>
                <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full p-3 font-mono text-sm border rounded-lg h-64 bg-gray-50 dark:bg-gray-700"
                    placeholder={`{\n  "type": "object",\n  "properties": {\n    "fieldName": { "type": "string" }\n  }\n}`}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={handleImport} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
}
