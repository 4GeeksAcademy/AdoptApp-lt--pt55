import React from "react";
import { useGlobalReducer } from "../../hooks/useGlobalReducer.jsx";
import HomeButtons from "../../components/HomeButtons.jsx";

export const DashboardUser = () => {
  const { store } = useGlobalReducer();
  const role = store.auth?.role; 

  return (
    <div className="text-center mt-5">
      <h1 className="display-4 mb-5">Dashboard User</h1>

      
      <HomeButtons role={store.auth?.role || null} />

      
      {role === "admin" && (
        <div className="mt-4">
          <Link to="/admin/dashboard">
            <button className="btn btn-warning">Go to Admin Dashboard</button>
          </Link>
        </div>
      )}
    </div>
  );
};
