"use client";

import React, { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  swaySpeed: number;     // سرعة التذبذب الجانبي
  swayAmplitude: number; // مدى اتساع الموجة
  swayOffset: number;    // زاوية البداية لتوزيع الحركة
  offsetX: number;       // الإزاحة الناتجة عن الماوس (X)
  offsetY: number;       // الإزاحة الناتجة عن الماوس (Y)
}

const EmeraldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // تتبع موقع الماوس
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120, // نطاق تأثير الماوس
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const dropsCount = 65;
    const drops: Drop[] = Array.from({ length: dropsCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4.5 + 2.5,
      speed: Math.random() * 0.45 + 0.15,
      opacity: Math.random() * 0.35 + 0.25,
      swaySpeed: Math.random() * 0.012 + 0.005,
      swayAmplitude: Math.random() * 25 + 10,
      swayOffset: Math.random() * Math.PI * 2,
      offsetX: 0,
      offsetY: 0,
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      drops.forEach((drop) => {
        ctx.save();

        // حساب حركة الاهتزاز الجانبية
        const sway = Math.sin(time * drop.swaySpeed * 60 + drop.swayOffset) * drop.swayAmplitude;
        const baseX = drop.x + sway;
        const baseY = drop.y;

        // حساب المسافة بين الماوس والفقاعة
        const dx = (baseX + drop.offsetX) - mouse.x;
        const dy = (baseY + drop.offsetY) - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // التفاعل مع الماوس
        if (distance < mouse.radius && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          drop.offsetX += Math.cos(angle) * force * 3;
          drop.offsetY += Math.sin(angle) * force * 3;
        }

        // العودة النيرّة للموقع الأصلي
        drop.offsetX *= 0.92;
        drop.offsetY *= 0.92;

        const currentX = baseX + drop.offsetX;
        const currentY = baseY + drop.offsetY;

        // التدرج الشعاعي باستخدام اللونين المطلوبين
        const radialGradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          drop.radius * 2.5
        );

        // #00ff3b -> RGBA(0, 255, 59)   (اللون النيون الفوسفوري الساطع في المركز)
        // #006d19 -> RGBA(0, 109, 25)   (اللون الأخضر الزمردي الغامق للعمق)
        radialGradient.addColorStop(0, `rgba(0, 255, 59, ${drop.opacity * 0.9})`);
        radialGradient.addColorStop(0.5, `rgba(0, 109, 25, ${drop.opacity * 0.6})`);
        radialGradient.addColorStop(1, "rgba(0, 255, 59, 0)");

        ctx.beginPath();
        ctx.arc(currentX, currentY, drop.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = radialGradient;
        ctx.fill();

        // بريق ناصع في منتصف الفقاعة باللون النيون #00ff3b
        ctx.beginPath();
        ctx.arc(currentX, currentY, drop.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 59, ${drop.opacity * 0.7})`;
        ctx.fill();

        ctx.restore();

        // تحريك القطرة للأعلى
        drop.y -= drop.speed;

        // إعادة القطرة للأسفل عند وصولها للقمة
        if (drop.y < -30) {
          drop.y = height + 30;
          drop.x = Math.random() * width;
          drop.swayOffset = Math.random() * Math.PI * 2;
          drop.offsetX = 0;
          drop.offsetY = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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

export default EmeraldBackground;


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