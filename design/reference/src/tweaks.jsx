/* ====== Tweaks panel ====== */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "orange",
  "scanlines": "on",
  "heroVariant": "kanban"
}/*EDITMODE-END*/;

function TweaksPanel({ state, setState, visible, onClose }) {
  if (!visible) return null;

  const rows = [
    {
      key: "theme", label: "theme",
      opts: [
        { v: "dark",  l: <><Icon name="moon" size={11} /> dark</> },
        { v: "light", l: <><Icon name="sun" size={11} /> light</> },
      ],
    },
    {
      key: "accent", label: "accent",
      opts: [
        { v: "orange",  l: <><span className="tweak-swatch" style={{ background: "#e8722a" }} />orange</> },
        { v: "green",   l: <><span className="tweak-swatch" style={{ background: "#5cd49a" }} />green</> },
        { v: "cyan",    l: <><span className="tweak-swatch" style={{ background: "#5cc9d4" }} />cyan</> },
        { v: "magenta", l: <><span className="tweak-swatch" style={{ background: "#c45cd4" }} />magenta</> },
      ],
    },
    {
      key: "heroVariant", label: "hero variant",
      opts: [
        { v: "kanban",   l: "kanban" },
        { v: "spec",     l: "spec editor" },
        { v: "pipeline", l: "build stream" },
      ],
    },
    {
      key: "scanlines", label: "scanlines",
      opts: [
        { v: "on",  l: "on" },
        { v: "off", l: "off" },
      ],
    },
  ];

  return (
    <div className="tweaks">
      <div className="tweaks-head">
        <span>⟪ tweaks ⟫</span>
        <button className="close" onClick={onClose} aria-label="close tweaks">×</button>
      </div>
      <div className="tweaks-body">
        {rows.map((row) => (
          <div key={row.key} className="tweak-row">
            <div className="tlabel">// {row.label}</div>
            <div className="tweak-options">
              {row.opts.map((o) => (
                <button
                  key={o.v}
                  className={"tweak-opt " + (state[row.key] === o.v ? "on" : "")}
                  onClick={() => setState((s) => ({ ...s, [row.key]: o.v }))}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel, TWEAK_DEFAULTS });
