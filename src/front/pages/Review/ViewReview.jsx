import { Link, useParams, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewReview = () => {
  const { dispatch } = useGlobalReducer();
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/reviews/${reviewId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setReview(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching review:", err);
        setError("Failed to load review data");
      } finally {
        setLoading(false);
      }
    };

    if (reviewId) fetchReview();
  }, [reviewId]);

  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await fetch(`${API}/api/reviews/${reviewId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_REVIEW", payload: Number(reviewId) || reviewId });
        navigate("/reviews");
        alert("Review deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert(`Error deleting review: ${err.message}`);
    }
  };

  
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading review...</p>
      </div>
    );
  }

  
  if (error || !review) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "Review not found"}
        </div>
        <Link to="/reviews" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Reviews
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
              <h1>Review Details</h1>
              <p className="text-muted">ID #{review.id}</p>
            </div>
            <Link to="/reviews" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-left-text"></i> Review Information
              </h5>
            </div>

            <div className="card-body">
              <p><strong>Comment:</strong> {review.comment}</p>
              <p><strong>Amount:</strong> {review.amount}</p>
              <p><strong>User ID:</strong> {review.user_id}</p>
              <p><strong>Publication ID:</strong> {review.publication_id}</p>
              <p><strong>Status:</strong> {review.is_active ? "Active" : "Inactive"}</p>
            </div>

            <div className="card-footer bg-light d-flex gap-2 justify-content-end">
              <Link to={`/reviews/edit/${review.id}`} className="btn btn-warning">
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