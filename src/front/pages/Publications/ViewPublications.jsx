import { Link, useParams, useNavigate } from "react-router-dom";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewPublications = () => {
  const { dispatch } = useGlobalReducer();
  const { publicationId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/publications/${publicationId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPublication(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching publication:", err);
        setError("Failed to load publication data");
      } finally {
        setLoading(false);
      }
    };

    if (publicationId) fetchPublication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicationId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this publication?")) return;
    try {
      const response = await fetch(`${API}/api/publications/${publicationId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_PUBLICATION", payload: Number(publicationId) || publicationId });
        navigate("/publications");
        alert("Publication deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete publication");
      }
    } catch (err) {
      console.error("Error deleting publication:", err);
      alert(`Error deleting publication: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          <p>Loading publication...</p>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "Publication not found"}
        </div>
        <Link to="/publications" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Publications
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
              <h1>Publication Details</h1>
              <p className="text-muted">ID #{publication.id}</p>
            </div>
            <Link to="/publications" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-journal-text"></i> Publication Information
              </h5>
            </div>

<div className="card-body">
              <p><strong>Title:</strong> {publication.title}</p>
              <p><strong>Description:</strong> {publication.description}</p>
              <p><strong>Species:</strong> {publication.species}</p>
              <p><strong>Race:</strong> {publication.race}</p>
              <p><strong>Sex:</strong> {publication.sex}</p>
              <p><strong>Age:</strong> {publication.age}</p>
              <p><strong>Location:</strong> {publication.location}</p>
              <p>
                <strong>Status:</strong>{" "}
                {publication.adopted ? (
                  <span className="badge text-bg-success">Adopted</span>
                ) : (
                  <span className="badge text-bg-warning">Available</span>
                )}
              </p>
              {publication.adopter_id && (
                <p><strong>Adopter ID:</strong> {publication.adopter_id}</p>
              )}
            </div>

            <div className="card-footer bg-light d-flex gap-2 justify-content-end">
              <Link to={`/publications/edit/${publication.id}`} className="btn btn-warning">
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