import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const EditFavorite = () => {
  const { dispatch } = useGlobalReducer();
  const { favoriteId } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    user_id: "",
    publication_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorite = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API}/api/favorites/${favoriteId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setFormData({
        user_id: data.user_id || "",
        publication_id: data.publication_id || "",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching favorite:", err);
      setError("Failed to load favorite data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (favoriteId) fetchFavorite();
  }, [favoriteId]);

  
  const handleInputChange = (e) => {
    const { name, value,} = e.target;
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

      if ( !payload.user_id || !payload.publication_id) {
        throw new Error("All required fields must be filled.");
      }

      const response = await fetch(`${API}/api/favorites/${favoriteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedFavorite = await response.json();
        dispatch({ type: "UPDATE_FAVORITE", payload: updatedFavorite });
        navigate("/favorites");
        alert("Favorite updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update favorite");
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
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
        <p>Loading favorite data...</p>
      </div>
    );
  }

  if (error && !formData.user_id && !formData.publication_id) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
        <Link to="/favorites" className="btn btn-primary">Back to Favorites</Link>
      </div>
    );
  }

  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Edit Favorite</h1>
            <Link to="/favorites" className="btn btn-outline-secondary">
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
                  <Link to="/favorites" className="btn btn-secondary me-md-2">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i> Update Favorite
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