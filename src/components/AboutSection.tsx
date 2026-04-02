import React, { useEffect, useRef, Suspense } from "react";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

import sectionAbout from "@/assets/section-about.jpg";
// portrait1 is removed as it's replaced by the 3D model
import gallery1 from "@/assets/gallery-1.jpg";

// --- 3D Model Components ---

const Model = () => {
  const { scene } = useGLTF("/models/appl_e_iph_one_16/scene.gltf");
  
  return (
    <primitive 
      object={scene} 
      scale={11} 
      position={[0, -0.9, 0]} 
      rotation={[0, -Math.PI / 4, 0]} 
    />
  );
};

useGLTF.preload("/models/appl_e_iph_one_16/scene.gltf");

const IPhoneViewer: React.FC = () => {
  return (
    // Changed to take up 100% of the parent container with a transparent background
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={9} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[0, -10, 0]} intensity={5} />
        
        <Environment preset="city" />
        
        {/* Inside Canvas, standard HTML must be wrapped in <Html> */}
        <Suspense fallback={<Html center><span className="text-white/50 text-sm">Загрузка 3D...</span></Html>}>
          <Model />
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

        {/* Disabled zoom/pan so it doesn't interrupt page scrolling */}
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      </Canvas>
    </div>
  );
};


// --- Main Section Component ---

const coreCapabilities = [
  { 
    title: "✓ Индивидуальный подход к каждому проекту", 
    desc: "Глубоко погружаемся в ваш бизнес, задачи и аудиторию, чтобы создать решение, которое действительно работает." 
  },
  { 
    title: "✓ Прозрачные сроки и бюджет", 
    desc: "Фиксируем этапы, стоимость и дедлайны заранее — без скрытых платежей и неожиданных изменений." 
  },
  { 
    title: "✓ Поддержка после запуска", 
    desc: "Не исчезаем после релиза — помогаем развивать, обновлять и масштабировать ваш проект." 
  },
  { 
    title: "✓ Современные технологии", 
    desc: "Используем актуальные инструменты и фреймворки для скорости, безопасности и масштабируемости." 
  },
  { 
    title: "✓ Ориентация на результат", 
    desc: "Создаём сайты, которые приносят заявки, увеличивают продажи и помогают вашему бизнесу расти." 
  },
];

const AboutSection = ({ isActive }: { isActive: boolean }) => {
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(75% at 50% 50%)", duration: 1.5, delay: 0.2, ease: "power3.inOut" }
        );
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: "power3.out" }
        );
      }

      featuresRef.current.forEach((feature, i) => {
        if (feature) {
          gsap.fromTo(
            feature,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 1, delay: 0.6 + i * 0.15, ease: "power3.out" }
          );
        }
      });
    }
  }, [isActive]);

  return (
    <section className="section-panel flex flex-col lg:flex-row relative w-full min-h-screen overflow-hidden py-20 lg:py-0">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={sectionAbout} alt="Фон студии" className="w-full h-full object-cover opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(0 0% 4% / 0.95), hsl(0 0% 4% / 0.80))",
          }}
        />
      </div>

      {/* Left: Image / 3D Model */}
      <div className="relative z-10 w-full lg:w-2/5 flex items-center justify-center mb-24 lg:mb-0 px-4 sm:px-0">
        <div className="relative mt-8 lg:mt-0">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/20 blur-[60px] rounded-full lg:hidden animate-pulse pointer-events-none" />

          {/* 3D Model Container */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-none z-20 transition-opacity duration-300">
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-white/80 text-[10px] sm:text-xs font-body tracking-wider uppercase whitespace-nowrap">
                Покрутите телефон
              </span>
            </div>
          <div
            ref={imageRef}
            className="relative z-10 w-72 h-84 sm:w-80 lg:w-86 lg:h-[77vh] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] lg:shadow-2xl border border-white/5 lg:border-none bg-black/20 backdrop-blur-sm rounded-xl"
          >
            <IPhoneViewer />
            
            {/* --- NEW: Interactive Hint --- */}
          
            {/* --------------------------- */}
            
          </div>

          {/* Floating Element (Gallery) */}
          <div className="absolute -bottom-10 -right-6 lg:-bottom-12 lg:-right-12 w-32 h-32 lg:w-40 lg:h-40 overflow-hidden border-2 border-gold glow-gold animate-float shadow-2xl z-20">
            <img src={gallery1} alt="Мокап сайта" className="w-full h-full object-cover" />
          </div>

          <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-16 h-16 lg:w-20 lg:h-20 border border-gold/40 z-20 pointer-events-none" />
          <div className="absolute -bottom-6 -left-2 lg:-bottom-4 lg:-left-8 font-display text-8xl text-outline select-none opacity-20 z-0 pointer-events-none">
            W
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="relative z-10 w-full lg:w-3/5 flex flex-col justify-center px-6 sm:px-12 lg:pr-24 lg:pl-12">
        
        <div ref={textRef}>
          <p className="font-body text-[10px] lg:text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Веб-студия
          </p>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            Мы создаем сайты,
            <br />
            <span className="text-gradient-gold italic">которые работают</span> на ваш бизнес.
          </h2>

          <p className="font-body text-muted-foreground text-sm lg:text-base leading-relaxed max-w-xl mb-10">
            От идеи до запуска — берем на себя все: дизайн, разработку, наполнение и SEO-оптимизацию.
            Фиксируем сроки и бюджет. Поддерживаем после запуска.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 max-w-xl">
          {coreCapabilities.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                featuresRef.current[i] = el;
              }}
              className="group pl-4 border-l-2 border-border hover:border-gold transition-colors duration-300"
            >
              <h3 className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutSection;