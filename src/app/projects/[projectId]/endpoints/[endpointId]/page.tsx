// src/app/projects/[projectId]/endpoints/[endpointId]/page.tsx
"use client";

import { getEndpointById, updateEndpointSchema } from "@/lib/api/endpoints_service";
import { Endpoint, SchemaField } from "@/types/endpoint";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import TabButton from "./components/tab_button";
import SchemaEditor from "../components/SchemaEditor";
import { useParams } from "next/navigation";




export default function EndpointDetailPage() {
    const params = useParams<{ projectId: string, endpointId: string }>();
    const { projectId, endpointId } = params;
    const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'schema' | 'data'>('details');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchEndpoint = async () => {
            try {
                setLoading(true);
                const data = await getEndpointById(projectId, endpointId);
                setEndpoint(data);
            } catch (error) {
                console.error("Failed to fetch endpoint details:", error);
                toast.error("Could not load endpoint details.");
            } finally {
                setLoading(false);
            }
        };
        if (projectId && endpointId) fetchEndpoint();
    }, [projectId, endpointId]);

    const handleSaveSchema = async (newSchema: any) => {
        if (!endpoint) return;
        setIsSaving(true);
        try {
            await updateEndpointSchema(projectId, endpointId, { ...endpoint, schema: newSchema });
            // Update the local state to reflect the change immediately
            setEndpoint({ ...endpoint, schema: newSchema });
            toast.success("Schema updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update schema.");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!endpoint) return <div className="text-center py-10 text-red-500">Endpoint not found.</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 font-sans">
            <div className="mb-6">
                <Link href={`/projects/${projectId}/endpoints`} className="text-blue-600 hover:underline">&larr; Back to Endpoints</Link>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
                {/* Header */}
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

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <div className="flex space-x-4">
                        <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>Details</TabButton>
                        <TabButton active={activeTab === 'schema'} onClick={() => setActiveTab('schema')}>Schema</TabButton>
                        <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')}>Data</TabButton>
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'details' && (
                        <div className="space-y-4 pt-4">
                            <p className="text-gray-600 dark:text-gray-400">{endpoint.description || "No description provided."}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    )}
                    {activeTab === 'schema' && (
                        <SchemaEditor
                            initialSchema={endpoint.schema}
                            onSave={handleSaveSchema}
                            isSaving={isSaving}
                        />
                    )}
                    {/* {activeTab === 'data' && <DataViewer schema={endpoint.schema} />} */}
                </div>
            </div>
        </div>
    );
}
