import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react"; // 👈 Added import
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Analytics /> {/* 👈 Added component */}
  </>
);