/* ====== Shared primitives ====== */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

function TerminalWindow({ title = "~/retro", subtitle, children, className = "" }) {
  return (
    <div className={"term " + className}>
      <div className="term-bar">
        <div className="term-bar-left">
          <span className="term-dot r" />
          <span className="term-dot y" />
          <span className="term-dot g" />
        </div>
        <div className="term-title">
          <span>{title}</span>
          {subtitle && <><span className="sep">|</span><span>{subtitle}</span></>}
        </div>
        <div style={{ width: 48, textAlign: "right", color: "var(--text-dim)", fontSize: 11 }}>
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </div>
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}

function Kbd({ children }) {
  return <span className="kbd">{children}</span>;
}

function SectionHead({ eyebrow, title, sub, right }) {
  return (
    <div className="section-head">
      <div>
        <div className="section-eyebrow">{eyebrow}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      {sub && <p className="section-sub">{sub}</p>}
      {right}
    </div>
  );
}

/* Simple icon set — boxy, terminal-appropriate */
function Icon({ name, size = 14 }) {
  const s = { width: size, height: size, strokeWidth: 1.5, stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "arrow":    return <svg viewBox="0 0 16 16" {...s}><path d="M3 8h10m-4-4 4 4-4 4" /></svg>;
    case "check":    return <svg viewBox="0 0 16 16" {...s}><path d="M3 8.5 6.5 12 13 4" /></svg>;
    case "circle":   return <svg viewBox="0 0 16 16" {...s}><circle cx="8" cy="8" r="5.5" /></svg>;
    case "dot":      return <svg viewBox="0 0 16 16" fill="currentColor" stroke="none" width={size} height={size}><circle cx="8" cy="8" r="2.5" /></svg>;
    case "gh":       return <svg viewBox="0 0 16 16" fill="currentColor" stroke="none" width={size} height={size}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.22.83 1.22.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.52-1.03 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>;
    case "sun":      return <svg viewBox="0 0 16 16" {...s}><circle cx="8" cy="8" r="3" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3" /></svg>;
    case "moon":     return <svg viewBox="0 0 16 16" {...s}><path d="M13.5 10A5 5 0 1 1 6 2.5a5.5 5.5 0 0 0 7.5 7.5Z" /></svg>;
    case "copy":     return <svg viewBox="0 0 16 16" {...s}><rect x="5" y="5" width="8" height="8" rx="1" /><path d="M3 11V4a1 1 0 0 1 1-1h7" /></svg>;
    case "cmd":      return <svg viewBox="0 0 16 16" {...s}><path d="M5 3v10M11 3v10M3 5h10M3 11h10" /></svg>;
    case "spec":     return <svg viewBox="0 0 16 16" {...s}><path d="M3 2h7l3 3v9H3z" /><path d="M10 2v3h3M5 8h6M5 11h4" /></svg>;
    case "pr":       return <svg viewBox="0 0 16 16" {...s}><circle cx="4" cy="3" r="1.5" /><circle cx="4" cy="13" r="1.5" /><circle cx="12" cy="13" r="1.5" /><path d="M4 4.5v7M12 11.5V7a2 2 0 0 0-2-2H7l2-2m0 4L7 5" /></svg>;
    case "bolt":     return <svg viewBox="0 0 16 16" {...s}><path d="M8.5 1 3 9h4l-.5 6L12 7H8z" /></svg>;
    default: return null;
  }
}

Object.assign(window, { TerminalWindow, Kbd, SectionHead, Icon });
