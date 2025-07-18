
'use client';
import { useEffect, useState } from "react";

export default function DataViewer({ schema }: { schema: any }) {
    const [dummyData, setDummyData] = useState<Record<string, any>[]>([]);

    useEffect(() => {
        if (!schema || !schema.properties) {
            setDummyData([]);
            return;
        }

        const headers = Object.keys(schema.properties);
        const generatedData = Array(5).fill(0).map((_, i) => {
            const row: Record<string, any> = { _id: `60f${i}c...` };
            headers.forEach(header => {
                switch (schema.properties[header].type) {
                    case 'string': row[header] = `Value ${i + 1}`; break;
                    case 'number': row[header] = (i + 1) * 10; break;
                    case 'boolean': row[header] = i % 2 === 0; break;
                    case 'date': row[header] = new Date(Date.now() - i * 86400000).toISOString(); break; // Use a stable date for consistency
                    default: row[header] = null;
                }
            });
            return row;
        });
        setDummyData(generatedData);
    }, [schema]); // Rerun when the schema changes

    if (!schema || !schema.properties || Object.keys(schema.properties).length === 0) {
        return <p className="text-gray-500 pt-4">No schema defined. Add fields in the 'Schema' tab to see data.</p>;
    }

    const headers = Object.keys(schema.properties);

    return (
        <div className="pt-4">
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="p-3 text-left font-medium">_id</th>
                            {headers.map(h => <th key={h} className="p-3 text-left font-medium">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render a loading/empty state initially */}
                        {dummyData.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length + 1} className="text-center p-4 text-gray-500">Generating data...</td>
                            </tr>
                        ) : (
                            dummyData.map(row => (
                                <tr key={row._id} className="border-t">
                                    <td className="p-3 font-mono">{row._id}</td>
                                    {headers.map(h => <td key={h} className="p-3">{String(row[h])}</td>)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};