"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Particle {
    id: number;
    size: number;
    startX: number;
    startY: number;
    duration: number;
    delay: number;
    moveX: number;
    moveY: number;
    color: string;
}

export default function QuantumLogo({ isFloating = false }: { isFloating?: boolean }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const colors = ["#ff0000", "#ff4444", "#d4af37", "#990000"];
        const newParticles = Array.from({ length: 120 }).map((_, i) => ({
            id: i,
            size: Math.random() * 3 + 1,
            startX: Math.random() * 100,
            startY: Math.random() * 100,
            moveX: Math.random() * 100 - 50,
            moveY: Math.random() * 100 - 50,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * -10,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setParticles(newParticles);
    }, []);

    // Animation variants for nodes
    const nodeVariants: Variants = {
        pulse: {
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
            filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    };

    // Animation for the beam at the apex
    const beamVariants: Variants = {
        radiate: {
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.3, 0.9],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    };

    const trailVariants: Variants = {
        flow: {
            strokeDashoffset: [200, 0],
            opacity: [0, 1, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
            }
        }
    };

    return (
        <div className={
            isFloating
                ? "relative inline-flex items-center justify-center mix-blend-screen scale-75 md:scale-100"
                : "relative flex items-center justify-center p-10 w-full max-w-[800px] min-h-[400px] mix-blend-screen"
        }>
            {/* High-Intensity Particle Turbulence */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: `${p.startX}%`,
                            top: `${p.startY}%`,
                            backgroundColor: p.color,
                            boxShadow: `0 0 12px ${p.color}`,
                        }}
                        animate={{
                            x: [0, p.moveX],
                            y: [0, p.moveY],
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Logo Container with Blend Mode */}
            <div className="relative z-10 group cursor-default">
                <Image
                    src="/quantum_karma_logo_dark.png"
                    alt="Quantum Karma"
                    width={isFloating ? 180 : 500}
                    height={isFloating ? 180 : 500}
                    className={
                        isFloating
                            ? "w-[120px] md:w-[150px] object-contain"
                            : "w-full max-w-[450px] object-contain"
                    }
                    priority
                />

                {/* SVG Energy Flow Layer */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Simplified geometric path tracing the triangle/mesh */}
                    <motion.path
                        d="M250 100 L150 400 L350 400 Z"
                        stroke="rgba(255, 0, 0, 0.6)"
                        strokeWidth="2"
                        strokeDasharray="40 160"
                        variants={trailVariants}
                        animate="flow"
                    />
                    <motion.path
                        d="M250 100 L200 250 L300 250 Z"
                        stroke="rgba(255, 68, 68, 0.8)"
                        strokeWidth="1"
                        strokeDasharray="20 80"
                        variants={trailVariants}
                        animate="flow"
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </svg>

                {/* Apex Overdrive Beam */}
                <div className="absolute top-[18%] left-1/2 -translate-x-1/2 flex items-center justify-center overflow-visible">
                    <motion.div
                        variants={beamVariants}
                        animate="radiate"
                        className="absolute w-24 h-24 bg-red-600 rounded-full blur-2xl pointer-events-none z-20"
                    />
                    <motion.div
                        variants={beamVariants}
                        animate="radiate"
                        className="absolute w-12 h-12 bg-red-400 rounded-full blur-xl pointer-events-none z-20"
                        transition={{ delay: 0.2 }}
                    />
                    <motion.div
                        variants={beamVariants}
                        animate="radiate"
                        className="absolute w-6 h-6 bg-white rounded-full blur-md pointer-events-none z-30"
                        transition={{ delay: 0.4 }}
                    />
                    {/* Rays */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-[1px]"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[1px] h-[200px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent blur-[1px]"
                    />
                </div>

                {/* High Intensity Node Pulse */}
                <div className="absolute inset-0 pointer-events-none">
                    {[
                        { top: '45%', left: '38%' }, // Q node
                        { top: '65%', left: '42%' }, // Q tail
                        { top: '45%', left: '62%' }, // K node
                        { top: '65%', left: '58%' }, // K leg
                        { top: '35%', left: '50%' }, // Center apex base
                    ].map((pos, idx) => (
                        <div key={idx} style={pos} className="absolute overflow-visible">
                            <motion.div
                                variants={nodeVariants}
                                animate="pulse"
                                className="w-4 h-4 bg-red-500 rounded-full blur-md"
                                transition={{ delay: idx * 0.2 }}
                            />
                            <motion.div
                                variants={nodeVariants}
                                animate="pulse"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"
                                transition={{ delay: idx * 0.2 }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Massive background aura */}
            <div className="absolute inset-0 bg-red-950/40 blur-[150px] -z-10 rounded-full shadow-[0_0_200px_rgba(255,0,0,0.2)] scale-150" />
        </div>
    );
}
