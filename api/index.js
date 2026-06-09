import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/send", async (req, res) => {
  try {
    const { name, email, phone, message, telegramUsername, preferredSocialNetwork } = req.body;

    const TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: "Missing Telegram credentials" });
    }

    const text = `
📩 Новая заявка:

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone}
💬 Сообщение: ${message}${telegramUsername ? `\n✈️ Telegram: ${telegramUsername}` : ""}${preferredSocialNetwork ? `\n📲 Способ связи: ${preferredSocialNetwork}` : ""}
    `;

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("Telegram API Error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3001, () => {
    console.log("🚀 Local server started on http://localhost:3001");
  });
}

export default app;
