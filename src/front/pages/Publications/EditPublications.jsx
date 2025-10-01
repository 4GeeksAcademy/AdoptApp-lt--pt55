import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const EditPublications = () => {
  const { dispatch } = useGlobalReducer();
  const { publicationId } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    description: "",
    race: "",
    sex: "",
    species: "",
    age: "",
    location: "",
    adopted: false,
    adopter_id: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublication = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API}/api/publications/${publicationId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFormData({
        ...data,
        adopter_id: data.adopter_id || ""
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching publication:", err);
      setError("Failed to load publication data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (publicationId) fetchPublication();
  }, [publicationId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...formData };

      const response = await fetch(`${API}/api/publications/${publicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedPublication = await response.json();
        dispatch({ type: "UPDATE_PUBLICATION", payload: updatedPublication });
        navigate(`/publications/view/${publicationId}`);
        alert("Publication updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update Publication");
      }
    } catch (err) {
      console.error("Error updating Publication:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          <p>Loading Publication data...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
        <Link to="/publications" className="btn btn-primary">Back to Publications</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Edit Publication</h1>
            <Link to="/publications" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          {/* Form */}
          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="species" className="form-label">Species *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="race" className="form-label">Race *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="race"
                    name="race"
                    value={formData.race}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="sex" className="form-label">Sex *</label>
                  <select
                    className="form-select"
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="age" className="form-label">Age *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="adopted"
                    name="adopted"
                    checked={formData.adopted}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <label htmlFor="adopted" className="form-check-label">Adopted</label>
                </div>

                {formData.adopted && (
                  <div className="mb-3">
                    <label htmlFor="adopter_id" className="form-label">Adopter ID</label>
                    <input
                      type="number"
                      className="form-control"
                      id="adopter_id"
                      name="adopter_id"
                      value={formData.adopter_id}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to={`/publications/view/${publicationId}`} className="btn btn-secondary me-md-2">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i> Update Publication
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
