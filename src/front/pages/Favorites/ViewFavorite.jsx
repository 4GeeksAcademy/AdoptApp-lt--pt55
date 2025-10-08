import { Link, useParams, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewFavorite = () => {
  const { dispatch } = useGlobalReducer();
  const { favoriteId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/favorites/${favoriteId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setFavorite(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching favorite:", err);
        setError("Failed to load favorite data");
      } finally {
        setLoading(false);
      }
    };

    if (favoriteId) fetchFavorite();
  }, [favoriteId]);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this favorite?")) return;
    try {
      const response = await fetch(`${API}/api/favorites/${favoriteId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_FAVORITE", payload: Number(favoriteId) || favoriteId });
        navigate("/favorites");
        alert("Favorite deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete favorite");
      }
    } catch (err) {
      console.error("Error deleting favorite:", err);
      alert(`Error deleting favorite: ${err.message}`);
    }
  };

  
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading favorite...</p>
      </div>
    );
  }


  if (error || !favorite) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "Favorite not found"}
        </div>
        <Link to="/favorites" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Favorites
        </Link>
      </div>
    );
  }

  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Favorite Details</h1>
              <p className="text-muted">ID #{favorite.id}</p>
            </div>
            <Link to="/favorites" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-left-text"></i> Favorite Information
              </h5>
            </div>

            <div className="card-body">
              <p><strong>User ID:</strong> {favorite.user_id}</p>
              <p><strong>Publication ID:</strong> {favorite.publication_id}</p>
            </div>

            <div className="card-footer bg-light d-flex gap-2 justify-content-end">
              <Link to={`/favorites/edit/${favorite.id}`} className="btn btn-warning">
                <i className="bi bi-pencil"></i> Edit
              </Link>
              <button className="btn btn-danger" onClick={handleDelete}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};