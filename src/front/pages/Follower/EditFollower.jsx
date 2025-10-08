import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const EditFollower = () => {
  const { dispatch } = useGlobalReducer();
  const { followerId } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    follower_id: "",
    followed_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollower = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API}/api/followers/${followerId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setFormData({
        follower_id: data.follower_id || "",
        followed_id: data.followed_id || "",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching follower:", err);
      setError("Failed to load favorite data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (followerId) fetchFollower();
  }, [followerId]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "follower_id" || name === "followed_id" ? Number(value) : value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
            if (payload.follower_id === payload.followed_id) {
        setError("Follower and followed cannot be the same user.");
        setLoading(false);
        return; // Detiene el proceso si los IDs son iguales
      }

      if ( !payload.follower_id || !payload.followed_id) {
        throw new Error("All required fields must be filled.");
      }

      const response = await fetch(`${API}/api/followers/${followerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedFollower = await response.json();
        dispatch({ type: "UPDATE_FOLLOWER", payload: updatedFollower });
        navigate("/followers");
        alert("Follower updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update follower");
      }
    } catch (err) {
      console.error("Error updating follower:", err);
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

  if (error && !formData.follower_id && !formData.followed_id) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
        <Link to="/followers" className="btn btn-primary">Back to Followers</Link>
      </div>
    );
  }

  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Edit Follower</h1>
            <Link to="/followers" className="btn btn-outline-secondary">
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
                  <label htmlFor="follower_id" className="form-label">Follower ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="follower_id"
                    name="follower_id"
                    value={formData.follower_id}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="followed_id" className="form-label">Followed ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="followed_id"
                    name="followed_id"
                    value={formData.followed_id}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/followers" className="btn btn-secondary me-md-2">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i> Update Follower
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