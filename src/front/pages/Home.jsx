import React, { useEffect } from "react";
import { useGlobalReducer } from "../hooks/useGlobalReducer.jsx";
import backgroundImage from "../assets/img/AdoptApp.png"; // Imagen de fondo
import { Link, useNavigate } from "react-router-dom";
import { LandingPreviews } from "../pages/LandingPreviews.jsx";
import { LogoutButton } from "../components/LogoutButton.jsx";
import FooterDonate from "../components/FooterDonate";


export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // Recuperar auth desde sessionStorage al cargar
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("auth");
    if (savedAuth) {
      dispatch({ type: "SET_AUTH", payload: JSON.parse(savedAuth) });
    }
  }, [dispatch]);

  const auth = store.auth || {};
  const role = auth.role;
  const token = auth.token;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Capa con leve transparencia */}
      <div
        className="container text-center mt-4 p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)", // menos opaco 💡
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h1 className="mb-4 fw-bold">🐾 AdoptApp</h1>

        {/* Botones superiores */}
        <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
          {/* Libre acceso */}
          <Link to="/publications" className="btn btn-outline-primary">
            Publicaciones
          </Link>

          {/* Solo si hay login (user o admin) */}
          {token && (
            <>
              <Link to="/users/dashboard" className="btn btn-outline-success">
                Mi Perfil
              </Link>
              <Link to="/publications" className="btn btn-outline-info">
                Mis Publicaciones
              </Link>
            </>
          )}

          {/* Solo si es admin */}
          {role === "admin" && (
            <Link to="/users" className="btn btn-outline-warning">
              Usuarios
            </Link>
          )}

          {/* Login / Logout */}
          {!token ? (
            <>
              <Link to="/user/login" className="btn btn-outline-secondary">
                Login Usuario
              </Link>
              <Link to="/admin/login" className="btn btn-outline-dark">
                Login Admin
              </Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </div>

        {/* Cards de publicaciones */}
        <LandingPreviews />
        {/* Componente de donaciones en el footer */}
        <FooterDonate />
      </div>
    </div>
  );
};
