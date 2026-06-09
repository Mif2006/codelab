import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import sectionContact from "@/assets/section-contact.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const ContactSection = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+375",
    message: "",
    telegramUsername: "", // Новое поле
    preferredSocialNetwork: "", // Новое поле
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return "Введите имя";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Введите корректный email";
    if (!/^\d{6,15}$/.test(form.phone)) return "Введите корректный телефон";
    if (form.message.length < 5) return "Сообщение слишком короткое";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          message: form.message,
          telegramUsername: form.telegramUsername, // Новое поле
          preferredSocialNetwork: form.preferredSocialNetwork, // Новое поле
        }),
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        countryCode: "+375",
        message: "",
        telegramUsername: "", // Сброс нового поля
        preferredSocialNetwork: "", // Сброс нового поля
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

    } catch (err) {
      setIsSubmitting(false);
      setError("Ошибка отправки. Попробуйте позже.");
    }
  };

  const titleLines = ["Свяжитесь с", "нами"];

  useEffect(() => {
    if (isActive) {
      lettersRef.current.forEach((letter, i) => {
        if (letter) {
          gsap.fromTo(
            letter,
            { y: 120, rotateX: 90, opacity: 0 },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 1,
              delay: i * 0.05,
              ease: "power4.out",
            }
          );
        }
      });
    }
  }, [isActive]);

  let globalCharIndex = 0;

  return (
    <section
      ref={containerRef}
      className="section-panel flex flex-col lg:flex-row relative min-h-screen py-20 lg:py-0 overflow-x-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={sectionContact}
          alt="Contact bg"
          className="w-full h-full object-cover opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, hsl(0 0% 4% / 0.6), hsl(0 0% 4% / 0.95))",
          }}
        />
      </div>

      {/* LEFT SIDE */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:pl-16 lg:pr-0 mb-16 lg:mb-0 mt-8 lg:mt-0">
        <h2 className="font-display text-left text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none relative z-10">
          {titleLines.map((line, lineIndex) => {
            const lineStartIndex = globalCharIndex;

            return (
              <div
                key={lineIndex}
                className="flex overflow-hidden"
                style={{ perspective: "600px" }}
              >
                {line.split("").map((char, charIndex) => {
                  const refIndex = lineStartIndex + charIndex;
                  globalCharIndex = refIndex + 1;

                  return (
                    <span
                      key={charIndex}
                      ref={(el) => (lettersRef.current[refIndex] = el)}
                      className="inline-block text-gradient-gold"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </h2>

        <div className="w-16 lg:w-24 h-[1px] bg-primary my-6 lg:my-10 relative z-10" />
        <p className="font-body text-muted-foreground text-sm max-w-sm leading-relaxed mb-10 relative z-10">
          Есть идея для сайта? Давайте создадим нечто выдающееся вместе. Каждый
          успешный веб-проект начинается с простого разговора.
        </p>

        {/* Секция контактов */}
        <div className="flex flex-col gap-6 relative z-10">
          <a
            href="https://t.me/CodeLabW"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 w-fit"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-primary text-muted-foreground group-hover:text-primary transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <div className="flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-2">
              <span className="font-body text-xs lg:text-sm tracking-[0.15em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
                @CodeLabW
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </a>
          
          <a
            href="https://wa.me/375257953650"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 w-fit"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-primary text-muted-foreground group-hover:text-primary transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-2">
              <span className="font-body text-xs lg:text-sm tracking-[0.15em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
                WHATSAPP
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </a>

          <a
            href="https://tiktok.com/@codelabweb"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 w-fit"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-primary text-muted-foreground group-hover:text-primary transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.5z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-2">
              <span className="font-body text-xs lg:text-sm tracking-[0.15em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
                @codelabweb
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </a>
        </div>
      </div>

      {/* КРУГЛЫЙ БЕЙДЖ ПО ЦЕНТРУ СЕКЦИИ (СДВИнут ЛЕВЕЕ И ИСПРАВЛЕНА АНИМАЦИЯ) */}
      <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 hidden sm:block z-20 pointer-events-none">
        <div className="w-64 h-64 animate-[spin_60s_linear_infinite] opacity-10">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text fontSize="11" fill="currentColor" className="font-body tracking-[0.2em] uppercase text-primary">
              <textPath href="#circle">
                • CODELAB • WEB STUDIO • DEV •
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 lg:pr-16 lg:pl-0 pb-12 lg:pb-0">
        <div className="relative w-full max-w-md">
          <div className="hidden lg:block absolute -top-20 -right-20 w-48 h-48 overflow-hidden opacity-40 animate-float pointer-events-none">
            <img src={heroBg} alt="Accent" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-20 space-y-6 bg-background/5 lg:bg-transparent p-6 lg:p-0 rounded-2xl border border-white/5 lg:border-none backdrop-blur-sm lg:backdrop-blur-none">
            <div>
              <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Имя</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                placeholder="ваш@email.com"
              />
            </div>

            <div>
              <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Телефон</label>
              <div className="flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  className="bg-transparent border-b border-border text-foreground py-3 focus:outline-none focus:border-primary transition-colors"
                >
                  <option className="bg-black text-white" value="+375">+375</option>
                  <option className="bg-black text-white" value="+7">+7</option>
                  <option className="bg-black text-white" value="+1">+1</option>
                  <option className="bg-black text-white" value="+44">+44</option>
                </select>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                  placeholder="29 123-45-67"
                  className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                />
              </div>
            </div>

            {/* Новое поле: Username Telegram (опционально) */}
            <div>
              <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Username Telegram <span className="text-xs opacity-60">(опционально)</span>
              </label>
              <input
                type="text"
                value={form.telegramUsername}
                onChange={(e) => setForm({ ...form, telegramUsername: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                placeholder="@username"
              />
            </div>

            {/* Новое поле: Выбор социальной сети (опционально) */}
            <div>
              <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Предпочтительный способ связи <span className="text-xs opacity-60">(опционально)</span>
              </label>
              <select
                value={form.preferredSocialNetwork}
                onChange={(e) => setForm({ ...form, preferredSocialNetwork: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300 appearance-none cursor-pointer"
              >
                <option className="bg-black text-white" value="">-- Выберите --</option>
                <option className="bg-black text-white" value="telegram">Telegram</option>
                <option className="bg-black text-white" value="whatsapp">WhatsApp</option>
                <option className="bg-black text-white" value="viber">Viber</option>
              </select>
            </div>

            <div>
              <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Сообщение</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                placeholder="Расскажите о вашей идее..."
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess}
              className={`magnetic-btn w-full py-4 border font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase transition-all duration-500 mt-4 
                ${isSuccess 
                  ? "border-green-500 text-green-500 bg-green-500/10 cursor-default" 
                  : "border-gold text-primary hover:bg-primary hover:text-black"
                }`}
            >
              {isSubmitting ? "Отправка..." : isSuccess ? "Сообщение отправлено ✓" : "Отправить сообщение"}
            </button>
          </div>

          <div className="absolute -bottom-4 -left-4 lg:-bottom-8 lg:-left-8 w-12 h-12 lg:w-16 lg:h-16 border-b border-l border-gold/20 pointer-events-none" />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center z-10 font-body text-[9px] lg:text-[10px] tracking-[0.3em] uppercase text-muted-foreground px-4">
        © 2026 Code Lab. Все права защищены.
      </div>
    </section>
  );
};

export default ContactSection;
