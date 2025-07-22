"use client";
import { deleteEndpoint, getEndpoints } from "@/lib/api/endpoints_service";
import { Endpoint } from "@/types/endpoint";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EndpointListPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const projectId =
    typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

  const fetchEndpoints = async () => {
    setLoading(true);
    try {
      const res = await getEndpoints(projectId, page, limit, search);
      setEndpoints(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch endpoints:", error);
      toast.error("Failed to fetch endpoints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, [page, limit, search]);

  const handleDelete = async (endpoint: Endpoint) => {
    if (!window.confirm("Are you sure you want to delete this endpoint?")) {
      return;
    }

    try {
      await deleteEndpoint(endpoint.projectId, endpoint._id);
      setEndpoints((prev) => prev.filter((ep) => ep._id !== endpoint._id));
      toast.success("Endpoint deleted successfully!");
      fetchEndpoints();
    } catch (error) {
      console.error("Failed to delete endpoint:", error);
      toast.error("Failed to delete endpoint");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Endpoints</h1>
        <Link
          href={`/projects/${projectId}/endpoints/create`}
          className="bg-blue-600 px-4 py-2 text-sm rounded-sm hover:bg-blue-800"
        >
          + Add endpoint
        </Link>
      </div>

      {/* Search & Limit */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded-md w-64"
        />
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border px-2 py-1 rounded-md"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : endpoints.length === 0 ? (
        <p className="text-muted-foreground">No endpoints found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full table-auto text-sm bg-background">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Collection ID</th>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Created</th>
                <th className="px-6 py-4 text-left font-medium">Updated</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep) => (
                <tr
                  key={ep._id}
                  className="border-t hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-s text-zinc-700 dark:text-zinc-300">
                    <Link
                      href={`/projects/${projectId}/endpoints/${ep._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {ep._id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{ep.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(ep.createdAt), "PPpp")}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(ep.updatedAt), "PPpp")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/projects/${projectId}/endpoints/${ep._id}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    {" | "}
                    <button
                      onClick={() => handleDelete(ep)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
