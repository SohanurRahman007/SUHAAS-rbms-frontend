import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.get("/projects");
      setProjects(data.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      setCreating(true);
      const response = await api.post("/projects", newProject);

      setProjects([response.data, ...projects]);
      setNewProject({ name: "", description: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!isAdmin) {
      alert("Only Admin can delete projects");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleUpdateProject = async (
    projectId: string,
    updates: Partial<Project>,
  ) => {
    if (!isAdmin) {
      alert("Only Admin can update projects");
      return;
    }

    try {
      const response = await api.patch(`/projects/${projectId}`, updates);
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, ...response.data } : p,
        ),
      );
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Manage and track all projects</p>
          </div>

          <Button onClick={() => setShowCreateForm(true)}>
            + Create Project
          </Button>
        </div>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <Input
              label="Project Name"
              placeholder="Enter project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Project description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" loading={creating}>
                Create Project
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                disabled={creating}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Projects List */}
      {loading ? (
        <Card className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">
            No projects yet. Create your first project!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                      project.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : project.status === "ARCHIVED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateProject(project._id, {
                          status:
                            project.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE",
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {project.status === "ACTIVE" ? "Archive" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <div>
                    <p className="font-medium">Created by</p>
                    <p>{project.createdBy.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Created</p>
                    <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
                {!isAdmin && (
                  <span className="text-xs text-gray-500 self-center">
                    Only Admin can edit/delete
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
