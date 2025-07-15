'use client'
import { use, useEffect, useState } from "react";
import { Endpoint, EndpointInfo } from "@/types/endpoint";
import { toast } from "sonner";
import { getEndpointById, updateEndpoint } from "@/lib/api/endpoints_service";
import CreateEndpointForm from "../../create/components/CreateEndpointForm";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams<{ projectId: string, endpointId: string }>();
    const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEndpoint = async () => {
            try {
                setLoading(true);
                const data = await getEndpointById(params.projectId, params.endpointId);
                setEndpoint(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch endpoint");
            } finally {
                setLoading(false);
            }
        }
        fetchEndpoint();
    }, [params.projectId, params.endpointId]);

    const handleSave = async (data: EndpointInfo) => {
        try {
            await updateEndpoint(params.projectId, params.endpointId, data)
            toast.success("✅ Endpoint updated successfully!");
            window.location.href = `/projects/${params.projectId}/endpoints`;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update endpoint");
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <h1 className="text-2xl font-bold mb-6">Edit Endpoint</h1>
            {loading && <p>Loading endpoint...</p>}
            {!loading && !endpoint && <p className="text-red-500">Endpoint not found</p>}
            {!loading && endpoint && (
                <CreateEndpointForm
                    endpoint={endpoint}
                    isEditing={true}
                    onNext={(info) => handleSave(info)}
                />)}

        </div>
    );
}
