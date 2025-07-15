"use client";

import { useState } from "react";
import CreateEndpointForm from "./components/CreateEndpointForm";
import SchemaBuilder from "./components/SchemaBuilder";
import StepIndicator from "./components/StepIndicator";
import { EndpointInfo, SchemaField } from "@/types/endpoint";
import ApiService from "@/lib/api/api_service";
import { SnackbarProvider, useSnackbar } from "notistack";
import { toast } from "sonner";
import SchemaEditor from "../components/SchemaEditor";



export default function CreateEndpointPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [info, setInfo] = useState<EndpointInfo | null>(null);
    const [saving, setSaving] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const projectId = window.location.pathname.split("/")[2];

    const handleNext = (data: EndpointInfo) => {
        setInfo(data);
        setStep(2);
    };

    const handleCreateEndpoint = async (schema: any) => {
        if (!info) return;

        try {
            setSaving(true);
            await ApiService.post(`/projects/${projectId}/endpoints`, {
                ...info,
                schema,
            });

            toast.success("Endpoint created successfully!");
            // Redirect to the project's endpoint list
            window.location.href = `/projects/${projectId}/endpoints`;
        } catch (error: any) {
            console.log("Submit error:", error);
            const message = error?.response?.data?.error || "Something went wrong.";
            toast.error(`${message}`);
        } finally {
            setSaving(false);
        }
    };

    const generateJsonSchema = (fields: SchemaField[]) => {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        fields.forEach((field) => {
            properties[field.name] = { type: field.type };
            if (field.required) required.push(field.name);
        });

        return {
            type: "object",
            properties,
            ...(required.length ? { required } : {}),
        };
    };

    return (
        <SnackbarProvider>
            <div className="max-w-3xl mx-auto py-8 px-4">
                <StepIndicator step={step} />
                {step === 1 && <CreateEndpointForm onNext={handleNext} />}
                {step === 2 && info && <SchemaEditor
                    // Pass an empty object for the initial schema when creating
                    initialSchema={{}}
                    // Pass the submission logic as the onSave callback
                    onSave={handleCreateEndpoint}
                    isSaving={saving}
                />}

            </div>
        </SnackbarProvider>

    );
}
