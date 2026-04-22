export const STORAGE_KEYS = {
  theme: 'retro:theme',
  accent: 'retro:accent',
  scanlines: 'retro:scanlines',
  heroVariant: 'retro:hero-variant',
} as const;

export type ThemeValue = 'dark' | 'light';
export type AccentValue = 'orange' | 'green' | 'cyan' | 'magenta';
export type ScanlinesValue = 'on' | 'off';
export type HeroVariantValue = 'kanban' | 'draft' | 'pipeline';

export const THEME_INIT_SCRIPT = `
(function(){try{
  var d=document.documentElement;
  var t=localStorage.getItem('retro:theme')||'dark';
  var a=localStorage.getItem('retro:accent')||'orange';
  var s=localStorage.getItem('retro:scanlines')||'on';
  d.setAttribute('data-theme',t);
  d.setAttribute('data-accent',a);
  d.setAttribute('data-scanlines',s);
  var hv=localStorage.getItem('retro:hero-variant');
  if(hv==='kanban'||hv==='draft'||hv==='pipeline'){
    d.setAttribute('data-hero-variant',hv);
  }
}catch(e){}})();
`;

function setAttr(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(name, value);
}

function persist(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
}

export function setTheme(v: ThemeValue) {
  persist(STORAGE_KEYS.theme, v);
  setAttr('data-theme', v);
}

export function setAccent(v: AccentValue) {
  persist(STORAGE_KEYS.accent, v);
  setAttr('data-accent', v);
}

export function setScanlines(v: ScanlinesValue) {
  persist(STORAGE_KEYS.scanlines, v);
  setAttr('data-scanlines', v);
}
