import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";

export const Review = () => {
  const { store, dispatch } = useGlobalReducer();
  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchReview = async () => {
    try {
      const response = await fetch(`${API}/api/reviews`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_REVIEWS", payload: data });
      } else {
        console.error("Error fetching reviews");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`${API}/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (response.ok) {
        dispatch({ type: "DELETE_REVIEW", payload: id });
        alert("Review deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(`Error deleting review: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">REVIEWS</h1>

      <Link to="/reviews/add" className="btn btn-primary mb-3">
        <i className="bi bi-plus-circle"></i> New Review
      </Link>

      {store.reviews && store.reviews.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Comment</th>
                <th>Amount</th>
                <th>User ID</th>
                <th>Publication ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.reviews.map((review) => (
                <tr key={review.id}>
                  <td><strong>{review.id}</strong></td>
                  <td>{review.comment}</td>
                  <td>{review.amount}</td>
                  <td>{review.user_id}</td>
                  <td>{review.publication_id}</td>
                  <td>
                    <span className={`badge ${review.is_active ? "bg-success" : "bg-danger"}`}>
                      {review.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/reviews/view/${review.id}`} className="btn btn-sm btn-info me-1" title="View">
                      <i className="fa-regular fa-eye"></i>
                    </Link>
                    <Link to={`/reviews/edit/${review.id}`} className="btn btn-sm btn-warning me-1" title="Edit">
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          <i className="bi bi-info-circle"></i> No Reviews found. Create your first one!
        </div>
      )}
    </div>

  );
};