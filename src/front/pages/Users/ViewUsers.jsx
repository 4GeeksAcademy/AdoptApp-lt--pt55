import { Link, useParams, useNavigate } from "react-router-dom";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewUsers = () => {
  const { dispatch } = useGlobalReducer();
  const { userId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/users/${userId}`); // singular
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${API}/api/users/${userId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_USER", payload: Number(userId) || userId });
        navigate("/users");
        alert("User deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(`Error deleting user: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          <p>Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "User not found"}
        </div>
        <Link to="/users" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Users
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
              <h1>User Details</h1>
              <p className="text-muted">ID #{user.id}</p>
            </div>
            <Link to="/users" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-badge"></i> User Information
              </h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted">First Name</label>
                    <p className="fs-6">{user.firstname || "-"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Last Name</label>
                    <p className="fs-6">{user.lastname || "-"}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Email</label>
                    <p className="fs-6">{user.email || "-"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Phone</label>
                    <p className="fs-6">{user.phone || "-"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Status</label>
                    <p className="fs-6">
                      {user.is_active ? (
                        <span className="badge text-bg-success">Active</span>
                      ) : (
                        <span className="badge text-bg-secondary">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer bg-light">
              <div className="d-flex gap-2 justify-content-end">
                <Link to="/users" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left"></i> Back
                </Link>
                <Link to={`/users/edit/${user.id}`} className="btn btn-warning">
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
    </div>
  );
};