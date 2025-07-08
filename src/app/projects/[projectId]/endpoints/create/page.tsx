"use client";

import { useState } from "react";
import CreateEndpointForm from "./components/CreateEndpointForm";
import SchemaBuilder from "./components/SchemaBuilder";
import StepIndicator from "./components/StepIndicator";
import { EndpointInfo, SchemaField } from "@/types/endpoint";
import ApiService from "@/lib/api/api_service";
import { SnackbarProvider, useSnackbar } from "notistack";
import { toast } from "sonner";



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

    const handleEndpointSubmit = async (fields: SchemaField[]) => {
        if (!info) return;

        const schema = generateJsonSchema(fields);
        try {
            setSaving(true);
            await ApiService.post(`/projects/${projectId}/endpoints`, {
                ...info,
                schema,
            });

            toast.success("✅ Endpoint created successfully!");
            window.location.href = `/projects/${projectId}/endpoints`;
        } catch (error: any) {
            console.log("Submit error:", error);
            const message =
                error?.response?.data?.error || "Something went wrong.";
            toast.error("❌ Something went wrong");

        } finally {
            setSaving(false);
        }
    }

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
                {step === 2 && info && <SchemaBuilder info={info} onSubmit={handleEndpointSubmit} submitting={saving} />}
            </div>
        </SnackbarProvider>

    );
}
