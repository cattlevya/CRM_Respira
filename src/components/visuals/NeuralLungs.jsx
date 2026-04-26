import React, { useRef, useEffect } from 'react';

const NeuralLungs = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const particleCount = 1200; // High density
        const connectionDistance = 25;
        const mouse = { x: null, y: null, radius: 150 };

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseX = 0;
                this.baseY = 0;
                this.density = (Math.random() * 30) + 1;
                this.reposition(true);
            }

            reposition(force = false) {
                // Anatomical Shape Filter (Simplified Lungs)
                let valid = false;
                let attempts = 0;

                while (!valid && attempts < 100) {
                    const cx = canvas.width / 2;
                    const cy = canvas.height / 2;

                    // Random point in canvas
                    const rx = Math.random() * canvas.width;
                    const ry = Math.random() * canvas.height;

                    // Left Lung (Ellipse)
                    // (x - h)^2 / a^2 + (y - k)^2 / b^2 <= 1
                    const lx = cx - 80;
                    const ly = cy;
                    const la = 70;
                    const lb = 120;
                    const inLeft = ((rx - lx) ** 2 / la ** 2) + ((ry - ly) ** 2 / lb ** 2) <= 1;

                    // Right Lung (Ellipse)
                    const r_x = cx + 80;
                    const r_y = cy;
                    const ra = 70;
                    const rb = 120;
                    const inRight = ((rx - r_x) ** 2 / ra ** 2) + ((ry - r_y) ** 2 / rb ** 2) <= 1;

                    // Trachea (Rectangle)
                    const inTrachea = (Math.abs(rx - cx) < 15) && (ry < cy - 80) && (ry > cy - 160);

                    if (inLeft || inRight || inTrachea) {
                        this.x = rx;
                        this.y = ry;
                        this.baseX = rx;
                        this.baseY = ry;
                        valid = true;
                    }
                    attempts++;
                }

                // Fallback if shape fitting fails (shouldn't happen often)
                if (!valid && force) {
                    this.x = canvas.width / 2;
                    this.y = canvas.height / 2;
                    this.baseX = this.x;
                    this.baseY = this.y;
                }
            }

            update() {
                // Mouse Interaction (Fluid Physics)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        // Elastic return
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx / 20;
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy / 20;
                        }
                    }
                } else {
                    // Return to base if no mouse
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 20;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 20;
                    }
                }

                // Natural Jitter (Brownian Motion)
                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.fillStyle = 'rgba(6, 182, 212, 0.8)'; // Cyan-500
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Connections (Artery Effect)
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'; // Faint Cyan
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect neighbors
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);

        // Track mouse relative to canvas
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Initial setup
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default NeuralLungs;
