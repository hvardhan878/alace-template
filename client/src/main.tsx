import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "Vite + Express + SQLite Demo";

createRoot(document.getElementById("root")!).render(<App />);
