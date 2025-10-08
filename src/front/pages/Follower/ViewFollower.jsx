import { Link, useParams, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewFollower = () => {
  const { dispatch } = useGlobalReducer();
  const { followerId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [follower, setFollower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchFollower = async (id) => {
    try {
    setLoading(true);
    const response = await fetch(`${API}/api/followers/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setFollower(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching follower:", err);
        setError("Failed to load follower data");
      } finally {
        setLoading(false);
      }
    };

    if (followerId) fetchFollower();
  }, [followerId]);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this follower?")) return;
    try {
      const response = await fetch(`${API}/api/followers/${followerId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_FOLLOWER", payload: Number(followerId) || followerId });
        navigate("/followers");
        alert("Follower deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete follower");
      }
    } catch (err) {
      console.error("Error deleting follower:", err);
      alert(`Error deleting follower: ${err.message}`);
    }
  };

  
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading follower...</p>
      </div>
    );
  }


  if (error || !follower) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "Follower not found"}
        </div>
        <Link to="/followers" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Followers
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
              <h1>Follower Details</h1>
              <p className="text-muted">ID #{follower.id}</p>
            </div>
            <Link to="/followers" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-left-text"></i> Follower Information
              </h5>
            </div>

            <div className="card-body">
              <p><strong>Follower ID:</strong> {follower.follower_id}</p>
              <p><strong>Followed ID:</strong> {follower.followed_id}</p>
            </div>

            <div className="card-footer bg-light d-flex gap-2 justify-content-end">
              <Link to={`/followers/edit/${follower.id}`} className="btn btn-warning">
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