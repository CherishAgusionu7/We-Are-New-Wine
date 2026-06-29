import React from "react";
import { PageModel, SectionModel, SiteContent } from "./types";

interface SiteRendererProps {
  content: SiteContent;
  activePageId: string;
  selectedSectionId?: string;
  editable?: boolean;
  onSelectSection?: (pageId: string, sectionId: string) => void;
  onNavigatePage?: (pageId: string) => void;
}

function renderSectionBody(section: SectionModel, content: SiteContent) {
  const data = section.content;

  if (section.type === "hero") {
    const button = (data.button as Record<string, unknown> | undefined) ?? {};
    const buttonVisible = button.visible !== false;
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8a77d]">{String(data.eyebrow || "")}</p>
        <h1 className="text-4xl sm:text-5xl leading-tight font-semibold">{String(data.title || "Hero title")}</h1>
        <p className="text-sm text-[#d8d3c5] max-w-3xl">{String(data.subtitle || "Hero subtitle")}</p>
        {buttonVisible && (
          <a
            href={String(button.link || "#")}
            className="inline-flex items-center px-5 py-3 text-xs font-bold uppercase tracking-[0.14em]"
            style={{
              background: String(button.color || content.theme.colors.buttonColor),
              borderRadius: Number(button.borderRadius || 0),
              color: "#10100e",
            }}
          >
            {String(button.icon || "")}
            {String(button.text || "Learn More")}
          </a>
        )}
      </div>
    );
  }

  if (section.type === "events") {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">{String(data.title || "Events")}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {content.events.map((evt) => (
            <article
              key={evt.id}
              className="p-4 border"
              style={{ background: content.theme.colors.cardColor, borderColor: content.theme.colors.borderColor }}
            >
              <h3 className="font-semibold">{evt.title}</h3>
              <p className="text-xs text-[#c7c1ad]">{evt.date} - {evt.location}</p>
              <p className="text-sm mt-2">{evt.description}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "ministries") {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">{String(data.title || "Ministries")}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {content.ministries.map((min) => (
            <article
              key={min.id}
              className="p-4 border"
              style={{ background: content.theme.colors.cardColor, borderColor: content.theme.colors.borderColor }}
            >
              <h3 className="font-semibold">{min.title}</h3>
              <p className="text-xs text-[#c7c1ad]">Lead: {min.lead}</p>
              <p className="text-sm mt-2">{min.summary}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "contact") {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{String(data.title || "Contact")}</h2>
        <p>{String(data.body || "")}</p>
        <p className="text-sm">Email: {content.contact.email}</p>
        <p className="text-sm">Phone: {content.contact.phone}</p>
        <p className="text-sm">Address: {content.contact.address}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(section.content).map(([key, value]) => (
        <div key={key}>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#c3b897]">{key}</p>
          <p>{String(value)}</p>
        </div>
      ))}
    </div>
  );
}

