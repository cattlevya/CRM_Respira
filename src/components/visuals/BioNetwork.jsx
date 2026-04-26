import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const BioNetwork = () => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            className="absolute inset-0 z-0"
            init={particlesInit}
            options={{
                fullScreen: { enable: false },
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.5
                            }
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#60a5fa", "#22d3ee"], // Brighter Blue & Cyan
                    },
                    links: {
                        color: "#94a3b8", // Slate-400 (More visible than 300)
                        distance: 150,
                        enable: true,
                        opacity: 0.5, // Increased from 0.3
                        width: 1.5, // Increased from 1
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1.5, // Slightly faster
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 100, // Increased from 80
                    },
                    opacity: {
                        value: 0.8, // Increased from 0.5
                        random: true,
                        anim: {
                            enable: true,
                            speed: 0.5,
                            opacity_min: 0.4, // Increased from 0.3
                            sync: false
                        }
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 }, // Reduced from 2-5
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default BioNetwork;
