import { Link, useParams, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewCandidatePublication = () => {
  const { dispatch } = useGlobalReducer();
  const { candidatePublicationId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [candidatePublication, setCandidatePublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchCandidatePublication = async (id) => {
    try {
    setLoading(true);
    const response = await fetch(`${API}/api/candidate_publications/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCandidatePublication(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching candidate publication:", err);
        setError("Failed to load candidate publication data");
      } finally {
        setLoading(false);
      }
    };

    if (candidatePublicationId) fetchCandidatePublication();
  }, [candidatePublicationId]);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this candidate publication?")) return;
    try {
      const response = await fetch(`${API}/api/candidate_publications/${candidatePublicationId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_CANDIDATE_PUBLICATION", payload: Number(candidatePublicationId) || candidatePublicationId });
        navigate("/candidate_publications");
        alert("Candidate publication deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete candidate publication");
      }
    } catch (err) {
      console.error("Error deleting candidate publication:", err);
      alert(`Error deleting candidate publication: ${err.message}`);
    }
  };

  
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading candidate publication...</p>
      </div>
    );
  }


  if (error || !candidatePublication) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "Candidate publication not found"}
        </div>
        <Link to="/candidate_publications" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Candidate Publications
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
              <h1>Candidate Publication Details</h1>
              <p className="text-muted">ID #{candidatePublication.id}</p>
            </div>
            <Link to="/candidate_publications" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-left-text"></i> Candidate Publication Information
              </h5>
            </div>

            <div className="card-body">
              <p><strong>User ID:</strong> {candidatePublication.user_id}</p>
              <p><strong>Publication ID:</strong> {candidatePublication.publication_id}</p>
            </div>

            <div className="card-footer bg-light d-flex gap-2 justify-content-end">
              <Link to={`/candidate_publications/edit/${candidatePublication.id}`} className="btn btn-warning">
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