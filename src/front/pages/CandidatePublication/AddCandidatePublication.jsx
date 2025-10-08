import { Link, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState } from "react";

export const AddCandidatePublication = () => {
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

    if (formData.user_id === formData.publication_id) {
      setError("User ID and Publication ID cannot be the same.");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...formData };
      const response = await fetch(`${API}/api/candidate_publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newCandidatePublication = await response.json();
        dispatch({ type: "ADD_CANDIDATE_PUBLICATION", payload: newCandidatePublication });
        navigate("/candidate_publications");
        alert("Candidate publication created successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create candidate publication");
      }
    } catch (err) {
      console.error("Error creating candidate publication:", err);
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
            <h1>Add New Candidate Publication</h1>
            <Link to="/candidate_publications" className="btn btn-outline-secondary">
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
                  <Link to="/candidate_publications" className="btn btn-secondary me-md-2">
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
                        <i className="bi bi-plus-circle"></i> Create Candidate Publication
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