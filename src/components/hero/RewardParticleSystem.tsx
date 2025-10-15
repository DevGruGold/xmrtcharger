import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface RewardParticleSystemProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const RewardParticleSystem = ({ isActive, onComplete }: RewardParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const particleCount = 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;

    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 5 + Math.random() * 5;
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Upward bias
        life: 1.0,
        size: 3 + Math.random() * 4,
        color: ['#00B8FF', '#B24BF3', '#00FFF7', '#00FF88'][Math.floor(Math.random() * 4)],
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particlesRef.current.forEach(particle => {
        if (particle.life <= 0) return;
        activeParticles++;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3; // Gravity
        particle.life -= 0.02;

        // Draw particle
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (activeParticles > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ background: 'transparent' }}
    />
  );
};
