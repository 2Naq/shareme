import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/**
 * Custom Hook to handle energy flow and particle animations for WiringDiagram
 * @param {React.RefObject} containerRef - Reference to the wiring diagram container DOM element
 * @param {Object} options
 * @param {number} options.loadCurrent - Load current in Amperes
 * @param {string} options.systemType - Electric system type ('1-phase', '3-phase', 'DC')
 */
export function useWiringAnimation(containerRef, { loadCurrent, systemType }) {
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous animations
    if (animRef.current) {
      animRef.current.forEach((a) => a.revert());
    }

    const anims = [];

    // 1. Energy dash stream flow animation (conduit effect)
    const hDashF = containerRef.current.querySelectorAll(".h-dash-forward");
    if (hDashF.length > 0) {
      anims.push(
        animate(hDashF, {
          strokeDashoffset: [0, -28],
          duration: 1000,
          loop: true,
          ease: "linear",
        }),
      );
    }

    const hDashR = containerRef.current.querySelectorAll(".h-dash-reverse");
    if (hDashR.length > 0) {
      anims.push(
        animate(hDashR, {
          strokeDashoffset: [0, 28],
          duration: 1000,
          loop: true,
          ease: "linear",
        }),
      );
    }

    const vDashF = containerRef.current.querySelectorAll(".v-dash-forward");
    if (vDashF.length > 0) {
      anims.push(
        animate(vDashF, {
          strokeDashoffset: [0, -28],
          duration: 1000,
          loop: true,
          ease: "linear",
        }),
      );
    }

    const vDashR = containerRef.current.querySelectorAll(".v-dash-reverse");
    if (vDashR.length > 0) {
      anims.push(
        animate(vDashR, {
          strokeDashoffset: [0, 28],
          duration: 1000,
          loop: true,
          ease: "linear",
        }),
      );
    }

    // 2. Electron flow animation (moving particles with smooth fade & scale, zero pause looping)
    if (loadCurrent > 0) {
      const wireSvg = containerRef.current.querySelector(".h-wire-svg");
      const wireWidth = wireSvg ? wireSvg.clientWidth || 240 : 240;
      const duration = Math.max(1000, 2600 - loadCurrent * 50);

      // Horizontal forward particles (Source -> Load)
      const hForward =
        containerRef.current.querySelectorAll(".h-particle-forward");
      if (hForward.length > 0) {
        hForward.forEach((el, idx) => {
          const wireIndexParticle = idx % 3;
          const initialTimeOffset = (wireIndexParticle * duration) / 3;
          const a = animate(el, {
            translateX: [0, wireWidth],
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: duration * 0.15 },
              { value: 1, duration: duration * 0.7 },
              { value: 0, duration: duration * 0.15 },
            ],
            scale: [0.75, 1.15, 0.75],
            duration,
            loop: true,
            ease: "linear",
          });
          a.seek(initialTimeOffset);
          anims.push(a);
        });
      }

      // Horizontal reverse particles (Load -> Source)
      const hReverse =
        containerRef.current.querySelectorAll(".h-particle-reverse");
      if (hReverse.length > 0) {
        hReverse.forEach((el, idx) => {
          const wireIndexParticle = idx % 3;
          const initialTimeOffset = (wireIndexParticle * duration) / 3;
          const a = animate(el, {
            translateX: [wireWidth, 0],
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: duration * 0.15 },
              { value: 1, duration: duration * 0.7 },
              { value: 0, duration: duration * 0.15 },
            ],
            scale: [0.75, 1.15, 0.75],
            duration,
            loop: true,
            ease: "linear",
          });
          a.seek(initialTimeOffset);
          anims.push(a);
        });
      }

      // Vertical forward particles (mobile) (Source -> Load)
      const vForward =
        containerRef.current.querySelectorAll(".v-particle-forward");
      if (vForward.length > 0) {
        vForward.forEach((el, idx) => {
          const wireIndexParticle = idx % 3;
          const initialTimeOffset = (wireIndexParticle * duration) / 3;
          const a = animate(el, {
            translateY: [0, 160],
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: duration * 0.15 },
              { value: 1, duration: duration * 0.7 },
              { value: 0, duration: duration * 0.15 },
            ],
            scale: [0.75, 1.15, 0.75],
            duration,
            loop: true,
            ease: "linear",
          });
          a.seek(initialTimeOffset);
          anims.push(a);
        });
      }

      // Vertical reverse particles (mobile) (Load -> Source)
      const vReverse =
        containerRef.current.querySelectorAll(".v-particle-reverse");
      if (vReverse.length > 0) {
        vReverse.forEach((el, idx) => {
          const wireIndexParticle = idx % 3;
          const initialTimeOffset = (wireIndexParticle * duration) / 3;
          const a = animate(el, {
            translateY: [160, 0],
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: duration * 0.15 },
              { value: 1, duration: duration * 0.7 },
              { value: 0, duration: duration * 0.15 },
            ],
            scale: [0.75, 1.15, 0.75],
            duration,
            loop: true,
            ease: "linear",
          });
          a.seek(initialTimeOffset);
          anims.push(a);
        });
      }
    }

    // 3. Pulse active values & glowing lines
    const glowAnim = animate(
      containerRef.current.querySelectorAll(".pulse-glow"),
      {
        opacity: [0.3, 0.75],
        duration: 1500,
        direction: "alternate",
        loop: true,
        ease: "inOutSine",
      },
    );
    anims.push(glowAnim);

    // 4. Entry cascade stagger
    const fadeAnim = animate(
      containerRef.current.querySelectorAll(".fade-cascade"),
      {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 600,
        delay: stagger(80),
        ease: "outCubic",
      },
    );
    anims.push(fadeAnim);

    animRef.current = anims;

    return () => {
      anims.forEach((a) => a.revert());
    };
  }, [loadCurrent, systemType, containerRef]);
}
