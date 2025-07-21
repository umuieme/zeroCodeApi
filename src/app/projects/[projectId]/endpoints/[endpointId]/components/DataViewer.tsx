"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddDataModal from "./AddDataModal";
import ApiService from "@/lib/api/api_service";

type Props = {
    schema: any;
    endpointId: string;
    projectId: string;
};

export default function DataViewer({ schema, endpointId, projectId }: Props) {
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const fetchData = async () => {
        if (!schema || !schema.properties) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/endpoints/${endpointId}/data`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await response.json();
            console.log(result);
            setData(result || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data.");
            setData([]);
        } finally {
            setLoading(false);
        }

    };

    const handleOpenModal = (item: any | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (dataId: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await ApiService.delete(`/projects/${projectId}/endpoints/${endpointId}/data/${dataId}`);
            toast.success("Item deleted successfully.");
            fetchData(); // Refresh the data list
        } catch (error) {
            toast.error("Failed to delete item.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [schema]);

    const headers = schema?.properties ? Object.keys(schema.properties) : [];
    const canAddData = headers.length > 0;

    return (
        <>
            <AddDataModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schema={schema}
                endpointId={endpointId}
                projectId={projectId}
                editingItem={editingItem}
                onDataAdded={() => {
                    toast.info("Refreshing data...");
                    fetchData(); // This is the callback that refreshes the list
                }}
            />
            <div className="pt-4">
                <div className="flex justify-end mb-4">
                    {/* Button to open the modal */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!canAddData}
                        title={!canAddData ? "You must define a schema first" : "Add new data"}
                    >
                        + Add Data
                    </button>
                </div>
                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="p-3 text-left font-medium">_id</th>
                                {headers.map(h => <th key={h} className="p-3 text-left font-medium">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={headers.length + 1} className="text-center p-4">Loading...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={headers.length + 1} className="text-center p-4 text-gray-500">No data yet.</td></tr>
                            ) : (
                                data.map(item => (
                                    <tr key={item._id} className="border-t">
                                        <td className="p-3 font-medium">{item._id}</td>
                                        {headers.map(h => <td key={h} className="p-3">{item[h] ?? ''}</td>)}
                                        <td className="p-3 text-right space-x-4">
                                            <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:underline font-medium">Edit</button>
                                            <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
