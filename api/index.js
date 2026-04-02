import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Vercel handles CORS natively via vercel.json, but keeping this helps for local testing
app.use(cors());
app.use(express.json());

app.post("/api/send", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Fetch tokens from Environment Variables
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
💬 Сообщение: ${message}
    `;

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
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

// If running locally, listen on a port. If on Vercel, export the app.
if (process.env.NODE_ENV !== "production") {
  app.listen(3001, () => {
    console.log("🚀 Local server started on http://localhost:3001");
  });
}

export default app;