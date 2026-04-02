import { useEffect, useRef } from "react";
import gsap from "gsap";
import heroBg from "@/assets/hero-bg.jpg";
// import Scene3D from "./Scene3D"; // Раскомментируй, когда понадобится

interface HeroSectionProps {
  scrollProgress: number;
  onNavigate: (index: number) => void;
}

const HeroSection = ({ scrollProgress, onNavigate }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(titleRef.current, { y: 120, opacity: 0, duration: 1.4, ease: "power4.out" })
      .from(subtitleRef.current, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .from(lineRef.current, { scaleX: 0, duration: 1.2, ease: "power2.inOut" }, "-=0.6")
      .from(featuresRef.current, { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
  }, []);

  return (
    <section ref={containerRef} className="section-panel flex items-center justify-center relative min-h-screen">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Фон студии" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>
      
      {/* <Scene3D scrollProgress={scrollProgress} /> */}

      <div className="relative z-20 text-center px-6 md:px-8 max-w-5xl w-full">
        {/* Верхний сабтайтл */}
        <div className="overflow-hidden mb-6">
          <p className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-primary mb-4 opacity-80">
            Веб-разработка & Дизайн
          </p>
        </div>
        
        {/* Главный заголовок */}
        <div className="overflow-hidden">
          <h1 ref={titleRef} className="font-display text-7xl md:text-[10rem] leading-[0.85] font-bold tracking-tight drop-shadow-2xl">
            <span className="text-gradient-gold">Code</span>
            <br />
            <span className="text-gradient-gold text-7xl md:text-[8rem]">LAB</span>
          </h1>
        </div>
        
        {/* Декоративная линия */}
        <div ref={lineRef} className="w-16 md:w-21 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto my-10 origin-center opacity-50" />
        
        {/* Обновленный текст описания */}
        <p ref={subtitleRef} className="font-body text-gray-400 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed md:leading-loose tracking-wide">
          Создаем сайты, которые приносят результат. Беремся за{' '}
          <span className="text-gradient-gold font-medium tracking-wide mx-1 drop-shadow-md">
            проекты любой сложности
          </span>
          — от стильных визиток до мощных интернет-магазинов. 
          <span className="block mt-2 md:mt-1 text-white/70">
            Безупречный код и современный дизайн.
          </span>
        </p>

        {/* Обновленный блок с ценой и преимуществами */}
        <div ref={featuresRef} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mt-12 w-full">
          
          {/* Плашка с ценой (Glassmorphism + Glow) */}
          <div className="relative group cursor-default">
            {/* Эффект свечения на фоне */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md transition-all duration-700 group-hover:bg-primary/40 group-hover:blur-xl" />
            <div className="relative px-6 py-3 md:px-8 md:py-3.5 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors duration-500 group-hover:border-primary/60">
              <span className="font-body text-primary tracking-[0.15em] text-xs md:text-sm uppercase font-medium">
                Цены от 199 BYN
              </span>
            </div>
          </div>

          {/* Декоративный разделитель (скрыт на мобилках) */}
          <span className="hidden md:inline-block text-primary/40 text-lg animate-pulse-glow">✦</span>

          {/* Список услуг */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 font-body tracking-[0.2em] uppercase text-[10px] md:text-xs text-muted-foreground/70">
            <span className="hover:text-primary transition-colors duration-300 cursor-default">Лендинги</span>
            <span className="hidden md:inline-block text-muted-foreground/30">/</span>
            <span className="hover:text-primary transition-colors duration-300 cursor-default">Корпоративные сайты</span>
            <span className="hidden md:inline-block text-muted-foreground/30">/</span>
            <span className="hover:text-primary transition-colors duration-300 cursor-default">E-commerce</span>
          </div>
        </div>

        {/* Кнопка */}
        <button
          data-cursor-hover
          onClick={() => onNavigate(1)}
          className="magnetic-btn mt-14 px-10 py-4 border border-primary/50 font-body text-xs tracking-[0.3em] uppercase text-primary hover:bg-primary hover:text-black transition-all duration-500 backdrop-blur-sm"
        >
          Обсудить проект
        </button>
      </div>

      {/* Плавающие элементы по углам */}
      <div className="absolute bottom-8 right-8 z-20 font-body text-[10px] md:text-xs tracking-[0.2em] uppercase text-muted-foreground animate-pulse-glow">
        Листайте вниз →
      </div>
    </section>
  );
};

export default HeroSection;