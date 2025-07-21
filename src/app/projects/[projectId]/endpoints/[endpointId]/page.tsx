"use client";

import { getEndpointById, updateEndpointSchema } from "@/lib/api/endpoints_service";
import { Endpoint, SchemaField } from "@/types/endpoint";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SchemaEditor from "../components/SchemaEditor";
import TabButton from "./components/TabButton";
import { useParams, useRouter } from "next/navigation";
import DataViewer from "./components/DataViewer";
import { convertFieldsToJsonSchema } from "@/lib/utils/schemUtils";

export default function AdvancedEndpointDetailPage() {
    const params = useParams<{ projectId: string, endpointId: string }>();
    const { projectId, endpointId } = params;
    const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
    const [fields, setFields] = useState<SchemaField[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'schema' | 'data'>('schema');
    const router = useRouter();
    useEffect(() => {
        const fetchEndpoint = async () => {
            try {
                setLoading(true);
                const data = await getEndpointById(projectId, endpointId);
                setEndpoint(data);
                // Convert schema object to array of fields for the editor
                const initialFields = data.schema?.properties ? Object.entries(data.schema.properties).map(([name, props]: [string, any]) => ({
                    name,
                    type: props.type,
                    required: data.schema.required?.includes(name) || false,
                })) : [];
                setFields(initialFields);
            } catch (error) {
                console.error("Failed to fetch endpoint details:", error);
                toast.error("Could not load endpoint details.");
            } finally {
                setLoading(false);
            }
        };
        if (projectId && endpointId) fetchEndpoint();
    }, [projectId, endpointId]);

    const handleSaveChanges = async () => {
        if (!endpoint) return;

        const newSchema = convertFieldsToJsonSchema(fields);

        setSaving(true);
        try {
            await updateEndpointSchema(projectId, endpointId, { ...endpoint, schema: newSchema });
            setEndpoint({ ...endpoint, schema: newSchema });
            toast.success("Schema saved successfully!");
        } catch (error) {
            toast.error("Failed to save schema.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!endpoint) return <div className="text-center py-10 text-red-500">Endpoint not found.</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 font-sans">
            <div className="mb-6">

                <button className="text-blue-600 hover:underline" onClick={() => router.back()}>&larr; Back to Endpoints</button>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{endpoint.name}</h1>
                        <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-gray-700 dark:text-gray-200 mt-2 inline-block">
                            {endpoint.endpoint}
                        </p>
                    </div>
                    <Link href={`/projects/${projectId}/endpoints/${endpoint._id}/edit`} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Edit Details
                    </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{endpoint.description || "No description provided."}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Endpoint ID</p>
                        <p className="font-mono text-gray-700 dark:text-gray-200 break-all">{endpoint._id}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Created At</p>
                        <p className="text-gray-700 dark:text-gray-200">{format(new Date(endpoint.createdAt), "PPpp")}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="text-gray-700 dark:text-gray-200">{format(new Date(endpoint.updatedAt), "PPpp")}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <div className="flex space-x-4">
                        <TabButton active={activeTab === 'schema'} onClick={() => setActiveTab('schema')}>Schema</TabButton>
                        <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')}>Data</TabButton>
                    </div>
                </div>

                <div>
                    {activeTab === 'schema' && (
                        <div>
                            <SchemaEditor
                                initialFields={fields}
                                onFieldsChange={setFields}
                            />
                            <button
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Schema Changes"}
                            </button>
                        </div>
                    )}
                    {activeTab === 'data' && <DataViewer schema={endpoint.schema} endpointId={endpointId} projectId={projectId} />}
                </div>
            </div>
        </div>
    );
}
