import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

import Web1 from "@/assets/Web1.jpeg";
import Web2 from "@/assets/Web2.jpg";
import Web3 from "@/assets/Web3.jpeg";
import Web4 from "@/assets/Web4.jpeg";
import Web5 from "@/assets/Web5.jpeg";
import Web6 from "@/assets/Web6.jpeg";
import sectionLandscape from "@/assets/section-landscape.jpg";

const images = [Web1, Web2, Web3, Web4, Web5, Web6];

const GallerySection = ({ isActive }: { isActive: boolean }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<any>(null);
  const staticTextRef = useRef<any>(null);
  const marqueeWrapperRef = useRef<any>(null);
  const marqueeTextRef = useRef<any>(null);
  const leftIconRef = useRef<any>(null);
  const rightIconRef = useRef<any>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const staticText = staticTextRef.current;
    const marqueeWrapper = marqueeWrapperRef.current;
    const marqueeText = marqueeTextRef.current;
    const leftIcon = leftIconRef.current;
    const rightIcon = rightIconRef.current;

    gsap.set(marqueeWrapper, { yPercent: 100, opacity: 0 });

    const hoverTl = gsap.timeline({ paused: true });

    hoverTl
      .to(staticText, { yPercent: -100, opacity: 0, duration: 0.4, ease: "power3.inOut" }, 0)
      .to(marqueeWrapper, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.inOut" }, 0)
      .to([leftIcon, rightIcon], { rotation: 90, scale: 1.2, duration: 0.4, ease: "back.out(1.7)" }, 0);

    // ✅ TRUE infinite marquee (no reset)
    const contentWidth = marqueeText.scrollWidth / 2;
    const wrap = gsap.utils.wrap(-contentWidth, 0);

    const scrollAnim = gsap.to(marqueeText, {
      x: `-=${contentWidth}`,
      duration: 24,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${wrap(parseFloat(x))}px`,
      },
      paused: true,
    });

    const handleMouseEnter = () => {
      hoverTl.play();
      scrollAnim.play();
    };

    const handleMouseLeave = () => {
      hoverTl.reverse();
      setTimeout(() => scrollAnim.pause(), 400);
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
      }
      if (mobileTitleRef.current) {
        gsap.fromTo(mobileTitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
      }
    }
  }, [isActive]);

  return (
    <section className="section-panel flex flex-col relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={sectionLandscape} alt="Landscape" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="absolute top-0 left-0 right-0 overflow-hidden py-6 z-10 border-b border-border">
        <div ref={marqueeRef} className="marquee-track whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-display text-8xl text-outline mx-8 select-none">
              ПРОЕКТЫ
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center pt-24 pb-16">
        <div className="hidden md:block px-16 mb-8">
          <h2 ref={titleRef} className="font-display text-5xl font-bold text-foreground">
            Наши <span className="text-gradient-gold">Проекты</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm mt-2 max-w-md">
            Коллекция наших лучших веб-решений, продуманных интерфейсов и уникального дизайна.
          </p>
        </div>

        <div className="block md:hidden px-6 mb-10 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-primary/80"></div>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary font-medium">
              Избранное
            </span>
          </div>
          <h2
            ref={mobileTitleRef}
            className="font-display text-6xl font-black text-foreground leading-[0.9] tracking-tighter uppercase"
          >
            Наши <br />
            <span className="text-gradient-gold inline-block mt-1">Проекты</span>
          </h2>
          <p className="font-body text-muted-foreground text-xs mt-6 max-w-[280px] mx-auto border-l-[1px] border-primary/40 pl-4 text-left leading-relaxed">
            Коллекция лучших веб-решений и уникального дизайна для вашего бизнеса.
          </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <Swiper
            modules={[EffectCoverflow, Autoplay]}
            effect="coverflow"
            grabCursor
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2.5,
              slideShadows: false,
            }}
            className="w-full overflow-visible"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className="max-w-[85vw] md:max-w-[45vw]">
                <div className="relative aspect-video w-full overflow-hidden group border border-white/10">
                  <img
                    src={img}
                    alt={`Проект ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 font-body text-xs tracking-[0.3em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    КЕЙС {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ✅ FINAL FIXED BOTTOM BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#8C6A2F] flex bg-black">
        <button
          ref={buttonRef}
          className="relative flex items-center justify-between w-full h-20 md:h-24 px-6 md:px-12 overflow-hidden border border-[#8C6A2F] bg-black text-[#B8963F] transition-all duration-500 group cursor-pointer"
        >
          <div ref={leftIconRef} className="relative z-10 text-[#B8963F]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </div>

          <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center">
            <span
              ref={staticTextRef}
              className="absolute font-body text-[11px] md:text-sm tracking-[0.3em] uppercase whitespace-nowrap text-[#B8963F]"
            >
              О Нас
            </span>

            <div ref={marqueeWrapperRef} className="absolute flex w-full h-full items-center pointer-events-none">
              <div
                ref={marqueeTextRef}
                className="flex whitespace-nowrap font-display text-lg md:text-2xl tracking-widest uppercase text-[#B8963F]"
              >
                <span className="flex">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <span key={j} className="mx-6">
                      ВЕБ-ДИЗАЙН • РАЗРАБОТКА • SEO • БРЕНДИНГ
                    </span>
                  ))}
                </span>

                <span className="flex">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <span key={j} className="mx-6">
                      ВЕБ-ДИЗАЙН • РАЗРАБОТКА • SEO • БРЕНДИНГ
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div ref={rightIconRef} className="relative z-10 text-[#B8963F]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
};

export default GallerySection;