function applySectionStyles(section: SectionModel, content: SiteContent): React.CSSProperties {
  const typo = section.style.typography;
  const colors = section.style.colors;

  const fontWeight = typo.bold ? 700 : (typo.fontWeight ?? content.theme.fonts.fontWeight);
  const fontStyle = typo.italic ? "italic" : "normal";
  const textDecoration = typo.underline ? "underline" : "none";

  return {
    background: colors.backgroundColor || colors.sectionBackground || content.theme.colors.sectionBackground,
    color: colors.textColor || typo.color || content.theme.colors.textColor,
    fontFamily: typo.fontFamily || content.theme.fonts.fontFamily,
    fontSize: `${typo.fontSize ?? content.theme.fonts.fontSize}px`,
    fontWeight,
    letterSpacing: `${typo.letterSpacing ?? content.theme.fonts.letterSpacing}px`,
    lineHeight: typo.lineHeight ?? content.theme.fonts.lineHeight,
    textAlign: (typo.textAlign || content.theme.fonts.textAlign) as React.CSSProperties["textAlign"],
    textTransform: (typo.transform || content.theme.fonts.transform) as React.CSSProperties["textTransform"],
    fontStyle,
    textDecoration,
    backgroundImage: section.style.backgroundImage
      ? `linear-gradient(${content.theme.colors.overlayColor}, ${content.theme.colors.overlayColor}), url(${section.style.backgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function Navbar({ content, activePageId, onNavigatePage }: { content: SiteContent; activePageId: string; onNavigatePage?: (pageId: string) => void }) {
  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{ background: content.theme.colors.navigationColor, borderColor: content.theme.colors.borderColor }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {content.theme.logo ? <img src={content.theme.logo} alt="Logo" className="h-9 w-9 object-contain" /> : null}
          <div>
            <p className="text-lg font-semibold leading-none">{content.siteTitle}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#ccb97f]">{content.menuTitle}</p>
          </div>
        </div>

        <nav className="flex items-center gap-2 flex-wrap justify-end">
          {content.navigation.filter((item) => item.visible).map((item) => {
            if (item.type === "external") {
              return (
                <a key={item.id} href={item.url || "#"} target="_blank" rel="noreferrer" className="text-xs px-3 py-2 border" style={{ borderColor: content.theme.colors.borderColor }}>
                  {item.label}
                </a>
              );
            }

            return (
              <button
                key={item.id}
                className="text-xs px-3 py-2 border"
                style={{
                  borderColor: item.pageId === activePageId ? content.theme.colors.buttonColor : content.theme.colors.borderColor,
                  color: item.pageId === activePageId ? content.theme.colors.buttonColor : content.theme.colors.textColor,
                }}
                onClick={() => item.pageId && onNavigatePage?.(item.pageId)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t mt-10" style={{ background: content.theme.colors.footerColor, borderColor: content.theme.colors.borderColor }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-3">
        <p>{content.footer.text}</p>
        <div className="flex flex-wrap gap-3 text-xs">
          {content.footer.links.filter((l) => l.visible).map((l) => (
            <span key={l.id}>{l.label}</span>
          ))}
        </div>
        <p className="text-xs text-[#c7c1ad]">{content.contact.email} | {content.contact.phone} | {content.contact.address}</p>
      </div>
    </footer>
  );
}

function pageById(content: SiteContent, pageId: string): PageModel | undefined {
  return content.pages.find((p) => p.id === pageId) || content.pages.find((p) => p.visible);
}

export default function SiteRenderer({
  content,
  activePageId,
  selectedSectionId,
  editable,
  onSelectSection,
  onNavigatePage,
}: SiteRendererProps) {
  const page = pageById(content, activePageId);

  return (
    <div
      className="min-h-screen"
      style={{
        background: content.theme.colors.backgroundColor,
        color: content.theme.colors.textColor,
        backgroundImage: content.theme.backgroundImage ? `url(${content.theme.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar content={content} activePageId={page?.id || ""} onNavigatePage={onNavigatePage} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-5">
        {!page ? (
          <div className="p-6 border" style={{ borderColor: content.theme.colors.borderColor }}>
            No visible page is available.
          </div>
        ) : (
          page.sections.map((section) => {
            if (!section.visible || section.style.hidden) return null;
            const selected = selectedSectionId === section.id;

            return (
              <section
                key={section.id}
                className={`border p-6 transition-all ${editable ? "cursor-pointer" : ""}`}
                style={{
                  ...applySectionStyles(section, content),
                  borderColor: selected ? content.theme.colors.buttonColor : content.theme.colors.borderColor,
                  boxShadow: selected ? `0 0 0 1px ${content.theme.colors.buttonColor}` : "none",
                }}
                onClick={() => editable && onSelectSection?.(page.id, section.id)}
              >
                <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#bbaa7e]">{section.name}</div>
                {renderSectionBody(section, content)}
              </section>
            );
          })
        )}
      </main>

      <Footer content={content} />
    </div>
  );
}
