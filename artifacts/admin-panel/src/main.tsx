import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Point all API calls to the backend server.
// In production (Cloudflare Pages), VITE_API_URL must be set to the Render URL.
// In local dev, Vite proxy handles /api -> localhost:8080, so empty string is correct.
const apiUrl = (import.meta.env.VITE_API_URL as string) || "";
setBaseUrl(apiUrl || null);

createRoot(document.getElementById("root")!).render(<App />);
