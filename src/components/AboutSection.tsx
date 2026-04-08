import React, { useEffect, useRef, Suspense } from "react";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

import sectionAbout from "@/assets/section-about.jpg";
import gallery1 from "@/assets/gallery-1.jpg";

// --- 3D Model Components ---

const Model = () => {
  const { scene } = useGLTF("/models/appl_e_iph_one_16/scene.gltf");
  
  // Адаптивный масштаб: +5% от предыдущего (21 на мобильных, 21 на ПК)
  const [scale, setScale] = React.useState(21);

  React.useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 1024 ? 21 : 21);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <primitive 
      object={scene} 
      scale={scale} 
      position={[0, -1.2, 0]} 
      rotation={[0, -Math.PI / 4, 0]} 
    />
  );
};

useGLTF.preload("/models/appl_e_iph_one_16/scene.gltf");

const IPhoneViewer: React.FC = () => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={9} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[0, -10, 0]} intensity={5} />
        
        <Environment preset="city" />
        
        <Suspense fallback={<Html center><span className="text-white/50 text-sm">Загрузка 3D...</span></Html>}>
          <Model />
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

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
          <div
            ref={imageRef}
            className="relative z-10 w-72 h-[420px] sm:w-80 sm:h-[480px] lg:w-86 lg:h-[77vh] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] lg:shadow-2xl border border-white/5 lg:border-none bg-black/20 backdrop-blur-sm rounded-xl"
          >
            {/* Подсказка для вращения (появляется поверх 3D) */}
            <div className="absolute top-3 right-3 lg:top-6 lg:right-6 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-white/70 select-none pointer-events-none">
              <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              <span>Покрутите</span>
            </div>
            
            <IPhoneViewer />
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
