// components/endpoints/CreateEndpointForm.tsx
"use client";

import { Endpoint, EndpointInfo } from "@/types/endpoint";
import { is } from "date-fns/locale";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    endpoint: z
        .string()
        .min(1, "Endpoint is required"),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
    onNext: (values: FormValues) => void;
    endpoint?: Endpoint;
    isEditing?: boolean;
};

export default function CreateEndpointForm({ onNext, endpoint, isEditing }: Props) {
    const [formData, setFormData] = useState<FormValues>({
        name: endpoint?.name || "",
        endpoint: endpoint?.endpoint || "",
        description: endpoint?.description || "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = formSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof FormValues;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        // Clear errors and pass validated data
        setErrors({});
        onNext(result.data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl shadow-md">
            <h2 className="text-xl font-bold">Create New Endpoint</h2>

            <div>
                <label className="block font-medium">Name</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
                <label className="block font-medium">Endpoint Path</label>
                <input
                    name="endpoint"
                    value={formData.endpoint}
                    onChange={handleChange}
                    placeholder="/users"
                    className="w-full p-2 border rounded"
                />
                {errors.endpoint && <p className="text-red-500 text-sm">{errors.endpoint}</p>}
            </div>

            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {isEditing ? "Update " : "Next"}
            </button>
        </form>
    );
}
