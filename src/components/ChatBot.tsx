import { useState, useRef, useEffect, useCallback } from "react";

// ─── Theming ────────────────────────────────────────────────────────────────
const GOLD        = "#C9A84C";
const GOLD_LIGHT  = "#E8C97A";
const GOLD_DARK   = "#8B6914";

// ─── Telegram ───────────────────────────────────────────────────────────────


async function sendToApi(name: string, contact: string, message: string) {
    // Parse contact: prefer email, fallback to phone, or default
    let email = "";
    let phone = "";
    
    if (contact.includes("@")) {
      email = contact;
      phone = "Не указан";
    } else if (contact.match(/^[\d\s\+\-\(\)]{7,}$/)) {
      phone = contact;
      email = "not-provided@example.com";
    } else {
      // Generic fallback if format is unclear
      email = "not-provided@example.com";
      phone = "Не указан";
    }
  
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
    } catch {
      // Silent fail — optionally add console.error for debugging
    }
  }

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "greeting" | "name" | "contact" | "message" | "done";

interface BotMessage {
  id: number;
  role: "bot" | "user";
  text: string;
  /** If set, renders section nav cards instead of text */
  navCards?: NavCard[];
}

interface NavCard {
  label: string;
  desc: string;
  section: number; // 0-based index matching Index.tsx SECTIONS
  icon: string;
}

// ─── Section nav cards ───────────────────────────────────────────────────────
const NAV_CARDS: NavCard[] = [
  { label: "Портфолио и цены", desc: "Наши работы и стоимость", section: 1, icon: "◈" },
//   { label: "Связаться с нами", desc: "Форма обратной связи",    section: 4, icon: "✉" },
];

