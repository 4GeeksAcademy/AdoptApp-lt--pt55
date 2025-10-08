import { Link, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState } from "react";

export const AddFavorite = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    user_id: "",
    publication_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "user_id" || name === "publication_id"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      const response = await fetch(`${API}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newFavorite = await response.json();
        dispatch({ type: "ADD_FAVORITE", payload: newFavorite });
        navigate("/favorites");
        alert("Favorite created successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create favorite");
      }
    } catch (err) {
      console.error("Error creating favorite:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Add New Favorite</h1>
            <Link to="/favorites" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          {/* Card */}
          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
<div className="mb-3">
                  <label htmlFor="user_id" className="form-label">
                    User ID *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter user ID"
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="publication_id" className="form-label">
                    Publication ID *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="publication_id"
                    name="publication_id"
                    value={formData.publication_id}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter publication ID"
                    disabled={loading}
                  />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/favorites" className="btn btn-secondary me-md-2">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle"></i> Create Favorite
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