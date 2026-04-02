"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DashaClock() {
    const router = useRouter();
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
                letterSpacing: "30px",
                opacity: 0,
                filter: "blur(20px)",
                duration: 1.5,
            });

            // Infinite rotate animation for background ring
            gsap.to(".clock-ring", {
                rotation: 360,
                repeat: -1,
                ease: "linear",
                duration: 40
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center bg-[#FAFAF7] overflow-hidden py-24 border-y border-[#1a1a1a]/5">

            {/* Background Clock Ring Light Mode */}
            <div className="clock-ring absolute w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] border-[1px] border-[#D4AF37]/20 rounded-full border-dashed"></div>
            <div className="clock-ring absolute w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] border-[1px] border-[#B8860B]/10 rounded-full border-dotted animation-reverse" style={{ animationDirection: "reverse", animationDuration: "60s" }}></div>

            <div className="z-10 text-center px-4">
                <p className="font-[family-name:var(--font-space)] text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-6 font-medium">Your Apex Window Closes In</p>

                <h2 ref={timeRef} className="font-[family-name:var(--font-display)] text-5xl md:text-8xl lg:text-[9rem] font-bold text-[#1a1a1a] tabular-nums tracking-tighter drop-shadow-sm">
                    00:14:22:51
                </h2>

                <p className="mt-10 font-[family-name:var(--font-outfit)] text-lg md:text-2xl text-[#1a1a1a]/70 max-w-2xl mx-auto leading-relaxed font-light">
                    You are sleeping through your most statistically dominant era. <br />
                    <span className="text-[#B8860B] font-medium mt-2 block">Every second you wait is a strategic opportunity lost.</span>
                </p>

                <button
                    onClick={() => router.push('/reviews')}
                    className="group relative mt-14 px-10 py-4 bg-transparent border border-[#1a1a1a]/20 text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-500 font-mono text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-space)] overflow-hidden"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a1a1a]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    Decode Your Timing
                </button>
            </div>
        </section>
    );
}
