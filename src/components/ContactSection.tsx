import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import sectionContact from "@/assets/section-contact.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const ContactSection = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  // --- Logic from Component 1 ---
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+375",
    message: "",
  });

  const [error, setError] = useState("");

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
        }),
      });

      alert("Сообщение отправлено 🚀");

      setForm({
        name: "",
        email: "",
        phone: "",
        countryCode: "+375",
        message: "",
      });
    } catch (err) {
      alert("Ошибка отправки");
    }
  };

  useEffect(() => {
    if (isActive) {
      lettersRef.current.forEach((letter, i) => {
        if (letter) {
          gsap.fromTo(
            letter,
            { y: 120, rotateX: 90, opacity: 0 },
            { y: 0, rotateX: 0, opacity: 1, duration: 1, delay: i * 0.05, ease: "power4.out" }
          );
        }
      });
    }
  }, [isActive]);

  const title = "Свяжитесь с нами";

  return (
    <section
      ref={containerRef}
      className="section-panel flex flex-col lg:flex-row relative min-h-screen py-20 lg:py-0 overflow-x-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img src={sectionContact} alt="Contact bg" className="w-full h-full object-cover opacity-50" />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 50%, hsl(0 0% 4% / 0.6), hsl(0 0% 4% / 0.95))",
          }}
        />
      </div>

      {/* LEFT SIDE: Giant text & Socials (from Component 2) */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:pl-16 lg:pr-0 mb-16 lg:mb-0 mt-8 lg:mt-0">
        <div className="overflow-hidden" style={{ perspective: "600px" }}>
          <h2 className="font-display text-left text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none flex flex-wrap">
            {title.split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => (lettersRef.current[i] = el)}
                className="inline-block text-gradient-gold"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>
        <div className="w-16 lg:w-24 h-[1px] bg-primary my-6 lg:my-10" />
        <p className="font-body text-muted-foreground text-sm max-w-sm leading-relaxed">
          Есть идея для сайта? Давайте создадим нечто выдающееся вместе. Каждый успешный веб-проект
          начинается с простого разговора.
        </p>

     
      </div>

      {/* RIGHT SIDE: Functional Form (from Component 1) */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 lg:pr-16 lg:pl-0 pb-12 lg:pb-0">
        <div className="relative w-full max-w-md">
          {/* Accent Image */}
          <div className="hidden lg:block absolute -top-20 -right-20 w-48 h-48 overflow-hidden opacity-40 animate-float pointer-events-none">
            <img src={heroBg} alt="Accent" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-20 space-y-6 bg-background/5 lg:bg-transparent p-6 lg:p-0 rounded-2xl border border-white/5 lg:border-none backdrop-blur-sm lg:backdrop-blur-none">
            {/* NAME */}
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

            {/* EMAIL */}
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

            {/* PHONE (Logic from Component 1) */}
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
                  placeholder="9991234567"
                  className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                />
              </div>
            </div>

            {/* MESSAGE */}
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

            {/* ERROR */}
            {error && <p className="text-red-500 text-[10px] tracking-widest uppercase">{error}</p>}

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              data-cursor-hover
              className="magnetic-btn w-full py-4 border border-gold font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase text-primary hover:bg-primary hover:text-black transition-all duration-500 mt-4"
            >
              Отправить сообщение
            </button>
          </div>

          {/* Decoration */}
          <div className="absolute -bottom-4 -left-4 lg:-bottom-8 lg:-left-8 w-12 h-12 lg:w-16 lg:h-16 border-b border-l border-gold/20 pointer-events-none" />
        </div>
      </div>

      {/* Bottom copyright (from Component 2) */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 font-body text-[9px] lg:text-[10px] tracking-[0.3em] uppercase text-muted-foreground px-4">
        © 2026 Code Lab. Все права защищены.
      </div>
    </section>
  );
};

export default ContactSection;
