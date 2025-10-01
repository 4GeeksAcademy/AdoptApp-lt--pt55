import { Link, useParams, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const ViewMedia = () => {
  const { dispatch } = useGlobalReducer();
  const { mediaId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/media/${mediaId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMedia(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load media data");
      } finally {
        setLoading(false);
      }
    };

    if (mediaId) fetchMedia();
  }, [mediaId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      const response = await fetch(`${API}/api/media/${mediaId}`, { method: "DELETE" });
      if (response.ok) {
        dispatch({ type: "DELETE_MEDIA", payload: Number(mediaId) || mediaId });
        navigate("/media");
        alert("Media deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete media");
      }
    } catch (err) {
      console.error("Error deleting media:", err);
      alert(`Error deleting media: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading media...</p>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error || "Media not found"}
        </div>
        <Link to="/media" className="btn btn-primary">
          <i className="bi bi-arrow-left"></i> Back to Media
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
              <h1>Media Details</h1>
              <p className="text-muted">ID #{media.id}</p>
            </div>
            <Link to="/media" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-file-earmark-image"></i> Media Information
              </h5>
            </div>

            <div className="card-body">
              <p><strong>Title:</strong> {media.title}</p>
              <p><strong>Type:</strong> {media.type}</p>
              {media.publication_id && (
                <p><strong>Linked Publication ID:</strong> {media.publication_id}</p>
              )}
              <p><strong>URL:</strong> <a href={media.url} target="_blank" rel="noreferrer">{media.url}</a></p>

              {/* Vista previa si es imagen o video */}
              {media.type === "image" && (
                <img src={media.url} alt={media.title} className="img-fluid rounded mt-2" />
              )}
              {media.type === "video" && (
                <video controls className="w-100 mt-2">
                  <source src={media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="card-footer bg-light d-flex gap-2 justify-content-end">
              <Link to={`/media/edit/${media.id}`} className="btn btn-warning">
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