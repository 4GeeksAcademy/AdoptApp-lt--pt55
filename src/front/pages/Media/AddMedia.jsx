import { Link, useNavigate } from "react-router-dom";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";
import { useState } from "react";

export const AddMedia = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    file_type: "",
    publication_id: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      if (!payload.title || !payload.url || !payload.file_type) {
        throw new Error("All required fields must be filled.");
      }

      const response = await fetch(`${API}/api/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newMedia = await response.json();
        dispatch({ type: "ADD_MEDIA", payload: newMedia });
        navigate("/media");
        alert("Media created successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create media");
      }
    } catch (err) {
      console.error("Error creating media:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          /* Header */
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Add New Media</h1>
            <Link to="/media" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          /* Card */
          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

                <form onSubmit={handleSubmit}>
                    {/* Publication ID */}
                    <div className="mb-3">
                      <label htmlFor="publication_id" className="form-label">Publication ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="publication_id"
                        name="publication_id"
                        value={formData.publication_id}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>
                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                {/* URL */}
                <div className="mb-3">
                  <label htmlFor="url" className="form-label">URL *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                {/* Type */}
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Type *</label>
                 <select
                    className="form-select"
                    id="file_type"
                    name="file_type"
                    value={formData.file_type}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                {/* Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/media" className="btn btn-secondary me-md-2">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle"></i> Create Media
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
