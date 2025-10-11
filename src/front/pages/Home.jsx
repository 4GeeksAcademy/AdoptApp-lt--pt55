import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import {useGlobalReducer} from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div
      className="min-vh-100 d-flex align-items-center"
      style={{ backgroundColor: "#FFF8DC" }}
    >
      <div className="container">
        <div className="row align-items-center">
          
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-4">🐾 Welcome to Pet Adoption App 🐾</h1>
            <p className="lead mb-4">
              Find your new best friend and give them a forever home 💖
            </p>

            <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-md-start mb-4">
              <Link to="/users" className="btn btn-lg btn-primary">
                👤 Users
              </Link>
              <Link to="/publications" className="btn btn-lg btn-success">
                📝 Publications
              </Link>
              <Link to="/media" className="btn btn-lg btn-info text-white">
                📸 Media
              </Link>
              <Link to="/reviews" className="btn btn-lg btn-warning text-white">
               ⭐ Reviews
              </Link>
              <Link to="/favorites" className="btn btn-primary btn-lg">
                 <i className="bi bi-heart-fill"></i> Go to Favorites
              </Link>
              <Link to="/followers" className="btn btn-lg btn-primary text-white">
                  <i className="bi bi-people-fill"></i> Followers
              </Link>
              <Link to="/candidate_publications" className="btn btn-lg btn-warning text-white">
                <i className="bi bi-chat-left-text-fill"></i> Candidate Publications
              </Link>

            </div>

            <div className="container mt-5 mb-5">
              <h1>LOGIN ADMIN</h1>
              <div className="ml-auto mt-5 mb-5">
                <Link to="/admin/login">
                  <button className="btn btn-light me-2">Login Admin</button>
                </Link>
                <Link to="/admin/signup">
                  <button className="btn btn-light me-2">Sign Up Admin</button>
                </Link>
                <Link to="/admin/dashboard">
                  <button className="btn btn-light me-2">Dashboard Admin</button>
                </Link>
              </div>
            </div>

            <div className="container mt-5 mb-5">
              <h1>LOGIN USER</h1>
              <div className="ml-auto mt-5 mb-5">
                <Link to="/user/login">
                  <button className="btn btn-light me-2">Login User</button>
                </Link>
                <Link to="/user/signup">
                  <button className="btn btn-light me-2">Sign Up User</button>
                </Link>
                <Link to="/user/dashboard">
                  <button className="btn btn-light me-2">Dashboard User</button>
                </Link>
              </div>
            </div>

            <div className="alert alert-light">
              {store.message ? (
                <span>{store.message}</span>
              ) : (
                <span>
                  Loading message from backend (is Python 🐍 server running?)...
                </span>
              )}
            </div>
          </div>

          
          <div className="col-md-6 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="Cute Dog"
              className="img-fluid"
              style={{ maxHeight: "250px", marginRight: "20px" }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616430.png"
              alt="Cute Cat"
              className="img-fluid"
              style={{ maxHeight: "250px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};