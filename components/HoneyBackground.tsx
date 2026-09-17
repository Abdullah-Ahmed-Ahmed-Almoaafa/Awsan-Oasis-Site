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

    // إنشاء 60 قطرة عسل دافئة وناعمة
    const dropsCount = 60;
    const drops: Drop[] = Array.from({ length: dropsCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2.5,   // زيادة طفيفة في الحجم لتستوعب التلاشي الناعم
      speed: Math.random() * 0.5 + 0.15, // حركة انسيابية بطيئة
      opacity: Math.random() * 0.35 + 0.25, // درجة شفافية ناعمة للغاية
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drops.forEach((drop) => {
        ctx.save();
        
        // إنشاء تدرج شعاعي يعطي تأثير الضبابية والنعومة (Blur Effect)
        const radialGradient = ctx.createRadialGradient(
          drop.x,
          drop.y,
          0,
          drop.x,
          drop.y,
          drop.radius * 2 // إشعاع هالة التلاشي
        );

        // مركز دافئ ونواة متدرجة للخارج بنعومة
        radialGradient.addColorStop(0, `rgba(217, 119, 6, ${drop.opacity})`);
        radialGradient.addColorStop(0.4, `rgba(180, 83, 9, ${drop.opacity * 0.5})`);
        radialGradient.addColorStop(1, "rgba(217, 119, 6, 0)"); // تلاشي كامل عند الأطراف

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = radialGradient;
        ctx.fill();
        ctx.restore();

        // تحريك القطرة للأعلى
        drop.y -= drop.speed;

        // إعادة القطرة للأسفل عند وصولها للقمة
        if (drop.y < -20) {
          drop.y = height + 20;
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


// "use client";

// import React, { useEffect, useRef } from "react";

// interface Sparkle {
//   x: number;
//   y: number;
//   size: number;
//   opacity: number;
//   speedX: number;
//   speedY: number;
//   life: number;
//   maxLife: number;
// }

// interface Meteor {
//   x: number;
//   y: number;
//   length: number;
//   speed: number;
//   size: number;
//   opacity: number;
//   active: boolean;
//   willExplode: boolean;
//   explodeY: number;
//   hasExploded: boolean;
//   sparkles: Sparkle[];
// }

// const HoneyBackground: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let animationFrameId: number;
//     let width = (canvas.width = window.innerWidth);
//     let height = (canvas.height = window.innerHeight);

//     const handleResize = () => {
//       if (!canvas) return;
//       width = canvas.width = window.innerWidth;
//       height = canvas.height = window.innerHeight;
//     };

//     window.addEventListener("resize", handleResize);

//     const meteors: Meteor[] = [];

//     // دالة إنشاء الشرارات العامة أو شرارات الانفجار الدائرية
//     const createBurstSparkles = (x: number, y: number, count: number) => {
//       const sparkles: Sparkle[] = [];
//       for (let i = 0; i < count; i++) {
//         const angle = Math.random() * Math.PI * 2;
//         const speed = Math.random() * 3.5 + 1;
//         sparkles.push({
//           x,
//           y,
//           size: Math.random() * 2.2 + 0.8,
//           opacity: Math.random() * 0.8 + 0.2,
//           speedX: Math.cos(angle) * speed,
//           speedY: Math.sin(angle) * speed,
//           life: 0,
//           maxLife: Math.random() * 30 + 20,
//         });
//       }
//       return sparkles;
//     };

//     const triggerMeteorShower = () => {
//       const count = Math.floor(Math.random() * 5) + 6;

//       for (let i = 0; i < count; i++) {
//         const willExplode = Math.random() < 0.35; // 35% احتمال انفجار الشهاب
//         meteors.push({
//           x: Math.random() * (width * 0.85) + width * 0.15,
//           y: -50 - Math.random() * 350,
//           length: Math.random() * 90 + 60,
//           speed: Math.random() * 5 + 4.5,
//           size: Math.random() * 2 + 1.2,
//           opacity: Math.random() * 0.35 + 0.5,
//           active: true,
//           willExplode,
//           explodeY: Math.random() * (height * 0.5) + height * 0.2, // نقطة الانفجار في منتصف الشاشة
//           hasExploded: false,
//           sparkles: [],
//         });
//       }
//     };

//     const scheduleNextShower = () => {
//       const delay = Math.random() * 4000 + 5000;
//       setTimeout(() => {
//         triggerMeteorShower();
//         scheduleNextShower();
//       }, delay);
//     };

//     setTimeout(triggerMeteorShower, 1000);
//     scheduleNextShower();

//     const render = () => {
//       ctx.clearRect(0, 0, width, height);

//       meteors.forEach((m) => {
//         if (!m.active) return;

//         // 1. فحص لحظة الانفجار في منتصف الرحلة
//         if (m.willExplode && !m.hasExploded && m.y >= m.explodeY) {
//           m.hasExploded = true;
//           // إطلاق 25 شرارة متوهجة في جميع الاتجاهات
//           m.sparkles.push(...createBurstSparkles(m.x, m.y, 25));
//         }

//         // 2. إذا لم ينفجر بعد، استمر بإنشاء الشرار الخلفي العادي
//         if (!m.hasExploded) {
//           for (let k = 0; k < 2; k++) {
//             m.sparkles.push({
//               x: m.x + (Math.random() * 8 - 4),
//               y: m.y + (Math.random() * 8 - 4),
//               size: Math.random() * 1.8 + 0.6,
//               opacity: Math.random() * 0.7 + 0.3,
//               speedX: (Math.random() - 0.5) * 1.2,
//               speedY: Math.random() * 0.8 + 0.2,
//               life: 0,
//               maxLife: Math.random() * 25 + 15,
//             });
//           }
//         }

//         // 3. تحديث ورسم كافة الشرارات (العادية وشرارات الانفجار)
//         m.sparkles.forEach((s, idx) => {
//           s.x += s.speedX;
//           s.y += s.speedY;
//           s.speedX *= 0.96; // تباطؤ ناعم لشرار الانفجار
//           s.speedY *= 0.96;
//           s.life++;
//           const currentOpacity = s.opacity * (1 - s.life / s.maxLife);

//           if (currentOpacity > 0) {
//             ctx.save();
//             ctx.beginPath();
//             ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
//             ctx.fillStyle = `rgba(251, 191, 36, ${currentOpacity})`;
//             ctx.shadowColor = "rgba(245, 158, 11, 0.9)";
//             ctx.shadowBlur = 6;
//             ctx.fill();
//             ctx.restore();
//           } else {
//             m.sparkles.splice(idx, 1);
//           }
//         });

//         // 4. رسم رأس وذيل الشهاب طالما لم ينفجر
//         if (!m.hasExploded) {
//           const tailX = m.x + m.length * 0.7;
//           const tailY = m.y - m.length * 0.7;

//           const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
//           gradient.addColorStop(0, `rgba(245, 158, 11, ${m.opacity})`);
//           gradient.addColorStop(0.35, `rgba(180, 83, 9, ${m.opacity * 0.7})`);
//           gradient.addColorStop(1, "rgba(245, 158, 11, 0)");

//           ctx.save();
//           ctx.beginPath();
//           ctx.moveTo(m.x, m.y);
//           ctx.lineTo(tailX, tailY);
//           ctx.strokeStyle = gradient;
//           ctx.lineWidth = m.size;
//           ctx.lineCap = "round";
//           ctx.shadowColor = "rgba(217, 119, 6, 0.5)";
//           ctx.shadowBlur = 8;
//           ctx.stroke();

//           // رأس الشهاب
//           ctx.beginPath();
//           ctx.arc(m.x, m.y, m.size * 1.4, 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(254, 243, 199, ${m.opacity})`;
//           ctx.fill();
//           ctx.restore();

//           // تحريك الشهاب
//           m.x -= m.speed * 0.85;
//           m.y += m.speed * 0.85;
//         }

//         // إيقاف الشهاب بعد خروجه أو انفجاره وانتهاء شُراره
//         if (
//           (m.hasExploded || m.y > height + 120 || m.x < -120) &&
//           m.sparkles.length === 0
//         ) {
//           m.active = false;
//         }
//       });

//       animationFrameId = requestAnimationFrame(render);
//     };

//     render();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 pointer-events-none z-0"
//       style={{ background: "transparent" }}
//     />
//   );
// };

// export default HoneyBackground;