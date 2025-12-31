import { useState, useEffect, useCallback } from "react";

// Mock authentication hook
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client side
    const authState = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(authState);

    const handleStorageChange = () => {
      const authState = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(authState);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
    }
  }, []);

  const login = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    }
  }, []);

  return { isLoggedIn, logout, login };
}