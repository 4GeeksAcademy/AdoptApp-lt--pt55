import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";

export const Users = () => {
  const { store, dispatch } = useGlobalReducer();
  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/api/users`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_USERS", payload: data });
      } else {
        console.error("Error fetching users");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${API}/api/users/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (response.ok) {
        dispatch({ type: "DELETE_USER", payload: id });
        alert("User deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Error deleting user: ${error.message}`);
    }
  };

return (
    <div className="container mt-4">
        <h1 className="mb-4">USERS</h1>

        <Link to="/users/addUser" className="btn btn-primary mb-3">
            <i className="bi bi-plus-circle"></i> New User
        </Link>

        {store.users && store.users.length > 0 ? (
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.users.map((user) => (
                            <tr key={user.id}>
                                <td><strong>{user.id}</strong></td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || "—"}</td>
                                <td>
                                    <span className={`badge ${user.is_active ? "bg-success" : "bg-danger"}`}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/users/view/${user.id}`} className="btn btn-sm btn-info me-1" title="View">
                                        <i class="fa-regular fa-eye"></i>
                                    </Link>
                                    <Link to={`/users/edit/${user.id}`} className="btn btn-sm btn-warning me-1" title="Edit">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        title="Delete"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        <i class="fa-regular fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="alert alert-info">
                <i className="bi bi-info-circle"></i> No Users found. Create your first one!
            </div>
        )}
    </div>
);
};