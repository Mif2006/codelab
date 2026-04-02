import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import CustomCursor from "@/components/CustomCursor";
import NavigationDots from "@/components/NavigationDots";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import StarsCanvas from "@/components/Starbackground";

const SECTIONS = 5;

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Проверка размера экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigateTo = useCallback((index: number) => {
    if (isAnimating.current || index === activeIndex || index < 0 || index >= SECTIONS) return;
    
    // На мобилках просто скроллим к элементу (если нужно программно)
    if (isMobile) {
      const target = document.querySelectorAll('.section-panel')[index];
      target?.scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(index);
      return;
    }

    // Логика для десктопа (GSAP)
    isAnimating.current = true;
    const container = containerRef.current;
    if (!container) return;

    gsap.to(container, {
      x: -index * window.innerWidth,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        setScrollProgress(index / (SECTIONS - 1));
      },
      onComplete: () => {
        setActiveIndex(index);
        isAnimating.current = false;
      },
    });
  }, [activeIndex, isMobile]);

  useEffect(() => {
    if (isMobile) return; // Выключаем перехват колеса на мобилках

    let accumulated = 0;
    const threshold = 80;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      accumulated += e.deltaY;
      if (Math.abs(accumulated) > threshold) {
        if (accumulated > 0) navigateTo(activeIndex + 1);
        else navigateTo(activeIndex - 1);
        accumulated = 0;
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigateTo(activeIndex + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigateTo(activeIndex - 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, navigateTo, isMobile]);

  // Отслеживание активной секции при обычном скролле (для мобилок)
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollY / windowHeight);
      if (newIndex !== activeIndex) setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, activeIndex]);

  return (
    <div className={`${isMobile ? "relative overflow-y-auto" : "fixed inset-0 overflow-hidden"} bg-background`}>
      {/* <CustomCursor /> */}
   
      {/* Навигация (скрываем на мобилках для чистоты или оставляем как бургер) */}
      {!isMobile && <NavigationDots activeIndex={activeIndex} onNavigate={navigateTo} />}
      
      {/* Прогресс-бар (сверху) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100]">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${((activeIndex) / (SECTIONS - 1)) * 100}%`,
            background: "var(--gradient-gold, gold)",
          }}
        />
      </div>

      {/* Счетчик секций (внизу слева) */}
      <div className="fixed bottom-8 left-8 z-50 font-body text-xs tracking-[0.2em] text-muted-foreground mix-blend-difference">
        <span className="text-primary font-display text-2xl">{String(activeIndex + 1).padStart(2, "0")}</span>
        <span className="mx-2">/</span>
        <span>{String(SECTIONS).padStart(2, "0")}</span>
      </div>

      {/* Контейнер панелей */}
      <div
        ref={containerRef}
        className={`flex ${isMobile ? "flex-col w-full h-auto" : "h-screen"}`}
        style={{ 
          width: isMobile ? "100%" : `${SECTIONS * 100}vw`,
          // На мобильных отключаем трансформацию GSAP
          transform: isMobile ? "none" : undefined 
        }}
      >
        <HeroSection scrollProgress={scrollProgress} onNavigate={navigateTo} />
        {/* isActive={true} на мобилках, чтобы анимации срабатывали при скролле */}
        <ProjectsSection isActive={isMobile ? true : activeIndex === 1} />
        <GallerySection isActive={isMobile ? true : activeIndex === 2} />
        <AboutSection isActive={isMobile ? true : activeIndex === 3} />
        <ContactSection isActive={isMobile ? true : activeIndex === 4} />

      </div>
    </div>
  );
};

export default Index;