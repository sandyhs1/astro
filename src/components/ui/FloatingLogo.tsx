"use client";

import Link from "next/link";
import AnimatedLogo from "./AnimatedLogo";

interface FloatingLogoProps {
    position?: "left" | "right";
}

export default function FloatingLogo({ position = "left" }: FloatingLogoProps) {
    return (
        <Link
            href="/"
            className={`fixed top-4 md:top-6 ${position === "left" ? "left-4 md:left-6" : "right-4 md:right-6"} z-[100] transition-transform hover:scale-105`}
        >
            <div className="pointer-events-none">
                <AnimatedLogo isFloating={true} />
            </div>
        </Link>
    );
}
