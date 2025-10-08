import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const EditCandidatePublication = () => {
  const { dispatch } = useGlobalReducer();
  const { candidatePublicationId } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    user_id: "",
    publication_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidatePublication = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API}/api/candidate_publications/${candidatePublicationId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setFormData({
        user_id: data.user_id || "",
        publication_id: data.publication_id || "",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching candidate publication:", err);
      setError("Failed to load candidate publication data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (candidatePublicationId) fetchCandidatePublication();
  }, [candidatePublicationId]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "user_id" || name === "publication_id" ? Number(value) : value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
            if (payload.user_id === payload.publication_id) {
        setError("User ID and Publication ID cannot be the same.");
        setLoading(false);
        return; // Detiene el proceso si los IDs son lo mismo
      }

      if ( !payload.user_id || !payload.publication_id) {
        throw new Error("All required fields must be filled.");
      }

      const response = await fetch(`${API}/api/candidate_publications/${candidatePublicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedCandidatePublication = await response.json();
        dispatch({ type: "UPDATE_CANDIDATE_PUBLICATION", payload: updatedCandidatePublication });
        navigate("/candidate_publications");
        alert("Candidate publication updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update candidate publication");
      }
    } catch (err) {
      console.error("Error updating candidate publication:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  if (fetching) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading follower data...</p>
      </div>
    );
  }

  if (error && !formData.user_id && !formData.publication_id) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
        <Link to="/candidate_publications" className="btn btn-primary">Back to Candidate Publications</Link>
      </div>
    );
  }

  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Edit Candidate Publication</h1>
            <Link to="/candidate_publications" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          {/* Form */}
          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="user_id" className="form-label">User ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="publication_id" className="form-label">Publication ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="publication_id"
                    name="publication_id"
                    value={formData.publication_id}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/candidate_publications" className="btn btn-secondary me-md-2">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i> Update Candidate Publication
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