// ─── Conversation script ─────────────────────────────────────────────────────
const STEP_MESSAGES: Record<Step, string> = {
  greeting:
    "Привет! Я помогу связать вас с командой CodeLab.\n\nМы создаём сайты под ключ — от лендингов до интернет-магазинов. Хотите посмотреть наши работы или сразу оставить заявку?",
  name:
    "Отлично! Как вас зовут?",
  contact:
    "Приятно познакомиться! Оставьте, пожалуйста, ваш телефон или email — мы напишем вам напрямую.",
  message:
    "И последнее: кратко опишите, что вам нужно. Какой сайт? Есть ли примеры или идеи?",
  done:
    "Готово! Ваша заявка принята 🎉\n\nНаш менеджер свяжется с вами в течение рабочего дня. Если хотите — можете изучить наши работы или написать нам напрямую через форму.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
let _id = 0;
const uid = () => ++_id;
const getTime = () =>
  new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

// ─── Styles ──────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "fixed",
    bottom: "100px",
    right: "28px",
    zIndex: 9999,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "14px",
  },
  panel: {
    width: "348px",
    height: "520px",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    border: `1px solid rgba(201,168,76,0.35)`,
    boxShadow: `0 0 0 1px rgba(201,168,76,0.07), 0 24px 64px rgba(0,0,0,0.88), 0 0 40px rgba(201,168,76,0.07)`,
    background: "rgba(10,6,1,0.95)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    overflow: "hidden",
  },
  header: {
    padding: "13px 15px 11px",
    borderBottom: `1px solid rgba(201,168,76,0.18)`,
    background: "linear-gradient(180deg,rgba(42,28,4,.97),rgba(18,12,2,.92))",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatarRing: {
    width: "34px", height: "34px", borderRadius: "50%",
    border: `1.5px solid ${GOLD}`,
    background: "linear-gradient(135deg,#1f1404,#3a2508)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    boxShadow: `0 0 12px rgba(201,168,76,0.22)`,
  },
  aiBadge: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    fontSize: "9px", color: GOLD,
    background: "rgba(201,168,76,0.1)",
    border: `1px solid rgba(201,168,76,0.28)`,
    borderRadius: "20px", padding: "2px 7px",
    letterSpacing: "0.08em", textTransform: "uppercase" as const,
    marginTop: "3px", fontFamily: "system-ui,sans-serif", fontWeight: 600,
  },
  // Messages scroll area — isolated from page scroll via onWheel stop
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "13px 12px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    scrollbarWidth: "thin" as const,
    scrollbarColor: `rgba(201,168,76,0.18) transparent`,
  },
  msgBot: {
    alignSelf: "flex-start",
    background: "linear-gradient(135deg,rgba(42,28,4,.82),rgba(28,18,2,.92))",
    border: `1px solid rgba(201,168,76,0.18)`,
    borderRadius: "4px 14px 14px 14px",
    padding: "9px 13px",
    maxWidth: "86%",
    color: "rgba(255,245,220,.92)",
    fontSize: "13px",
    lineHeight: "1.58",
    whiteSpace: "pre-line" as const,
    boxShadow: "0 2px 12px rgba(0,0,0,.4)",
  },
  msgUser: {
    alignSelf: "flex-end",
    background: `linear-gradient(135deg,${GOLD_DARK},${GOLD})`,
    borderRadius: "14px 4px 14px 14px",
    padding: "9px 13px",
    maxWidth: "82%",
    color: "#0a0602",
    fontSize: "13px",
    lineHeight: "1.55",
    fontWeight: "500",
    boxShadow: `0 2px 16px rgba(201,168,76,0.22)`,
  },
  msgTime: {
    fontSize: "10px", opacity: 0.38, marginTop: "3px",
    display: "block", fontFamily: "system-ui,sans-serif",
  },
  typing: {
    alignSelf: "flex-start",
    background: "linear-gradient(135deg,rgba(42,28,4,.82),rgba(28,18,2,.92))",
    border: `1px solid rgba(201,168,76,0.18)`,
    borderRadius: "4px 14px 14px 14px",
    padding: "11px 15px",
    display: "flex", gap: "5px", alignItems: "center",
  },
  // Nav card inside message stream
  navCard: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 12px",
    background: "rgba(201,168,76,0.06)",
    border: `1px solid rgba(201,168,76,0.28)`,
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all .2s",
    width: "100%",
    textAlign: "left" as const,
  },
  navIcon: {
    width: "30px", height: "30px", borderRadius: "8px",
    background: "rgba(201,168,76,0.12)",
    border: `1px solid rgba(201,168,76,0.25)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", color: GOLD_LIGHT, flexShrink: 0,
  },
  // Progress steps bar
  stepsBar: {
    display: "flex", gap: "4px",
    padding: "8px 13px 0",
    flexShrink: 0,
  },
//   stepDot: (active: boolean, done: boolean): React.CSSProperties => ({
//     flex: 1, height: "2px", borderRadius: "2px",
//     background: done
//       ? GOLD
//       : active
//         ? `rgba(201,168,76,0.5)`
//         : "rgba(201,168,76,0.12)",
//     transition: "background .4s",
//   }),
  inputArea: {
    padding: "9px 12px 11px",
    borderTop: `1px solid rgba(201,168,76,0.12)`,
    background: "linear-gradient(180deg,rgba(12,8,2,.86),rgba(18,12,2,.96))",
    display: "flex", gap: "9px", alignItems: "flex-end",
    flexShrink: 0,
  },
  inputField: {
    flex: 1,
    background: "rgba(255,245,220,.055)",
    border: `1px solid rgba(201,168,76,0.2)`,
    borderRadius: "11px",
    padding: "8px 13px",
    color: "rgba(255,245,220,.92)",
    fontSize: "13px",
    fontFamily: "'Cormorant Garamond',Georgia,serif",
    outline: "none", resize: "none" as const,
    lineHeight: "1.5", maxHeight: "68px", minHeight: "34px",
    overflowY: "auto" as const,
    transition: "border-color .2s",
    letterSpacing: "0.02em",
  },
  sendBtn: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: `linear-gradient(135deg,${GOLD_DARK},${GOLD})`,
    border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all .2s",
    boxShadow: `0 2px 12px rgba(201,168,76,0.28)`,
  },
  bubbleBtn: {
    width: "56px", height: "56px", borderRadius: "50%",
    background: "linear-gradient(135deg,#1a1208,#2e2010 50%,#1a1208)",
    border: `1.5px solid ${GOLD}`,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 0 0 1px rgba(201,168,76,0.14),0 8px 32px rgba(0,0,0,0.72),0 0 20px rgba(201,168,76,0.18)`,
    transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
    flexShrink: 0, position: "relative" as const,
  },
};

