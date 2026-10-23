import type { ReactNode } from "react";
import { logos } from "../render/logos";

/** Official Simple Icons paths retained from the previous portfolio (CC0). */
export function BrandIcon({ name, size = 17 }: { name?: string; size?: number }) {
  if (!name || !(name in logos)) return null;
  const path = logos[name as keyof typeof logos];
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" role="img" aria-label={name}>
      <path d={path} />
    </svg>
  );
}

export function UiIcon({ name, size = 18 }: { name: "linkedin" | "mail" | "globe"; size?: number }) {
  const paths: Record<typeof name, ReactNode> = {
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7M7.5 7.3v.1M11.5 17v-7m0 3.2c0-2.5 4.9-3.1 4.9.3V17"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/></>
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
