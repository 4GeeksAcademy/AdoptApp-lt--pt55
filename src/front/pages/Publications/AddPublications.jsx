import { Link, useNavigate } from "react-router-dom";
import {useGlobalReducer} from "../../hooks/useGlobalReducer";
import { useState } from "react";

export const AddPublications = () => {
  const { dispatch } = useGlobalReducer();
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
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      if (!payload.user_id || !payload.title || !payload.description || !payload.species || !payload.race || !payload.sex || !payload.age || !payload.location) {
        throw new Error("All required fields must be filled.");
      }

      const response = await fetch(`${API}/api/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newPublication = await response.json();
        dispatch({ type: "ADD_PUBLICATION", payload: newPublication });
        navigate("/publications");
        alert("Publication created successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create publication");
      }
    } catch (err) {
      console.error("Error creating publication:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          /* Header */
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Add New Publication</h1>
            <Link to="/publications" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          /* Card */
          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* User ID */}
                <div className="mb-3">
                  <label htmlFor="user_id" className="form-label">User ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter user id"
                    disabled={loading}
                  />
                </div>

                {/* Title */}
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
                    placeholder="Publication title"
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe the publication"
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Species */}
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
                    placeholder="E.g., Dog, Cat"
                    disabled={loading}
                  />
                </div>

                {/* Race */}
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
                    placeholder="E.g., Labrador, Siamese"
                    disabled={loading}
                  />
                </div>

                {/* Sex */}
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

                {/* Age */}
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
                    placeholder="E.g., 2 years"
                    disabled={loading}
                  />
                </div>

                {/* Location */}
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
                    placeholder="City or region"
                    disabled={loading}
                  />
                </div>

                {/* Adopted */}
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
                      placeholder="Enter adopter user id"
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/publications" className="btn btn-secondary me-md-2">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle"></i> Create Publication
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
