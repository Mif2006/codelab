import { useState, useRef, useEffect, useCallback } from "react";

// ─── Theming ────────────────────────────────────────────────────────────────
const GOLD       = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DARK  = "#8B6914";

// ─── API Handler ────────────────────────────────────────────────────────────
async function sendToApi(name: string, contact: string, message: string) {
  let email = "";
  let phone = "";

  if (contact.includes("@")) {
    email = contact;
    phone = "Не указан";
  } else if (contact.match(/^[\d\s\+\-\(\)]{7,}$/)) {
    phone = contact;
    email = "not-provided@example.com";
  } else {
    email = "not-provided@example.com";
    phone = "Не указан";
  }

  try {
    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });
  } catch { /* silent */ }
}

// ─── Socials ─────────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "Instagram",
    handle: "@YarGrdvv",
    href: "https://instagram.com/YarGrdvv",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke={GOLD} strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4.5" stroke={GOLD} strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1" fill={GOLD}/>
      </svg>
    ),
  },
  {
    label: "Telegram",
    handle: "@CodeLabW",
    href: "https://t.me/@CodeLabW",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21.8 3.1L2.4 10.5c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.7c.3.7.2 1 1 1 .6 0 .9-.3 1.2-.6l2.9-2.8 5 3.7c.9.5 1.5.2 1.8-.8l3.1-14.6c.4-1.5-.6-2.2-1.2-1.9z" stroke={GOLD} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    handle: "+375 (25) 795-36-50",
    href: "https://wa.me/375257953650",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

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
    width: "320px",
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
  body: {
    padding: "16px 14px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  sectionLabel: {
    fontSize: "9px",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: "rgba(201,168,76,0.45)",
    fontFamily: "system-ui, sans-serif",
    marginBottom: "6px",
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    background: "rgba(201,168,76,0.05)",
    border: `1px solid rgba(201,168,76,0.22)`,
    borderRadius: "10px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all .2s",
    width: "100%",
  },
  socialIcon: {
    width: "30px", height: "30px", borderRadius: "8px",
    background: "rgba(201,168,76,0.1)",
    border: `1px solid rgba(201,168,76,0.22)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  divider: {
    height: "1px",
    background: "rgba(201,168,76,0.12)",
    margin: "2px 0",
  },
  inputField: {
    width: "100%",
    background: "rgba(255,245,220,.055)",
    border: `1px solid rgba(201,168,76,0.2)`,
    borderRadius: "11px",
    padding: "10px 13px",
    color: "rgba(255,245,220,.92)",
    fontSize: "13px",
    fontFamily: "'Cormorant Garamond',Georgia,serif",
    outline: "none",
    resize: "none" as const,
    lineHeight: "1.55",
    boxSizing: "border-box" as const,
    letterSpacing: "0.02em",
    transition: "border-color .2s",
  },
  sendBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    background: `linear-gradient(135deg,${GOLD_DARK},${GOLD})`,
    border: "none",
    cursor: "pointer",
    fontSize: "10px",
    letterSpacing: "0.28em",
    textTransform: "uppercase" as const,
    fontFamily: "'Cormorant Garamond',Georgia,serif",
    color: "#0a0602",
    fontWeight: 600,
    transition: "all .2s",
  },
  bubbleBtn: {
    width: "56px", height: "56px", borderRadius: "50%",
    background: "linear-gradient(135deg,#1a1208,#2e2010 50%,#1a1208)",
    border: `1.5px solid ${GOLD}`,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 0 0 1px rgba(201,168,76,0.14),0 8px 32px rgba(0,0,0,0.72),0 0 20px rgba(201,168,76,0.18)`,
    transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
    flexShrink: 0,
    position: "relative" as const,
  },
};

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [unread, setUnread]   = useState(1);

  const [name, setName]       = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  // ── Panel open/close animation ──
  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
      setUnread(0);
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Введите имя"); return; }
    if (!contact.trim()) { setError("Укажите контакт"); return; }
    if (message.trim().length < 5) { setError("Сообщение слишком короткое"); return; }
    setError("");
    await sendToApi(name.trim(), contact.trim(), message.trim());
    setSent(true);
    setName(""); setContact(""); setMessage("");
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
        @keyframes clPulse{
          0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.42),0 0 0 1px rgba(201,168,76,.14),0 8px 32px rgba(0,0,0,.72)}
          60%{box-shadow:0 0 0 10px rgba(201,168,76,0),0 0 0 1px rgba(201,168,76,.14),0 8px 32px rgba(0,0,0,.72)}
        }
        @keyframes clFadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        .cl-social:hover { background: rgba(201,168,76,0.11) !important; border-color: rgba(201,168,76,0.45) !important; }
        .cl-input:focus { border-color: rgba(201,168,76,.52) !important; background: rgba(255,245,220,.09) !important; }
        .cl-input::placeholder { color: rgba(201,168,76,.26); }
        .cl-send:hover { opacity: 0.88; transform: scale(1.01); }
        .cl-close:hover { color: ${GOLD} !important; }
        .cl-success { animation: clFadeUp .3s ease forwards; }
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
              <div style={{ fontSize: "10px", color: "rgba(201,168,76,0.5)", fontFamily: "system-ui,sans-serif", marginTop: "2px" }}>
                Свяжитесь с нами
              </div>
            </div>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px rgba(74,222,128,.6)", marginRight:"2px" }}/>
            <button className="cl-close" style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,.42)", fontSize:"20px", lineHeight:1, padding:"2px 4px" }} onClick={() => setOpen(false)}>×</button>
          </div>

          {/* Body */}
          <div style={S.body}>

            {/* Socials */}
            <div>
              <div style={S.sectionLabel}>Мы в соцсетях</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cl-social"
                    style={S.socialBtn}
                  >
                    <div style={S.socialIcon}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: GOLD_LIGHT, letterSpacing: "0.02em" }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(201,168,76,0.45)", marginTop: "1px", fontFamily: "system-ui,sans-serif" }}>
                        {s.handle}
                      </div>
                    </div>
                    <svg style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.4 }} width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div style={S.divider} />

            {/* Message form */}
            <div>
              <div style={S.sectionLabel}>Оставить сообщение</div>

              {sent ? (
                <div className="cl-success" style={{ textAlign: "center", padding: "16px 0", color: GOLD_LIGHT, fontSize: "13px", lineHeight: 1.6 }}>
                  Сообщение отправлено 🎉<br/>
                  <span style={{ fontSize: "11px", color: "rgba(201,168,76,0.5)", fontFamily: "system-ui,sans-serif" }}>
                    Мы свяжемся с вами в течение дня
                  </span>
                  <br/>
                  <button
                    onClick={() => setSent(false)}
                    style={{ marginTop: "10px", background: "none", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: "20px", padding: "4px 16px", color: "rgba(201,168,76,0.55)", fontSize: "11px", fontFamily: "'Cormorant Garamond',serif", cursor: "pointer", letterSpacing: "0.04em" }}
                  >
                    Написать ещё
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    className="cl-input"
                    style={S.inputField}
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="cl-input"
                    style={S.inputField}
                    type="text"
                    placeholder="Телефон или email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                  <textarea
                    className="cl-input"
                    style={{ ...S.inputField, resize: "none" }}
                    placeholder="Расскажите о вашей идее..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {error && (
                    <div style={{ fontSize: "10px", color: "#f87171", letterSpacing: "0.08em", fontFamily: "system-ui,sans-serif", textTransform: "uppercase" }}>
                      {error}
                    </div>
                  )}
                  <button className="cl-send" style={S.sendBtn} onClick={handleSubmit}>
                    Отправить
                  </button>
                </div>
              )}
            </div>

          </div>
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
          {!open && unread > 0 && (
            <span style={{
              position: "absolute", top: "-2px", right: "-2px",
              width: "16px", height: "16px", borderRadius: "50%",
              background: GOLD, border: "2px solid #0a0602",
              fontSize: "9px", fontFamily: "system-ui,sans-serif", fontWeight: 700,
              color: "#0a0602", display: "flex", alignItems: "center", justifyContent: "center",
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
