import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";

export const Follower = () => {
  const { store, dispatch } = useGlobalReducer();
  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchFollowers = async () => {
    try {
      const response = await fetch(`${API}/api/followers`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_FOLLOWERS", payload: data });
      } else {
        console.error("Error fetching followers");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const handleDeleteFollower = async (id) => {
    if (!window.confirm("Are you sure you want to delete this follower?")) return;
    try {
      const response = await fetch(`${API}/api/followers/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (response.ok) {
        dispatch({ type: "DELETE_FOLLOWER", payload: id });
        alert("Follower deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting follower:", error);
      alert(`Error deleting follower: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">FOLLOWERS</h1>

      <Link to="/followers/add" className="btn btn-primary mb-3">
        <i className="bi bi-plus-circle"></i> New Follower
      </Link>

      {store.followers && store.followers.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Follower ID</th>
                <th>Followed ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.followers.map((follower) => (
                <tr key={follower.id}>
                  <td><strong>{follower.id}</strong></td>
                  <td>{follower.follower_id}</td>
                  <td>{follower.followed_id}</td>
                  <td>
                    <span className={`badge ${follower.is_active ? "bg-success" : "bg-danger"}`}>
                      {follower.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/followers/view/${follower.id}`} className="btn btn-sm btn-info me-1" title="View">
                      <i className="fa-regular fa-eye"></i>
                    </Link>
                    <Link to={`/followers/edit/${follower.id}`} className="btn btn-sm btn-warning me-1" title="Edit">
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete"
                      onClick={() => handleDeleteFollower(follower.id)}
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
          <i className="bi bi-info-circle"></i> No Followers found. Create your first one!
        </div>
      )}
    </div>

  );
};