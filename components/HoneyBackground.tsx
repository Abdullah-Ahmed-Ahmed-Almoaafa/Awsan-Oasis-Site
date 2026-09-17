"use client";

import React, { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
}

const HoneyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // إنشاء 60 قطرة عسل دافئة وواضحة
    const dropsCount = 60;
    const drops: Drop[] = Array.from({ length: dropsCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.5, // حجم القطرة
      speed: Math.random() * 0.6 + 0.2,   // سرعة الصعود البطيئة (لزوجة العسل)
      opacity: Math.random() * 0.5 + 0.4, // درجة وضوح مناسبة للخلفية البيضاء
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        // لون عسلي غامق وواضح على الخلفية البيضاء (Amber-600/700)
        ctx.fillStyle = `rgba(180, 83, 9, ${drop.opacity})`;
        ctx.shadowColor = "rgba(217, 119, 6, 0.5)";
        ctx.shadowBlur = 4;
        ctx.fill();

        // تحريك القطرة للأعلى
        drop.y -= drop.speed;

        // إعادة القطرة للأسفل عند وصولها القمة
        if (drop.y < -10) {
          drop.y = height + 10;
          drop.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default HoneyBackground;