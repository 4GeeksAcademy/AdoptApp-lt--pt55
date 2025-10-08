import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";

export const CandidatePublication = () => {
  const { store, dispatch } = useGlobalReducer();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchCandidatePublications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/api/candidate_publications`);
      if (!response.ok) throw new Error("Failed to fetch candidate publications");

      const data = await response.json();

      const publications = Array.isArray(data) ? data : data.data || [];
      dispatch({ type: "SET_CANDIDATE_PUBLICATIONS", payload: publications });
    } catch (err) {
      console.error(" Error fetching candidate publications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatePublications();
  }, []);


  const handleDeleteCandidatePublication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate publication?")) return;
    try {
      const response = await fetch(`${API}/api/candidate_publications/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      dispatch({ type: "DELETE_CANDIDATE_PUBLICATION", payload: id });
      alert("Candidate publication deleted successfully!");
    } catch (err) {
      console.error("Error deleting candidate publication:", err);
      alert(`Error deleting candidate publication: ${err.message}`);
    }
  };

    const renderRow = (cp) => (
    <tr key={cp.id}>
      <td><strong>{cp.id}</strong></td>
      <td>{cp.user?.id || "N/A"}</td>
      <td>{cp.publication?.id || "N/A"}</td>
      <td>
        <Link
          to={`/candidate_publications/view/${cp.id}`}
          className="btn btn-sm btn-info me-1"
          title="View"
        >
          <i className="fa-regular fa-eye"></i>
        </Link>
        <Link
          to={`/candidate_publications/edit/${cp.id}`}
          className="btn btn-sm btn-warning me-1"
          title="Edit"
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </Link>
        <button
          className="btn btn-sm btn-danger"
          title="Delete"
          onClick={() => handleDeleteCandidatePublication(cp.id)}
        >
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">CANDIDATE PUBLICATIONS</h1>

      <Link to="/candidate_publications/add" className="btn btn-primary mb-3">
        <i className="bi bi-plus-circle"></i> New Candidate Publication
      </Link>

      {loading ? (
        <div className="alert alert-secondary">
          <i className="bi bi-hourglass-split"></i> Loading candidate publications...
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
      ) : store.candidate_publications?.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Publication ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.candidate_publications.map(renderRow)}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          <i className="bi bi-info-circle"></i> No candidate publications found. Create your first one!
        </div>
      )}
    </div>
  );
};
