"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            // Prevent Lenis from hijacking scroll inside elements with data-lenis-prevent
            prevent: (node: Element) => {
                return (
                    node.hasAttribute("data-lenis-prevent") ||
                    node.closest("[data-lenis-prevent]") !== null ||
                    node.hasAttribute("data-modal-scroll") ||
                    node.closest("[data-modal-scroll]") !== null
                );
            },
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
