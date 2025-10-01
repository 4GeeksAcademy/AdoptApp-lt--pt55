import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";

export const Publications = () => {
  const { store, dispatch } = useGlobalReducer();
  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchPublications = async () => {
    try {
      const response = await fetch(`${API}/api/publications`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_PUBLICATIONS", payload: data });
      } else {
        console.error("Error fetching publications");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleDeletePublication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this publication?")) return;

    try {
      const response = await fetch(`${API}/api/publications/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (response.ok) {
        dispatch({ type: "DELETE_PUBLICATION", payload: id });
        alert("Publication deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
      alert(`Error deleting publication: ${error.message}`);
    }
  };

return (
    <div className="container mt-4">
        <h1 className="mb-4">PUBLICATIONS</h1>

        <Link to="/publications/addPublication" className="btn btn-primary mb-3">
            <i className="bi bi-plus-circle"></i> New Publication
        </Link>

        {store.publications && store.publications.length > 0 ? (
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            {/* <th>Author</th> */}
                            <th>Description</th>
                            <th>Species</th>
                            <th>Race</th>
                            <th>Sex</th>
                            <th>Age</th>
                            <th>Location</th>
                            <th>Adopted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.publications.map((publication) => (
                            <tr key={publication.id}>
                                <td><strong>{publication.id}</strong></td>
                                <td>{publication.title}</td>
                                {/* <td>{publication.author}</td> */}
                                <td>{publication.description}</td>
                                <td>{publication.species}</td>
                                <td>{publication.race}</td>
                                <td>{publication.sex}</td>
                                <td>{publication.age}</td>
                                <td>{publication.location}</td>
                                <td>
                                    {publication.adopted ? "Yes" : "No"}
                                </td>
                                <td>
                                    <Link to={`/publications/view/${publication.id}`} className="btn btn-sm btn-info me-1" title="View">
                                        <i className="bi bi-eye"></i>
                                    </Link>
                                    <Link to={`/publications/edit/${publication.id}`} className="btn btn-sm btn-warning me-1" title="Edit">
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        title="Delete"
                                        onClick={() => handleDeletePublication(publication.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="alert alert-info">
                <i className="bi bi-info-circle"></i> No Publications found. Create your first one!
            </div>
        )}
    </div>
);
};