"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

// Lazy import api only if backend URL is configured
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false — don't block UI

  const checkAuth = useCallback(async () => {
    // Skip auth check if no backend is configured
    if (!BACKEND_URL) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { api } = await import("../lib/api");
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip auth check if no backend configured
    if (!BACKEND_URL) return;

    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      if (BACKEND_URL) {
        const { api } = await import("../lib/api");
        await api.post("/auth/logout");
      }
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
