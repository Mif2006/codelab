import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

import Web1 from "@/assets/Web1.jpeg";
import Web2 from "@/assets/Web2.jpeg";
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
            <span key={i} className="font-display text-8xl text-outline mx-8 select-none">ПРОЕКТЫ</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center pt-24 pb-16">
        
        {/* --- COMPUTER VERSION HEADER (ORIGINAL) --- */}
        <div className="hidden md:block px-16 mb-8">
          <h2 ref={titleRef} className="font-display text-5xl font-bold text-foreground">
            Наши <span className="text-gradient-gold">Проекты</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm mt-2 max-w-md">
            Коллекция наших лучших веб-решений, продуманных интерфейсов и уникального дизайна.
          </p>
        </div>

        {/* --- MOBILE VERSION HEADER (BIG & STRIKING) --- */}
        <div className="block md:hidden px-6 mb-10 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-primary/80"></div>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary font-medium">Избранное</span>
          </div>
          <h2 ref={mobileTitleRef} className="font-display text-6xl font-black text-foreground leading-[0.9] tracking-tighter uppercase">
            Наши <br />
            <span className="text-gradient-gold inline-block mt-1">Проекты</span>
          </h2>
          <p className="font-body text-muted-foreground text-xs mt-6 max-w-[280px] mx-auto border-l-[1px] border-primary/40 pl-4 text-left leading-relaxed">
            Коллекция лучших веб-решений и уникального дизайна для вашего бизнеса.
          </p>
        </div>

        {/* Coverflow Swiper */}
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
              <SwiperSlide 
                key={i} 
                className="max-w-[85vw] md:max-w-[45vw]" // Bigger for mobile, original for desktop
              >
                <div className="relative aspect-video w-full overflow-hidden group border border-white/10" data-cursor-hover>
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

      {/* Bottom stats bar - Original layout for Desktop, Better grid for Mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-border flex flex-wrap md:flex-nowrap bg-background md:bg-transparent">
        {["Веб-дизайн", "Разработка", "SEO & Реклама", "Брендинг"].map((label, i) => (
          <div 
            key={i} 
            className="w-1/2 md:flex-1 py-4 px-8 border-r border-b md:border-b-0 border-border last:border-r-0 group" 
            data-cursor-hover
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">{label}</p>
            <p className="font-display text-2xl text-foreground mt-1">{[84, 62, 45, 31][i]}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;