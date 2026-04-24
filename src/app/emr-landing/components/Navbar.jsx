"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../hooks/useAuthModal";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const handleLogin = () => {
    openAuthModal("sign_up");
  };

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#050507]/60 border-b border-white/5"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16 h-16">
        <Link href="/" data-testid="nav-logo" className="group flex items-center gap-3">
          <div className="relative">
            <svg width="28" height="28" viewBox="0 0 28 28" className="transition-transform duration-500 group-hover:rotate-180" aria-hidden="true">
              <circle cx="14" cy="14" r="13" fill="none" stroke="#00E5FF" strokeWidth="1" />
              <polygon points="14,3 25,22 3,22" fill="none" stroke="#7B61FF" strokeWidth="1" />
              <circle cx="14" cy="14" r="3" fill="#FF5E3A" />
            </svg>
          </div>
          <span className="font-mono-tech text-[11px]">
            Quantum<span className="text-[#FF5E3A]">/</span>Karma
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-mono-tech text-[10px] text-zinc-400">
          <a href="#philosophy" className="sweep-underline hover:text-white transition-colors" data-testid="nav-philosophy">Philosophy</a>
          <a href="#vedic-stack" className="sweep-underline hover:text-white transition-colors" data-testid="nav-stack">Stack</a>
          <a href="#shodasavarga" className="sweep-underline hover:text-white transition-colors" data-testid="nav-shodasavarga">D1—D60</a>
          <a href="#subscription" className="sweep-underline hover:text-white transition-colors" data-testid="nav-subscription">Credits</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                data-testid="nav-dashboard-btn"
                onClick={() => router.push("/dashboard")}
                className="font-mono-tech text-[10px] text-zinc-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button
                data-testid="nav-logout-btn"
                onClick={async () => { await logout(); router.push("/"); }}
                className="font-mono-tech text-[10px] text-zinc-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              data-testid="nav-login-btn"
              onClick={handleLogin}
              className="magnetic group relative font-mono-tech text-[10px] bg-[#F8FAFC] text-[#050507] px-5 py-2.5 hover:bg-white transition-colors"
            >
              <span className="relative z-10">Initiate ⟶</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
