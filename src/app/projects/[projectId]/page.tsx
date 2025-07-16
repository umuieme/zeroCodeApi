'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 

interface Project {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (projectId) {
      const fetchProjectDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/projects/${projectId}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Project not found');
            }
            throw new Error('Failed to fetch project details');
          }
          const data = await response.json();
          setProject(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjectDetails();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center text-gray-600">
        Loading project details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-8 text-center text-gray-600">
        Project not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-sans antialiased">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
        Project Details: {project.name}
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
        {project.logo && (
          <div className="mb-6 flex justify-center">
            <img
              src={project.logo}
              alt={project.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/200x100/cccccc/333333?text=No+Logo`;
              }}
              className="w-48 h-24 object-contain rounded-lg bg-gray-100 p-2"
            />
          </div>
        )}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Description:</h3>
          <p className="text-gray-700 mt-2 leading-relaxed">{project.description || 'No description provided.'}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Owner:</h3>
          <p className="text-gray-700 mt-2">{project.owner}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Created At:</h3>
          <p className="text-gray-700 mt-2">
            {project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Last Updated:</h3>
          <p className="text-gray-700 mt-2">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4"> 
        <button
          onClick={() => router.back()} 
          className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Go Back
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out">
          + Add Endpoint
        </button>
      </div>

      <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Endpoints for this Project</h2>
        <p className="text-gray-600">No endpoints found yet. Add one above!</p>
      </div>
    </div>
  );
}