// ─── Dynamic style helper (placed AFTER S object) ────────────────────────────
const getStepDotStyle = (active: boolean, done: boolean): React.CSSProperties => ({
    flex: 1, height: "2px", borderRadius: "2px",
    background: done
      ? GOLD
      : active
        ? `rgba(201,168,76,0.5)`
        : "rgba(201,168,76,0.12)",
    transition: "background .4s",
  });

// ─── Sub-components ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={S.typing}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: GOLD, opacity: 0.7, display: "inline-block",
          animation: `clBounce 1.1s ${i * 0.18}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function NavCards({ cards, onNavigate }: { cards: NavCard[]; onNavigate: (s: number) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignSelf: "flex-start", width: "90%" }}>
      {cards.map((c) => (
        <button
          key={c.section}
          className="cl-nav-card"
          style={S.navCard}
          onClick={() => onNavigate(c.section)}
        >
          <div style={S.navIcon}>{c.icon}</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: GOLD_LIGHT, letterSpacing: "0.02em" }}>
              {c.label}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(201,168,76,0.5)", marginTop: "1px", fontFamily: "system-ui,sans-serif" }}>
              {c.desc}
            </div>
          </div>
          <svg style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.45 }} width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS: Step[] = ["greeting", "name", "contact", "message", "done"];
// Steps that have a progress bar (greeting is "step 0", not counted)
const PROGRESS_STEPS: Step[] = ["name", "contact", "message", "done"];

// ─── Main widget ──────────────────────────────────────────────────────────────
interface ChatWidgetProps {
  /** Called when user clicks a section nav card. Matches navigateTo() in Index.tsx */
  onNavigate?: (index: number) => void;
}

export default function ChatWidget({ onNavigate }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [unread, setUnread] = useState(1);
  const [hoverBtn, setHoverBtn] = useState(false);

  // Conversation state
  const [step, setStep] = useState<Step>("greeting");
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Collected lead data
  const nameRef    = useRef("");
  const contactRef = useRef("");
  const messageRef = useRef("");

  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const msgsRef  = useRef<HTMLDivElement>(null);

  // ── Initialise greeting on first open ──
  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true);
      setTimeout(() => {
        setMessages([{
          id: uid(),
          role: "bot",
          text: STEP_MESSAGES.greeting,
          navCards: NAV_CARDS,
        }]);
        setTyping(false);
        setStep("name");
      }, 700);
    }
  }, [open]);

  // ── Panel open/close animation ──
  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
      setTimeout(() => inputRef.current?.focus(), 350);
      setUnread(0);
    } else {
      setVisible(false);
    }
  }, [open]);

  // ── Auto-scroll inside box ──
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── Isolate scroll from page ──
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = msgsRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop    = scrollTop === 0 && e.deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
  }, []);

  // ── Bot sends next prompt after user reply ──
  const advanceStep = (nextStep: Step, extra?: Partial<BotMessage>) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((p) => [...p, {
        id: uid(),
        role: "bot",
        text: STEP_MESSAGES[nextStep],
        ...extra,
      }]);
      setStep(nextStep);
      setTyping(false);
    }, 750 + Math.random() * 400);
  };

  // ── Handle user submission per step ──
  const handleSubmit = () => {
    const val = input.trim();
    if (!val || typing) return;

    // Append user message
    setMessages((p) => [...p, { id: uid(), role: "user", text: val }]);
    setInput("");

    if (step === "name") {
      nameRef.current = val;
      advanceStep("contact");
    } else if (step === "contact") {
      contactRef.current = val;
      advanceStep("message");
    } else if (step === "message") {
      messageRef.current = val;
      // Send to Telegram
      sendToApi(nameRef.current, contactRef.current, val);
      // Done — show nav cards again
      advanceStep("done", { navCards: NAV_CARDS });
    } else {
      // "done" or unexpected — just acknowledge
      setMessages((p) => [...p, {
        id: uid(), role: "bot",
        text: "Ваш вопрос получен. Наша команда скоро выйдет на связь!",
      }]);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  // ── Navigate to section ──
  const goToSection = (index: number) => {
    onNavigate?.(index);
    setOpen(false);
  };

  // ── Step progress (for bar) ──
  const progressIdx = PROGRESS_STEPS.indexOf(step);

  // ── Placeholder per step ──
  const placeholder: Record<Step, string> = {
    greeting: "",
    name: "Ваше имя...",
    contact: "Телефон или email...",
    message: "Опишите ваш проект...",
    done: "",
  };

  const panelStyle: React.CSSProperties = {
    ...S.panel,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
    transition: "opacity .3s ease, transform .35s cubic-bezier(.34,1.2,.64,1)",
    pointerEvents: visible ? "all" : "none",
    ...(open ? {} : { height: 0, overflow: "hidden", border: "none", opacity: 0 }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');
        @keyframes clBounce{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}
        @keyframes clFadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        @keyframes clPulse{
          0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.42),0 0 0 1px rgba(201,168,76,.14),0 8px 32px rgba(0,0,0,.72)}
          60%{box-shadow:0 0 0 10px rgba(201,168,76,0),0 0 0 1px rgba(201,168,76,.14),0 8px 32px rgba(0,0,0,.72)}
        }
        .cl-msg-in { animation: clFadeUp .24s ease forwards; }
        .cl-input:focus { border-color: rgba(201,168,76,.52) !important; background: rgba(255,245,220,.09) !important; }
        .cl-input::placeholder { color: rgba(201,168,76,.26); }
        .cl-msgs::-webkit-scrollbar { width: 3px; }
        .cl-msgs::-webkit-scrollbar-thumb { background: rgba(201,168,76,.18); border-radius: 4px; }
        .cl-close:hover { color: ${GOLD} !important; }
        .cl-send-btn:hover:not(:disabled) { transform: scale(1.1) !important; }
        .cl-nav-card:hover { background: rgba(201,168,76,.11) !important; border-color: rgba(201,168,76,.45) !important; }
        .cl-ornament { display:flex;align-items:center;gap:6px;padding:2px 0 4px; }
        .cl-orn-line { height:1px;width:18px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.32)); }
        .cl-orn-line.r { background:linear-gradient(90deg,rgba(201,168,76,.32),transparent); }
        .cl-orn-dia { width:5px;height:5px;background:rgba(201,168,76,.38);transform:rotate(45deg); }
        @media(max-width:640px){
          .cl-wrapper{right:14px!important;bottom:78px!important;}
          .cl-panel{width:calc(100vw - 28px)!important;}
        }
      `}</style>

      <div style={S.wrapper} className="cl-wrapper">

        {/* ── Panel ── */}
        <div style={panelStyle} className="cl-panel">

          {/* Header */}
          <div style={S.header}>
            <div style={S.avatarRing}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: GOLD_LIGHT, letterSpacing: ".03em" }}>CodeLab</div>
              <div style={S.aiBadge}>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10M3.5 3.5l5 5M8.5 3.5l-5 5" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                AI-ассистент
              </div>
            </div>
            <div style={{ width:7,height:7,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px rgba(74,222,128,.6)",marginRight:"2px" }}/>
            <button className="cl-close" style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(201,168,76,.42)",fontSize:"20px",lineHeight:1,padding:"2px 4px" }} onClick={()=>setOpen(false)}>×</button>
          </div>

          {/* Progress bar — only shown after greeting */}
          {step !== "greeting" && (
  <div style={S.stepsBar}>
    {PROGRESS_STEPS.map((s, i) => (
      // ✅ FIXED: call the standalone function instead
      <div key={s} style={getStepDotStyle(i === progressIdx, i < progressIdx)} />
    ))}
  </div>
)}

          {/* Step hint label */}
          {step !== "greeting" && step !== "done" && (
            <div style={{ padding:"5px 13px 0", fontSize:"10px", fontFamily:"system-ui,sans-serif", color:"rgba(201,168,76,.38)", letterSpacing:"0.06em", textTransform:"uppercase", flexShrink:0 }}>
              { step === "name"    && "Шаг 1 из 3 — Ваше имя" }
              { step === "contact" && "Шаг 2 из 3 — Контакт" }
              { step === "message" && "Шаг 3 из 3 — Ваш запрос" }
            </div>
          )}

          {/* Messages — scroll isolated */}
          <div
            ref={msgsRef}
            className="cl-msgs"
            style={S.messages}
            onWheel={handleWheel}
          >
            <div className="cl-ornament">
              <div className="cl-orn-line"/><div className="cl-orn-dia"/><div className="cl-orn-line r"/>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="cl-msg-in">
                {msg.role === "bot" ? (
                  <>
                    {msg.text && (
                      <div style={S.msgBot}>
                        {msg.text}
                        <span style={S.msgTime}>{getTime()}</span>
                      </div>
                    )}
                    {msg.navCards && (
                      <NavCards cards={msg.navCards} onNavigate={goToSection} />
                    )}
                  </>
                ) : (
                  <div style={S.msgUser}>
                    {msg.text}
                    <span style={S.msgTime}>{getTime()}</span>
                  </div>
                )}
              </div>
            ))}

            {typing && <TypingDots />}
            <div ref={endRef} />
          </div>

          {/* Input — hidden once done */}
          {step !== "done" && step !== "greeting" && (
            <>
              <div style={{ display:"flex",alignItems:"center",gap:"8px",padding:"0 12px 2px",flexShrink:0 }}>
                <div style={{ flex:1,height:"1px",background:"rgba(201,168,76,0.1)" }}/>
                <span style={{ fontSize:"9px",color:"rgba(201,168,76,0.28)",fontFamily:"system-ui,sans-serif",letterSpacing:".06em",textTransform:"uppercase" as const,whiteSpace:"nowrap" as const }}>
                  Ваш ответ
                </span>
                <div style={{ flex:1,height:"1px",background:"rgba(201,168,76,0.1)" }}/>
              </div>

              <div style={S.inputArea}>
                <textarea
                  ref={inputRef}
                  className="cl-input"
                  style={S.inputField}
                  placeholder={placeholder[step]}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 68) + "px";
                  }}
                />
                <button
                  className="cl-send-btn"
                  style={{
                    ...S.sendBtn,
                    opacity: !input.trim() || typing ? 0.36 : 1,
                    cursor: !input.trim() || typing ? "default" : "pointer",
                  }}
                  onClick={handleSubmit}
                  disabled={!input.trim() || typing}
                  title="Отправить"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="#0a0602" strokeWidth="2.2" strokeLinecap="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#0a0602" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Done state — show a "Написать снова" restart */}
          {step === "done" && (
            <div style={{ padding:"8px 12px 12px", flexShrink:0, display:"flex", justifyContent:"center" }}>
              <button
                onClick={() => {
                  nameRef.current = "";
                  contactRef.current = "";
                  messageRef.current = "";
                  setMessages([]);
                  setStep("greeting");
                  // Re-trigger greeting
                  setTyping(true);
                  setTimeout(() => {
                    setMessages([{ id: uid(), role:"bot", text: STEP_MESSAGES.greeting, navCards: NAV_CARDS }]);
                    setTyping(false);
                    setStep("name");
                  }, 600);
                }}
                style={{
                  background:"none", border:`1px solid rgba(201,168,76,0.25)`,
                  borderRadius:"20px", padding:"5px 18px",
                  color:"rgba(201,168,76,0.6)", fontSize:"11px",
                  fontFamily:"'Cormorant Garamond',serif", cursor:"pointer",
                  letterSpacing:"0.04em", transition:"all .2s",
                }}
                className="cl-restart"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          )}
        </div>

        {/* ── Launcher button ── */}
        <button
          style={{
            ...S.bubbleBtn,
            transform: hoverBtn ? "scale(1.1) rotate(8deg)" : "scale(1)",
            animation: !open && unread > 0 ? "clPulse 2.4s ease-in-out infinite" : "none",
          }}
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          title={open ? "Закрыть" : "Написать нам"}
        >
          {/* Unread badge */}
          {!open && unread > 0 && (
            <span style={{
              position:"absolute", top:"-2px", right:"-2px",
              width:"16px", height:"16px", borderRadius:"50%",
              background:GOLD, border:"2px solid #0a0602",
              fontSize:"9px", fontFamily:"system-ui,sans-serif", fontWeight:700,
              color:"#0a0602", display:"flex", alignItems:"center", justifyContent:"center",
            }}>1</span>
          )}
          {open ? (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke={GOLD} strokeWidth="2.1" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 15C21 15.53 20.79 16.04 20.41 16.41C20.04 16.79 19.53 17 19 17H7L3 21V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V15Z" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="10" r="1" fill={GOLD}/>
              <circle cx="12" cy="10" r="1" fill={GOLD}/>
              <circle cx="15" cy="10" r="1" fill={GOLD}/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}