

import { toast } from "sonner";
import { Endpoint } from "@/types/endpoint";

type Props = {
    endpoint: Endpoint,
    onDelete: (endpoint: Endpoint) => void,
    onClick: (endpoint: Endpoint) => void,
}

export default function EndpointCard({ endpoint }: Props) {
    const handleDelete = async () => {
        try {
            
            toast.success("Deleted!");
            window.location.reload();
        } catch {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="border p-4 rounded">
            <div className="flex justify-between">
                <div>
                    <h2 className="font-bold">{endpoint.name}</h2>
                    <code>{endpoint.endpoint}</code>
                </div>
                <button onClick={handleDelete}>🗑️</button>
            </div>
        </div>
    );
}
