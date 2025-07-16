'use client';
import { useState, useEffect } from 'react';


interface Project {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  owner: string; // Added owner to the interface
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    logo: '',
    owner: crypto.randomUUID()
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Attempt to parse validation errors from the response
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to create/update project';
        const issues = errorData.issues ? JSON.stringify(errorData.issues) : '';
        throw new Error(`${errorMessage}${issues ? `: ${issues}` : ''}`);
      }

      const result = await response.json();

      if (editingId) {
        setProjects(projects.map(p => p._id === editingId ? result : p));
      } else {
        setProjects([...projects, result]);
      }

      resetForm();
      fetchProjects();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description || '',
      logo: project.logo || '',
      owner: project.owner 
    });
    setEditingId(project._id || null);
  };

  const confirmDelete = (id: string) => {
    setProjectToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!projectToDeleteId) return;

    setIsLoading(true);
    setShowConfirmModal(false);
    try {
      const response = await fetch(`/api/projects/${projectToDeleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter(p => p._id !== projectToDeleteId));
      setError(null);
      setProjectToDeleteId(null);
      fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during deletion');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', logo: '', owner: 'test_user_id_123' }); // Reset owner too
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4 font-sans antialiased">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">Project Manager</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md mb-6 transition-all duration-300 ease-in-out">
          <strong className="font-bold">Error!</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
        <h2 className="text-2xl font-semibold mb-5 text-gray-700">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="logo">
              Logo URL
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-y"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {/* Hidden owner input for demonstration */}
        <input type="hidden" name="owner" value={formData.owner} />

        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {editingId ? 'Update Project' : 'Add Project'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Your Projects</h2>

        {isLoading && projects.length === 0 ? (
          <p className="text-center text-gray-600">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects found. Add one above to get started!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map(project => (
              <div key={project._id} className="border border-gray-200 p-5 rounded-xl shadow-md bg-white flex flex-col justify-between">
                <div>
                  {project.logo && (
                    <img
                      src={project.logo}
                      alt={project.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/150x80/cccccc/333333?text=No+Logo`;
                      }}
                      className="w-full h-32 object-contain mb-4 rounded-lg bg-gray-100 p-2"
                    />
                  )}
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{project.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">Owner: {project.owner}</p> {/* Display owner */}
                </div>
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => project._id && confirmDelete(project._id)}
                    className="flex-1 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
