import { Link, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState } from "react";

export const AddFollower = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    follower_id: "",
    followed_id: "",
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
          : name === "follower_id" || name === "followed_id"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.follower_id === formData.followed_id) {
      setError("Follower and followed cannot be the same user.");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...formData };
      const response = await fetch(`${API}/api/followers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newFollower = await response.json();
        dispatch({ type: "ADD_FOLLOWER", payload: newFollower });
        navigate("/followers");
        alert("Follower created successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create follower");
      }
    } catch (err) {
      console.error("Error creating follower:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Add New Follower</h1>
            <Link to="/followers" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

        
          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="follower_id" className="form-label">
                    Follower ID *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="follower_id"
                    name="follower_id"
                    value={formData.follower_id}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter follower ID"
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="followed_id" className="form-label">
                    Followed ID *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="followed_id"
                    name="followed_id"
                    value={formData.followed_id}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter followed ID"
                    disabled={loading}
                  />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/followers" className="btn btn-secondary me-md-2">
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
                        <i className="bi bi-plus-circle"></i> Create Follower
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