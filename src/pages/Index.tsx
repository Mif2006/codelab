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
import ChatWidget from "@/components/ChatBot";

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

    // На мобилках просто скроллим к элементу
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
    if (isMobile) return;

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

      {/* Navigation dots — desktop only */}
      {!isMobile && <NavigationDots activeIndex={activeIndex} onNavigate={navigateTo} />}

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100]">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${((activeIndex) / (SECTIONS - 1)) * 100}%`,
            background: "var(--gradient-gold, gold)",
          }}
        />
      </div>

      {/* Section counter — bottom left, desktop */}
      <div className="hidden md:flex items-center fixed bottom-8 left-8 z-50 font-body text-xs tracking-[0.2em] text-muted-foreground mix-blend-difference">
        <span className="text-primary font-display text-2xl">{String(activeIndex + 1).padStart(2, "0")}</span>
        <span className="mx-2">/</span>
        <span>{String(SECTIONS).padStart(2, "0")}</span>
      </div>

      {/* Sections container */}
      <div
        ref={containerRef}
        className={`flex ${isMobile ? "flex-col w-full h-auto" : "h-screen"}`}
        style={{
          width: isMobile ? "100%" : `${SECTIONS * 100}vw`,
          transform: isMobile ? "none" : undefined,
        }}
      >
        <HeroSection scrollProgress={scrollProgress} onNavigate={navigateTo} />
        <ProjectsSection isActive={isMobile ? true : activeIndex === 1} />
        <GallerySection isActive={isMobile ? true : activeIndex === 2} />
        <AboutSection isActive={isMobile ? true : activeIndex === 3} />
        <ContactSection isActive={isMobile ? true : activeIndex === 4} />
      </div>

      {/*
        ChatWidget is intentionally placed OUTSIDE the sections container.
        - position: fixed keeps it anchored to the viewport regardless of
          which section is active (desktop GSAP scroll) or how far the user
          has scrolled (mobile).
        - z-index 9999 in the widget ensures it floats above everything.
        - bottom: 100px in the widget clears the section counter text.
      */}
      <ChatWidget />
    </div>
  );
};

export default Index;