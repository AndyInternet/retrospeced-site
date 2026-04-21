/* ====== Keyboard shortcuts grid ====== */

const SHORTCUTS = [
  { k: "⌥1", d: "Tickets kanban", c: "global" },
  { k: "⌥2", d: "Projects", c: "global" },
  { k: "⌥3", d: "Settings", c: "global" },
  { k: "⌥/", d: "Search tickets", c: "tickets" },
  { k: "⌥f", d: "Filter by project", c: "tickets" },
  { k: "⌥n", d: "New ticket", c: "tickets" },
  { k: "Tab", d: "Switch editor / chat", c: "draft · plan" },
  { k: "⌥m", d: "Markdown preview", c: "draft · plan" },
  { k: "⌥e", d: "Open in external editor", c: "any view" },
  { k: "⌥t", d: "Open worktree in terminal", c: "any view" },
  { k: "⌥r", d: "Manage references", c: "draft · plan" },
  { k: "⌥p", d: "Generate plan", c: "draft" },
  { k: "⌥b", d: "Start build", c: "plan" },
  { k: "⌥u", d: "Revert to draft", c: "plan" },
  { k: "⌥v", d: "Toggle verbose", c: "building" },
  { k: "⌥c", d: "Cancel build", c: "building" },
  { k: "⌥o", d: "Open PR", c: "review" },
  { k: "⌥l", d: "Toggle log viewer", c: "global" },
  { k: "⌥q", d: "Quit", c: "global" },
  { k: "↵",  d: "Open selection", c: "lists" },
  { k: "Esc",d: "Back", c: "any view" },
];

function Shortcuts() {
  return (
    <section id="shortcuts">
      <div className="page">
        <SectionHead
          eyebrow="shortcuts"
          title="Hands stay on home row."
          sub="Every screen is one key away, and no action ever requires a mouse. The whole app is a keyboard API first, a UI second."
        />
        <div className="kbd-grid">
          {SHORTCUTS.map((s, i) => (
            <div className="kbd-cell" key={i}>
              <div className="kbd-cell-inner">
                <span className="desc">{s.d}</span>
                <span className="ctx">{s.c}</span>
              </div>
              <Kbd>{s.k}</Kbd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Shortcuts });
