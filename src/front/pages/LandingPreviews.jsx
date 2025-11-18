import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPreviews = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/publications/preview`)
      .then(res => res.json())
      .then(data => setPublications(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdoptClick = (publicationId) => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    if (!auth?.token) {
      navigate("/user/login");
    } else {
      navigate(`/publications/${publicationId}`);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando publicaciones...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">🐾 Conoce a quienes buscan un hogar</h2>
      <div className="row">
        {Array.isArray(publications) && publications.length > 0 ? (
          publications
            .filter(pub => pub && typeof pub === "object")
            .map(pub => (
              <div key={pub.id || Math.random()} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {/* Imagen */}
                  {pub.image_url ? (
                    <img
                      src={
                        pub.image_url.startsWith("http")
                          ? pub.image_url 
                          : `${API.replace(/\/$/, "")}/media/${pub.image_url}` 
                      }
                      className="card-img-top"
                      alt={pub.title || "Publicación sin título"}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "250px" }}
                    >
                      <span className="text-muted">Sin imagen</span>
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{pub.title || "Sin título"}</h5>
                    <p className="card-text flex-grow-1">{pub.description || "Sin descripción disponible."}</p>
                    <p className="small text-muted mb-3">
                      {pub.species || "Desconocido"} · {pub.race || "—"} ·{" "}
                      {pub.age ?? "?"} años · {pub.location || "Ubicación no indicada"}
                    </p>
                    <button
                      className="btn btn-success mt-auto"
                      onClick={() => handleAdoptClick(pub.id)}
                    >
                      Adoptar 💚
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-muted mt-5">No hay publicaciones disponibles por ahora 🐾</p>
        )}
      </div>
    </div>
  );
};
