"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AnimatedLogo({ isFloating = false }: { isFloating?: boolean }) {
    const [particles, setParticles] = useState<{
        id: number;
        size: number;
        startX: number;
        startY: number;
        duration: number;
        delay: number;
        moveX: number;
        moveY: number;
    }[]>([]);

    useEffect(() => {
        // Generate particles only on the client to avoid hydration mismatch
        const newParticles = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            size: Math.random() * 3 + 1, // 1px to 4px
            startX: Math.random() * 100, // 0 to 100% of container width
            startY: Math.random() * 80 + 20, // 20% to 100% of container height
            moveX: Math.random() * 60 - 30, // drift left/right by -30 to 30px
            moveY: -(Math.random() * 150 + 100), // float up by 100-250px
            duration: Math.random() * 12 + 8, // 8 to 20 seconds
            delay: Math.random() * -20, // negative delay so they start immediately at different points
        }));

        // Use a timeout to avoid synchronous state update in effect warning
        const timer = setTimeout(() => {
            setParticles(newParticles);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={
            isFloating
                ? "relative inline-flex items-center justify-center mt-2"
                : "relative flex items-center justify-center p-10 mt-8 mb-8 w-full max-w-[800px] min-h-[300px]"
        }>
            {/* Background Particles Container */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={isFloating ? "relative w-[150%] h-[150%]" : "relative w-full h-[150%] max-w-[600px] -mt-20"}>
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full bg-[#d4af37]"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.startX}%`,
                                top: `${p.startY}%`,
                                boxShadow: `0 0 ${Math.max(4, p.size * 3)}px ${Math.max(2, p.size)}px rgba(212, 175, 55, 0.5)`,
                            }}
                            animate={{
                                y: [0, p.moveY],
                                x: [0, p.moveX],
                                opacity: [0, 0.8, 1, 0.8, 0],
                                scale: [0.5, 1, 1.2, 1, 0.5],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "linear",
                                times: [0, 0.2, 0.5, 0.8, 1]
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* The main Logo Image - FIXED, no animation at all */}
            <div className="relative z-10 w-full flex justify-center">
                <Image
                    src="/logo-transparent.png"
                    alt="Quantum Karma Logo"
                    width={500}
                    height={500}
                    className={
                        isFloating
                            ? "object-contain w-[120px] md:w-[150px]"
                            : "object-contain w-full max-w-[300px] md:max-w-[450px]"
                    }
                    priority
                />
            </div>
        </div>
    );
}
