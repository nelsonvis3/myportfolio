import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { readRoute } from "./data";
import "./styles/globals.css";

const node = document.getElementById("root");
if (!node) throw new Error("Missing root element");
const app = <StrictMode><App initial={readRoute(window.location.pathname)}/></StrictMode>;
// The production output contains prerendered HTML for both languages and each project.
if (node.querySelector(".shell")) hydrateRoot(node,app);
else createRoot(node).render(app);
