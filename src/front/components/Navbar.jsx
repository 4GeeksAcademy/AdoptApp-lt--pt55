import { Link, useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // Recuperar auth del sessionStorage al montar (por si se refresca)
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("auth");
    if (savedAuth && !store.auth) {
      dispatch({ type: "SET_AUTH", payload: JSON.parse(savedAuth) });
    }
  }, []);

  const user = store.auth;

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    dispatch({ type: "SET_AUTH", payload: null });
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light shadow-sm"
      style={{
        backdropFilter: "blur(6px)",
        background: "rgba(255, 255, 255, 0.85)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          AdoptApp
        </Link>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          {/* Botón de inicio */}
          <Link to="/">
            <button className="btn btn-outline-primary btn-sm">Inicio</button>
          </Link>

          {/* Solo visible para admin */}
          {(user?.role === "admin" || user?.user?.role === "admin") && (
          <Link to="/users">
            <button className="btn btn-outline-warning btn-sm">Usuarios</button>
          </Link>
          )}

          {/* Dashboard visible si hay sesión */}
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/users/dashboard"}
              >
                <button className="btn btn-success btn-sm">Dashboard</button>
              </Link>

              {/* Mostrar nombre */}
              <span className="ms-2 text-muted small">
                👋 {user?.name || user?.user?.firstname || "Admin"}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm ms-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/user/login">
                <button className="btn btn-outline-success btn-sm">Login</button>
              </Link>
              <Link to="/user/signup">
                <button className="btn btn-primary btn-sm">Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
