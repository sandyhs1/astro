"use client";
import './emr-landing/emr-landing.css';
import Landing from './emr-landing/Landing';
import { AuthProvider } from './emr-landing/context/AuthContext';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <AuthProvider>
      <Landing />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0A0A12",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "#fff",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "12px",
          },
        }}
      />
    </AuthProvider>
  );
}
