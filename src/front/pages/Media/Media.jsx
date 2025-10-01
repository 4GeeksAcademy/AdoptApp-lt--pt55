import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";

export const Media = () => {
  const { store, dispatch } = useGlobalReducer();
  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchMedia = async () => {
    try {
      const response = await fetch(`${API}/api/media`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_MEDIA", payload: data });
      } else {
        console.error("Error fetching media");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDeleteMedia = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await fetch(`${API}/api/media/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (response.ok) {
        dispatch({ type: "DELETE_MEDIA", payload: id });
        alert("Media deleted successfully!");
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
        <h1 className="mb-4">MEDIA</h1>

        <Link to="/media/add" className="btn btn-primary mb-3">
        <i className="bi bi-upload"></i> Upload Media
      </Link>

      {store.media && store.media.length > 0 ? (
        <div className="row">
          {store.media.map((m) => (
            <div key={m.id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                  <img src={m.url} alt={m.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{m.title}</h5>
                  <Link to={`/media/view/${m.id}`} className="btn btn-sm btn-info me-2">
                    <i className="bi bi-eye"></i>
                  </Link>
                  <Link to={`/media/edit/${m.id}`} className="btn btn-sm btn-warning me-2">
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMedia(m.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <i className="bi bi-info-circle"></i> No Media found. Create your first one!
        </div>
      )}
    </div>
  );
};
