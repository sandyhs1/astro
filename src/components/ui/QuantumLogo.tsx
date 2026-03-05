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
}

export default function QuantumLogo({ isFloating = false }: { isFloating?: boolean }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            size: Math.random() * 2 + 1,
            startX: Math.random() * 100,
            startY: Math.random() * 100,
            moveX: Math.random() * 40 - 20,
            moveY: Math.random() * 40 - 20,
            duration: Math.random() * 4 + 3,
            delay: Math.random() * -5,
        }));
        setParticles(newParticles);
    }, []);

    // Animation variants for nodes
    const nodeVariants: Variants = {
        pulse: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    };

    // Animation for the beam at the apex
    const beamVariants: Variants = {
        radiate: {
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.1, 0.8],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    };

    return (
        <div className={
            isFloating
                ? "relative inline-flex items-center justify-center"
                : "relative flex items-center justify-center p-10 w-full max-w-[800px] min-h-[400px]"
        }>
            {/* Background Particle Field */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-red-500"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: `${p.startX}%`,
                            top: `${p.startY}%`,
                            boxShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
                        }}
                        animate={{
                            x: [0, p.moveX],
                            y: [0, p.moveY],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Static Base Logo */}
            <div className="relative z-10 overflow-hidden rounded-xl">
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

                {/* Overlaid Animation Elements */}
                {/* Apex Beam */}
                <motion.div
                    variants={beamVariants}
                    animate="radiate"
                    className="absolute top-[18%] left-1/2 -translate-x-1/2 w-12 h-12 bg-red-600 rounded-full blur-xl pointer-events-none z-20"
                />
                <motion.div
                    variants={beamVariants}
                    animate="radiate"
                    className="absolute top-[18%] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full blur-md pointer-events-none z-20"
                />

                {/* Geometric Nodes Pulse - Overlaying key points of the logo */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* These positions are approximate based on the generated logo geometry */}
                    {[
                        { top: '45%', left: '38%' }, // Q node
                        { top: '65%', left: '42%' }, // Q tail
                        { top: '45%', left: '62%' }, // K node
                        { top: '65%', left: '58%' }, // K leg
                        { top: '35%', left: '50%' }, // Center apex base
                    ].map((pos, idx) => (
                        <motion.div
                            key={idx}
                            variants={nodeVariants}
                            animate="pulse"
                            className="absolute w-2 h-2 bg-red-400 rounded-full blur-sm"
                            style={pos}
                        />
                    ))}
                </div>
            </div>

            {/* Subtle glow behind the entire logo */}
            <div className="absolute inset-0 bg-red-950/20 blur-[100px] -z-10 rounded-full shadow-[0_0_100px_rgba(153,0,0,0.1)]" />
        </div>
    );
}
