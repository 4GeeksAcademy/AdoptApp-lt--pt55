// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store";  // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext();

// Define a provider component that encapsulates the store and wraps it in a context provider to 
// broadcast the information throughout all the app pages and components.
export function StoreProvider({ children }) {
  // Initialize reducer with the initial state.
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  // 🧠 Recover saved session from sessionStorage when the app starts
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("auth");
    if (savedAuth) {
      dispatch({ type: "SET_AUTH", payload: JSON.parse(savedAuth) });
    }
  }, []);

  // Provide the store and dispatch method to all child components.
  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to access the global state and dispatch function.
export function useGlobalReducer() {
  const { dispatch, store } = useContext(StoreContext);
  return { dispatch, store };
}
