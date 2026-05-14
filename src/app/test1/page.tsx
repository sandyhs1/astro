"use client";
import DashboardAnimation from "./DashboardAnimation";

export default function Test1Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">
          Live Product Demo
        </h1>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
          Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Cosmic Intelligence</span> Dashboard
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Watch every feature in action — powered by rigorous Vedic astrology data and profound karmic analysis.
        </p>
      </div>
      <DashboardAnimation />
    </main>
  );
}
