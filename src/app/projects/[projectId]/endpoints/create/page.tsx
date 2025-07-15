"use client";

import { useState } from "react";
import CreateEndpointForm from "./components/CreateEndpointForm";
import { EndpointInfo, SchemaField } from "@/types/endpoint";
import ApiService from "@/lib/api/api_service";
import { toast } from "sonner";
import ImportSchemaModal from "./components/ImportSchemaModal";
import SchemaEditor from "../components/SchemaEditor";
import StepIndicator from "./components/StepIndicator";

export default function CreateEndpointPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [info, setInfo] = useState<EndpointInfo | null>(null);
    const [fields, setFields] = useState<SchemaField[]>([]);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSchemaStarted, setIsSchemaStarted] = useState(false);

    const projectId = typeof window !== 'undefined' ? window.location.pathname.split("/")[2] : "";

    const handleNext = (data: EndpointInfo) => {
        setInfo(data);
        setStep(2);
    };

    const handleImport = (importedFields: SchemaField[]) => {
        setFields(importedFields);
        setIsSchemaStarted(true);
    };

    const handleCreateEndpoint = async () => {
        if (!info || fields.length === 0) {
            toast.error("Schema must have at least one field.");
            return;
        }

        const schema = {
            type: "object",
            properties: fields.reduce((acc, field) => {
                acc[field.name] = { type: field.type };
                return acc;
            }, {} as Record<string, { type: string }>),
            required: fields.filter(f => f.required).map(f => f.name),
        };

        try {
            setSaving(true);
            await ApiService.post(`/projects/${projectId}/endpoints`, { ...info, schema });
            toast.success("✅ Endpoint created successfully!");
            window.location.href = `/projects/${projectId}/endpoints`;
        } catch (error: any) {
            const message = error?.response?.data?.error || "Something went wrong.";
            toast.error(`❌ ${message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <ImportSchemaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImport={handleImport}
            />
            <div className="max-w-3xl mx-auto py-8 px-4">
                <StepIndicator step={step} />
                {step === 1 && <CreateEndpointForm onNext={handleNext} />}
                {step === 2 && info && (
                    <div className="space-y-6 border rounded-xl p-6 shadow-md">
                        <h2 className="text-2xl font-bold">📐 Define Schema</h2>

                        {!isSchemaStarted ? (
                            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 p-8 bg-gray-800 rounded-lg">
                                <button onClick={() => setIsSchemaStarted(true)} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
                                    Build Manually
                                </button>
                                <span className="text-gray-500">or</span>
                                <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all">
                                    Import from JSON
                                </button>
                            </div>
                        ) : (
                            <>
                                <SchemaEditor
                                    initialFields={fields}
                                    onFieldsChange={setFields}
                                />
                                <button
                                    onClick={handleCreateEndpoint}
                                    disabled={saving || fields.length === 0}
                                    className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                                >
                                    {saving ? "Saving..." : "Create Endpoint"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
