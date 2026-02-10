"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DashaClock() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!containerRef.current || !timeRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the numbers counting down or shifting
            gsap.from(timeRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                },
                letterSpacing: "50px",
                opacity: 0,
                filter: "blur(20px)",
                duration: 1.5,
            });

            // Infinite rotate animation for background ring
            gsap.to(".clock-ring", {
                rotation: 360,
                repeat: -1,
                ease: "linear",
                duration: 20
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center bg-[#000] overflow-hidden py-24">

            {/* Background Clock Ring */}
            <div className="clock-ring absolute w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] border-[1px] border-[#FFD700]/20 rounded-full border-dashed"></div>
            <div className="clock-ring absolute w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] border-[1px] border-[#FFD700]/10 rounded-full border-dotted animation-reverse" style={{ animationDirection: "reverse", animationDuration: "30s" }}></div>

            <div className="z-10 text-center px-4">
                <p className="font-mono text-[#FFD700] text-sm uppercase tracking-[0.3em] mb-4">Your "Wealth Window" Closes In</p>

                <h2 ref={timeRef} className="font-mono text-5xl md:text-8xl lg:text-9xl font-bold text-white tabular-nums tracking-tighter">
                    00:14:22:51
                </h2>

                <p className="mt-8 font-serif text-2xl md:text-3xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    You are sleeping through your most powerful era. <br />
                    <span className="text-red-500 italic">Every second you wait is a fortune lost.</span>
                </p>

                <button className="mt-12 px-10 py-4 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 font-mono text-sm uppercase tracking-widest">
                    WAKE UP
                </button>
            </div>
        </section>
    );
}
