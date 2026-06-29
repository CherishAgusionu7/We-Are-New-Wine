import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ImagePlus,
  LayoutPanelLeft,
  Minus,
  Plus,
  Redo2,
  Save,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { defaultContent } from "./cms/defaultContent";
import {
  fetchCMSState,
  publishDraft,
  resetSection,
  restoreVersion,
  saveDraft,
  uploadMedia,
} from "./cms/api";
import {
  CMSState,
  ColorSettings,
  MediaItem,
  NavItem,
  PageModel,
  SectionModel,
  SiteContent,
  TypographySettings,
} from "./cms/types";
import {
  cloneContent,
  ensureNavigationMatchesPages,
  findPage,
  findSection,
  reorder,
  uid,
  updateNestedValue,
} from "./cms/utils";

type EditorTab =
  | "general"
  | "homepage"
  | "pages"
  | "navigation"
  | "sections"
  | "media"
  | "appearance"
  | "theme"
  | "footer"
  | "contact"
  | "events"
  | "ministries";

const editorTabs: { id: EditorTab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "homepage", label: "Homepage" },
  { id: "pages", label: "Pages" },
  { id: "navigation", label: "Navigation" },
  { id: "sections", label: "Sections" },
  { id: "media", label: "Media" },
  { id: "appearance", label: "Appearance" },
  { id: "theme", label: "Theme" },
  { id: "footer", label: "Footer" },
  { id: "contact", label: "Contact" },
  { id: "events", label: "Events" },
  { id: "ministries", label: "Ministries" },
];

const emptyTypography: TypographySettings = {
  fontFamily: "Playfair Display",
  fontSize: 16,
  fontWeight: 400,
  color: "#f5f0e6",
  letterSpacing: 0,
  lineHeight: 1.5,
  textAlign: "left",
  transform: "none",
  bold: false,
  italic: false,
  underline: false,
};

function applyTypography(base: TypographySettings, partial?: Partial<TypographySettings>): React.CSSProperties {
  const merged = { ...base, ...(partial || {}) };
  return {
    fontFamily: merged.fontFamily,
    fontSize: `${merged.fontSize}px`,
    fontWeight: merged.bold ? 700 : merged.fontWeight,
    color: merged.color,
    letterSpacing: `${merged.letterSpacing}px`,
    lineHeight: merged.lineHeight,
    textAlign: merged.textAlign,
    textTransform: merged.transform,
    fontStyle: merged.italic ? "italic" : "normal",
    textDecoration: merged.underline ? "underline" : "none",
  };
}

function buttonSize(size: string): string {
  if (size === "sm") return "px-3 py-2 text-xs";
  if (size === "lg") return "px-7 py-4 text-base";
  return "px-5 py-3 text-sm";
}

function App() {
  const [cmsState, setCmsState] = useState<CMSState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [activePageId, setActivePageId] = useState("page-home");
  const [activeTab, setActiveTab] = useState<EditorTab>("general");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<SiteContent[]>([]);
  const [redoStack, setRedoStack] = useState<SiteContent[]>([]);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready");

  const displayContent = useMemo(() => {
    if (!cmsState) return defaultContent;
    return previewMode ? cmsState.draft : cmsState.published;
  }, [cmsState, previewMode]);

  const draftContent = cmsState?.draft ?? defaultContent;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const state = await fetchCMSState();
        setCmsState(state);

        const hashSlug = window.location.hash.replace("#", "").trim();
        if (hashSlug) {
          const fromHash = state.published.pages.find((p) => p.slug === hashSlug || p.id === hashSlug);
          if (fromHash) {
            setActivePageId(fromHash.id);
          }
        } else {
          setActivePageId(state.published.pages.find((p) => p.visible)?.id || state.published.pages[0]?.id || "page-home");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load CMS state.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const pushToHash = (pageId: string, content: SiteContent) => {
    const page = content.pages.find((p) => p.id === pageId);
    if (page) {
      window.history.replaceState({}, "", `#${page.slug}`);
    }
  };

  const persistDraft = async (draft: SiteContent, message: string) => {
    try {
      setSaving(true);
      const next = await saveDraft(draft);
      setCmsState(next);
      setStatusMessage(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const applyDraftMutation = (mutator: (draft: SiteContent) => void, message: string) => {
    if (!cmsState) return;

    const before = cloneContent(cmsState.draft);
    const next = cloneContent(cmsState.draft);
    mutator(next);
    ensureNavigationMatchesPages(next);

    setUndoStack((prev) => [...prev, before].slice(-100));
    setRedoStack([]);

    const optimistic: CMSState = {
      ...cmsState,
      draft: next,
      updatedAt: new Date().toISOString(),
    };
    setCmsState(optimistic);
    void persistDraft(next, message);
  };

  const handleUndo = () => {
    if (!cmsState || undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, cloneContent(cmsState.draft)].slice(-100));
    const next = { ...cmsState, draft: cloneContent(previous), updatedAt: new Date().toISOString() };
    setCmsState(next);
    void persistDraft(next.draft, "Undo complete");
  };

  const handleRedo = () => {
    if (!cmsState || redoStack.length === 0) return;
    const nextDraft = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, cloneContent(cmsState.draft)].slice(-100));
    const next = { ...cmsState, draft: cloneContent(nextDraft), updatedAt: new Date().toISOString() };
    setCmsState(next);
    void persistDraft(next.draft, "Redo complete");
  };

  const handlePublish = async () => {
    if (!cmsState) return;
    try {
      setSaving(true);
      const next = await publishDraft(`Publish ${new Date().toLocaleString()}`);
      setCmsState(next);
      setStatusMessage("Published to live site");
      setPreviewMode(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setSaving(false);
    }
  };

  const currentPage = displayContent.pages.find((p) => p.id === activePageId) || displayContent.pages[0];

  useEffect(() => {
    if (currentPage) {
      pushToHash(currentPage.id, displayContent);
    }
  }, [currentPage?.id, displayContent]);

  const selectedSection = useMemo(() => {
    if (!selectedSectionId || !cmsState) return null;
    return findSection(cmsState.draft, activePageId, selectedSectionId) || null;
  }, [cmsState, activePageId, selectedSectionId]);

  const updateSectionPath = (path: string[], value: unknown) => {
    if (!selectedSectionId) return;
    applyDraftMutation((draft) => {
      const section = findSection(draft, activePageId, selectedSectionId);
      if (!section) return;
      section.content = updateNestedValue(section.content, path, value);
    }, "Section updated");
  };

  const updateSectionStyle = (path: string[], value: unknown) => {
    if (!selectedSectionId) return;
    applyDraftMutation((draft) => {
      const section = findSection(draft, activePageId, selectedSectionId);
      if (!section) return;
      section.style = updateNestedValue(section.style as unknown as Record<string, unknown>, path, value) as unknown as SectionModel["style"];
    }, "Section style updated");
  };

  const updateThemePath = (path: string[], value: unknown) => {
    applyDraftMutation((draft) => {
      draft.theme = updateNestedValue(draft.theme as unknown as Record<string, unknown>, path, value) as unknown as SiteContent["theme"];
    }, "Theme saved");
  };

  const movePage = (from: number, to: number) => {
    applyDraftMutation((draft) => {
      draft.pages = reorder(draft.pages, from, to);
    }, "Page order updated");
  };

  const moveSection = (from: number, to: number) => {
    applyDraftMutation((draft) => {
      const page = findPage(draft, activePageId);
      if (!page) return;
      page.sections = reorder(page.sections, from, to);
    }, "Section order updated");
  };

  const handleMediaUpload = async (file: File) => {
    try {
      setSaving(true);
      const uploaded = await uploadMedia(file);
      applyDraftMutation((draft) => {
        draft.mediaLibrary.unshift({
          id: uid("media"),
          name: uploaded.name,
          type: uploaded.type as MediaItem["type"],
          url: uploaded.url,
          uploadedAt: new Date().toISOString(),
        });
      }, "Media uploaded");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Media upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      setSaving(true);
      const next = await restoreVersion(versionId);
      setCmsState(next);
      setStatusMessage("Version restored to draft");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to restore version.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = async () => {
    if (!selectedSectionId) return;
    try {
      setSaving(true);
      const next = await resetSection(activePageId, selectedSectionId);
      setCmsState(next);
      setStatusMessage("Section reset to published version");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reset section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-bg text-white p-8">Loading CMS workspace...</div>;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: draftContent.theme.backgroundImage
          ? `linear-gradient(${draftContent.theme.colors.overlayColor}, ${draftContent.theme.colors.overlayColor}), url(${draftContent.theme.backgroundImage}) center/cover fixed`
          : draftContent.theme.colors.backgroundColor,
      }}
    >
      <header className="border-b border-[#2f2b21] sticky top-0 z-40" style={{ background: displayContent.theme.colors.navigationColor }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {displayContent.theme.logo ? (
              <img src={displayContent.theme.logo} alt="Logo" className="w-10 h-10 object-cover border border-[#4f4738]" />
            ) : (
              <div className="w-10 h-10 border border-[#4f4738] grid place-items-center text-xs text-[#d9b24c]">NW</div>
            )}
            <div>
              <div className="text-lg font-semibold" style={{ color: displayContent.theme.colors.textColor }}>
                {displayContent.siteTitle}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#b8ad96]">{displayContent.menuTitle}</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-2 flex-wrap">
            {displayContent.navigation
              .filter((item) => item.visible)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.type === "external" && item.url) {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                      return;
                    }
                    if (item.pageId) {
                      setActivePageId(item.pageId);
                    }
                  }}
                  className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                    item.pageId === activePageId ? "bg-[#d9b24c] text-black border-[#d9b24c]" : "text-[#f0e8da] border-[#443f33]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode((v) => !v)}
              className={`px-3 py-2 text-xs border flex items-center gap-1 ${previewMode ? "bg-[#1f2a1f] text-[#a5f3a5]" : "text-[#f6e8c7]"}`}
            >
              <Eye className="w-4 h-4" /> {previewMode ? "Preview Mode" : "Public Mode"}
            </button>
            <button
              onClick={() => setEditorOpen((v) => !v)}
              className="px-3 py-2 text-xs border border-[#5f5643] text-[#f6e8c7] flex items-center gap-1"
            >
              <LayoutPanelLeft className="w-4 h-4" /> {editorOpen ? "Hide Editor" : "Open Editor"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-[#11100d] border border-[#302b21] min-h-[560px]">
          {currentPage ? (
            <div>
              {currentPage.sections
                .filter((section) => section.visible)
                .map((section) => {
                  const selected = selectedSectionId === section.id;
                  const typography = applyTypography(
                    draftContent.theme.fonts,
                    section.style.typography || {},
                  );
                  const sectionBg = section.style.colors.backgroundColor || draftContent.theme.colors.sectionBackground;
                  return (
                    <article
                      key={section.id}
                      onClick={() => {
                        if (editorOpen) {
                          setSelectedSectionId(section.id);
                          setActiveTab("sections");
                        }
                      }}
                      className={`p-8 border-b border-[#2e2a22] cursor-pointer transition-all ${selected ? "outline outline-2 outline-[#d9b24c]" : ""}`}
                      style={{
                        background: section.style.backgroundImage
                          ? `linear-gradient(${draftContent.theme.colors.overlayColor}, ${draftContent.theme.colors.overlayColor}), url(${section.style.backgroundImage}) center/cover`
                          : sectionBg,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[11px] uppercase tracking-wider text-[#cdbf9d]">{section.name}</div>
                        {editorOpen && <div className="text-[10px] text-[#d9b24c]">Click to edit</div>}
                      </div>

                      <SectionRenderer
                        section={section}
                        content={displayContent}
                        typography={typography}
                        theme={displayContent.theme.colors}
                      />
                    </article>
                  );
                })}
            </div>
          ) : (
            <div className="p-8 text-[#cdbf9d]">No visible page found.</div>
          )}

          <footer className="p-6 border-t border-[#2f2b21]" style={{ background: displayContent.theme.colors.footerColor }}>
            <div className="text-sm text-[#f4ecde]">{displayContent.footer.text}</div>
            <div className="text-xs text-[#c7bca1] mt-2">
              {displayContent.contact.email} | {displayContent.contact.phone} | {displayContent.contact.address}
            </div>
          </footer>
        </section>

        {editorOpen && cmsState && (
          <aside className="bg-[#14120e] border border-[#302b21] text-[#f5ecdc]">
            <div className="p-4 border-b border-[#2f2b21] flex flex-wrap gap-2 items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Administrator Control Board</div>
                <div className="text-[10px] text-[#bcae8c]">Autosave enabled, backed by server storage</div>
              </div>
              <div className="text-[10px] text-[#d9b24c]">{saving ? "Saving..." : statusMessage}</div>
            </div>

            <div className="p-3 border-b border-[#2f2b21] flex flex-wrap gap-2">
              <button onClick={handleUndo} className="px-2 py-1 border border-[#5b523f] text-xs flex items-center gap-1" disabled={undoStack.length === 0}>
                <Undo2 className="w-3 h-3" /> Undo
              </button>
              <button onClick={handleRedo} className="px-2 py-1 border border-[#5b523f] text-xs flex items-center gap-1" disabled={redoStack.length === 0}>
                <Redo2 className="w-3 h-3" /> Redo
              </button>
              <button onClick={handlePublish} className="px-2 py-1 border border-[#d9b24c] bg-[#d9b24c] text-black text-xs flex items-center gap-1">
                <Save className="w-3 h-3" /> Publish
              </button>
              {selectedSection && (
                <button onClick={handleResetSection} className="px-2 py-1 border border-[#5b523f] text-xs">
                  Reset Section
                </button>
              )}
            </div>

            <div className="p-3 border-b border-[#2f2b21]">
              <div className="grid grid-cols-3 gap-2">
                {cmsState.versions.slice(0, 3).map((version) => (
                  <button
                    key={version.id}
                    onClick={() => void handleRestoreVersion(version.id)}
                    className="p-2 border border-[#4a4334] text-left"
                    title={version.createdAt}
                  >
                    <div className="text-[10px] uppercase text-[#d7c296]">{version.label}</div>
                    <div className="text-[10px] text-[#9f957a] mt-1">Restore</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 border-b border-[#2f2b21] flex flex-wrap gap-1">
              {editorTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-1 text-[11px] border ${activeTab === tab.id ? "bg-[#d9b24c] text-black border-[#d9b24c]" : "border-[#4d4535]"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-3 max-h-[68vh] overflow-y-auto text-sm space-y-4">
              {activeTab === "general" && (
                <div className="space-y-3">
                  <Input label="Site title" value={draftContent.siteTitle} onChange={(value) => applyDraftMutation((d) => { d.siteTitle = value; }, "Site title saved")} />
                  <Input label="Menu subtitle" value={draftContent.menuTitle} onChange={(value) => applyDraftMutation((d) => { d.menuTitle = value; }, "Menu subtitle saved")} />
                  <Input label="Logo URL" value={draftContent.theme.logo} onChange={(value) => updateThemePath(["logo"], value)} />
                  <Input label="Hero banner image" value={draftContent.theme.heroBannerImage} onChange={(value) => updateThemePath(["heroBannerImage"], value)} />
                  <Input label="Background image" value={draftContent.theme.backgroundImage} onChange={(value) => updateThemePath(["backgroundImage"], value)} />
                </div>
              )}

              {activeTab === "homepage" && (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-[#d4c59d]">Homepage quick controls</div>
                  {findPage(draftContent, "page-home")?.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActivePageId("page-home");
                        setSelectedSectionId(section.id);
                        setActiveTab("sections");
                      }}
                      className="w-full text-left px-3 py-2 border border-[#4d4535]"
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "pages" && (
                <PageManager
                  content={draftContent}
                  activePageId={activePageId}
                  onPickPage={(pageId) => setActivePageId(pageId)}
                  onAdd={() => applyDraftMutation((draft) => {
                    const pageId = uid("page");
                    draft.pages.push({
                      id: pageId,
                      title: "New Page",
                      slug: `new-page-${draft.pages.length + 1}`,
                      template: "default",
                      visible: true,
                      sections: [
                        {
                          id: uid("sec"),
                          name: "Intro",
                          type: "text",
                          visible: true,
                          content: { title: "New section", body: "Edit this section from the CMS." },
                          style: { typography: {}, colors: {} },
                        },
                      ],
                    });
                    setActivePageId(pageId);
                  }, "Page created")}
                  onDelete={(pageId) => applyDraftMutation((draft) => {
                    draft.pages = draft.pages.filter((page) => page.id !== pageId);
                    if (activePageId === pageId) {
                      setActivePageId(draft.pages[0]?.id || "");
                    }
                  }, "Page deleted")}
                  onDuplicate={(pageId) => applyDraftMutation((draft) => {
                    const page = draft.pages.find((item) => item.id === pageId);
                    if (!page) return;
                    const copyId = uid("page");
                    const clone = structuredClone(page);
                    clone.id = copyId;
                    clone.title = `${clone.title} Copy`;
                    clone.slug = `${clone.slug}-copy-${Math.floor(Math.random() * 1000)}`;
                    clone.sections = clone.sections.map((section) => ({
                      ...section,
                      id: uid("sec"),
                    }));
                    draft.pages.push(clone);
                    setActivePageId(copyId);
                  }, "Page duplicated")}
                  onMove={movePage}
                  onUpdate={(pageId, updater) => applyDraftMutation((draft) => {
                    const page = draft.pages.find((item) => item.id === pageId);
                    if (!page) return;
                    updater(page);
                  }, "Page settings updated")}
                />
              )}

              {activeTab === "navigation" && (
                <NavigationManager
                  content={draftContent}
                  onMutate={(mutator, message) => applyDraftMutation(mutator, message)}
                />
              )}

              {activeTab === "sections" && (
                <SectionManager
                  content={draftContent}
                  activePageId={activePageId}
                  selectedSectionId={selectedSectionId}
                  setSelectedSectionId={setSelectedSectionId}
                  onMove={moveSection}
                  onMutate={(mutator, message) => applyDraftMutation(mutator, message)}
                  onUpdatePath={updateSectionPath}
                  onUpdateStyle={updateSectionStyle}
                  onSetActivePage={setActivePageId}
                />
              )}

              {activeTab === "media" && (
                <MediaManager
                  media={draftContent.mediaLibrary}
                  onUpload={handleMediaUpload}
                  onDelete={(id) => applyDraftMutation((draft) => {
                    draft.mediaLibrary = draft.mediaLibrary.filter((item) => item.id !== id);
                  }, "Media removed")}
                />
              )}

              {activeTab === "appearance" && (
                <ColorAndTypographyEditor
                  typography={draftContent.theme.fonts}
                  colors={draftContent.theme.colors}
                  onTypographyChange={(path, value) => updateThemePath(["fonts", ...path], value)}
                  onColorChange={(path, value) => updateThemePath(["colors", ...path], value)}
                />
              )}

              {activeTab === "theme" && (
                <div className="space-y-3">
                  <Input label="Theme logo" value={draftContent.theme.logo} onChange={(value) => updateThemePath(["logo"], value)} />
                  <Input label="Hero banner image" value={draftContent.theme.heroBannerImage} onChange={(value) => updateThemePath(["heroBannerImage"], value)} />
                  <Input label="Global background image" value={draftContent.theme.backgroundImage} onChange={(value) => updateThemePath(["backgroundImage"], value)} />
                </div>
              )}

              {activeTab === "footer" && (
                <div className="space-y-3">
                  <Input
                    label="Footer text"
                    value={draftContent.footer.text}
                    onChange={(value) => applyDraftMutation((draft) => {
                      draft.footer.text = value;
                    }, "Footer updated")}
                  />
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-3">
                  <Input label="Contact email" value={draftContent.contact.email} onChange={(value) => applyDraftMutation((draft) => { draft.contact.email = value; }, "Contact saved")} />
                  <Input label="Contact phone" value={draftContent.contact.phone} onChange={(value) => applyDraftMutation((draft) => { draft.contact.phone = value; }, "Contact saved")} />
                  <Input label="Contact address" value={draftContent.contact.address} onChange={(value) => applyDraftMutation((draft) => { draft.contact.address = value; }, "Contact saved")} />
                </div>
              )}

              {activeTab === "events" && (
                <CollectionManager
                  title="Events"
                  items={draftContent.events}
                  makeItem={() => ({ id: uid("evt"), title: "New Event", date: new Date().toISOString().slice(0, 10), location: "", description: "" })}
                  fields={["title", "date", "location", "description"]}
                  onMutate={(mutator, msg) => applyDraftMutation((draft) => {
                    mutator(draft.events as unknown as Record<string, unknown>[]);
                  }, msg)}
                />
              )}

              {activeTab === "ministries" && (
                <CollectionManager
                  title="Ministries"
                  items={draftContent.ministries}
                  makeItem={() => ({ id: uid("min"), title: "New Ministry", summary: "", lead: "" })}
                  fields={["title", "summary", "lead"]}
                  onMutate={(mutator, msg) => applyDraftMutation((draft) => {
                    mutator(draft.ministries as unknown as Record<string, unknown>[]);
                  }, msg)}
                />
              )}

              {selectedSection && activeTab !== "sections" && (
                <div className="border border-[#4d4535] p-2 text-xs text-[#d8caab]">
                  Selected section: {selectedSection.name}. Open the Sections tab to edit its content, colors, typography, and buttons.
                </div>
              )}
            </div>
          </aside>
        )}
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-[#3a1010] text-[#ffd8d8] border border-[#7a3131] px-3 py-2 text-xs max-w-sm">
          {error}
          <button className="ml-2 underline" onClick={() => setError(null)}>
            close
          </button>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string | number; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] uppercase tracking-wider text-[#bcae8c]">{label}</span>
      <input
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0f0d0a] border border-[#4c4434] px-3 py-2 text-sm"
      />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1">
      <span className="text-[11px] uppercase tracking-wider text-[#bcae8c] block">{label}</span>
      <div className="flex gap-2">
        <input type="color" value={value.startsWith("#") ? value : "#000000"} onChange={(e) => onChange(e.target.value)} className="w-12 h-10 bg-transparent border border-[#4c4434]" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-[#0f0d0a] border border-[#4c4434] px-3 py-2 text-sm" placeholder="#hex or rgb(...)" />
      </div>
    </div>
  );
}

function SectionRenderer({
  section,
  content,
  typography,
  theme,
}: {
  section: SectionModel;
  content: SiteContent;
  typography: React.CSSProperties;
  theme: ColorSettings;
}) {
  const c = section.content as Record<string, any>;

  if (section.type === "hero") {
    const button = c.button || {};
    return (
      <div style={typography} className="space-y-4">
        <div className="text-[11px] uppercase tracking-widest text-[#ccb483]">{c.eyebrow || "Hero"}</div>
        <h1 className="text-4xl font-semibold">{c.title || "Hero Title"}</h1>
        <p className="text-base opacity-80">{c.subtitle || "Hero subtitle"}</p>
        {button.visible !== false && (
          <a
            href={button.link || "#"}
            className={`${buttonSize(button.size || "md")} inline-flex items-center gap-2`}
            style={{
              background: button.color || theme.buttonColor,
              borderRadius: `${Number(button.borderRadius || 0)}px`,
              color: "#111",
            }}
          >
            {button.icon ? <span>{button.icon}</span> : null}
            {button.text || "Click"}
          </a>
        )}
      </div>
    );
  }

  if (section.type === "events") {
    const items = c.useGlobalEvents ? content.events : c.items || [];
    return (
      <div style={typography}>
        <h2 className="text-2xl mb-4">{c.title || "Events"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((item: any) => (
            <div key={item.id || item.title} className="p-3 border" style={{ borderColor: theme.borderColor, background: theme.cardColor }}>
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs opacity-80">{item.date} | {item.location}</div>
              <p className="text-sm mt-2 opacity-90">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "ministries") {
    const items = c.useGlobalMinistries ? content.ministries : c.items || [];
    return (
      <div style={typography}>
        <h2 className="text-2xl mb-4">{c.title || "Ministries"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((item: any) => (
            <div key={item.id || item.title} className="p-3 border" style={{ borderColor: theme.borderColor, background: theme.cardColor }}>
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs opacity-80">Lead: {item.lead}</div>
              <p className="text-sm mt-2 opacity-90">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "contact") {
    return (
      <div style={typography} className="space-y-2">
        <h2 className="text-2xl">{c.title || "Contact"}</h2>
        <p>{c.body || "Contact us"}</p>
        <p className="text-sm opacity-90">{content.contact.email}</p>
        <p className="text-sm opacity-90">{content.contact.phone}</p>
        <p className="text-sm opacity-90">{content.contact.address}</p>
      </div>
    );
  }

  return (
    <div style={typography} className="space-y-3">
      {c.title && <h2 className="text-2xl">{String(c.title)}</h2>}
      {c.body && <p className="opacity-90 whitespace-pre-wrap">{String(c.body)}</p>}
      {!c.title && !c.body && <pre className="text-xs opacity-80 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>}
    </div>
  );
}

function PageManager({
  content,
  activePageId,
  onPickPage,
  onAdd,
  onDelete,
  onDuplicate,
  onMove,
  onUpdate,
}: {
  content: SiteContent;
  activePageId: string;
  onPickPage: (pageId: string) => void;
  onAdd: () => void;
  onDelete: (pageId: string) => void;
  onDuplicate: (pageId: string) => void;
  onMove: (from: number, to: number) => void;
  onUpdate: (pageId: string, updater: (page: PageModel) => void) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <button onClick={onAdd} className="w-full border border-[#5a513f] px-3 py-2 text-xs flex items-center justify-center gap-1">
        <Plus className="w-3 h-3" /> Create page
      </button>

      {content.pages.map((page, index) => (
        <div
          key={page.id}
          className="border border-[#4a4335] p-2 space-y-2"
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex === null) return;
            onMove(dragIndex, index);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
        >
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => onPickPage(page.id)} className={`text-left flex-1 text-sm ${page.id === activePageId ? "text-[#d9b24c]" : ""}`}>
              {page.title}
            </button>
            <div className="flex gap-1">
              <button onClick={() => onMove(index, Math.max(index - 1, 0))} className="p-1 border border-[#5a513f]"><ArrowUp className="w-3 h-3" /></button>
              <button onClick={() => onMove(index, Math.min(index + 1, content.pages.length - 1))} className="p-1 border border-[#5a513f]"><ArrowDown className="w-3 h-3" /></button>
              <button onClick={() => onDuplicate(page.id)} className="p-1 border border-[#5a513f]"><Plus className="w-3 h-3" /></button>
              <button onClick={() => onDelete(page.id)} className="p-1 border border-[#5a513f]"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>

          <Input label="Page name" value={page.title} onChange={(value) => onUpdate(page.id, (p) => { p.title = value; })} />
          <Input label="Slug/URL" value={page.slug} onChange={(value) => onUpdate(page.id, (p) => { p.slug = value.replace(/\s+/g, "-").toLowerCase(); })} />

          <label className="flex items-center justify-between text-xs">
            <span className="text-[#bcae8c] uppercase tracking-wider">Template</span>
            <select
              value={page.template}
              onChange={(e) => onUpdate(page.id, (p) => { p.template = e.target.value as PageModel["template"]; })}
              className="bg-[#0f0d0a] border border-[#4d4535] px-2 py-1"
            >
              <option value="default">Default</option>
              <option value="landing">Landing</option>
              <option value="blog">Blog</option>
              <option value="events">Events</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={page.visible} onChange={(e) => onUpdate(page.id, (p) => { p.visible = e.target.checked; })} />
            Page visible
          </label>
        </div>
      ))}
    </div>
  );
}

function NavigationManager({
  content,
  onMutate,
}: {
  content: SiteContent;
  onMutate: (mutator: (draft: SiteContent) => void, message: string) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <button
        className="w-full border border-[#5a513f] px-3 py-2 text-xs flex items-center justify-center gap-1"
        onClick={() => onMutate((draft) => {
          draft.navigation.push({
            id: uid("nav"),
            label: "New Link",
            type: "external",
            url: "https://example.com",
            visible: true,
            children: [],
          });
        }, "Navigation link added")}
      >
        <Plus className="w-3 h-3" /> Add navigation link
      </button>

      {content.navigation.map((item, index) => (
        <div
          key={item.id}
          className="border border-[#4a4335] p-2 space-y-2"
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex === null) return;
            onMutate((draft) => {
              draft.navigation = reorder(draft.navigation, dragIndex, index);
            }, "Navigation reordered");
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
        >
          <div className="flex items-center gap-2">
            <input
              value={item.label}
              onChange={(e) => onMutate((draft) => {
                const target = draft.navigation.find((n) => n.id === item.id);
                if (!target) return;
                target.label = e.target.value;
              }, "Navigation label updated")}
              className="flex-1 bg-[#0f0d0a] border border-[#4d4535] px-2 py-1 text-sm"
            />
            <button className="p-1 border border-[#5a513f]" onClick={() => onMutate((draft) => {
              draft.navigation = reorder(draft.navigation, index, Math.max(index - 1, 0));
            }, "Navigation reordered")}><ArrowUp className="w-3 h-3" /></button>
            <button className="p-1 border border-[#5a513f]" onClick={() => onMutate((draft) => {
              draft.navigation = reorder(draft.navigation, index, Math.min(index + 1, draft.navigation.length - 1));
            }, "Navigation reordered")}><ArrowDown className="w-3 h-3" /></button>
            <button className="p-1 border border-[#5a513f]" onClick={() => onMutate((draft) => {
              draft.navigation = draft.navigation.filter((n) => n.id !== item.id);
            }, "Navigation item removed")}><Trash2 className="w-3 h-3" /></button>
          </div>

          <label className="flex items-center justify-between text-xs">
            <span className="text-[#bcae8c] uppercase tracking-wider">Type</span>
            <select
              value={item.type}
              onChange={(e) => onMutate((draft) => {
                const target = draft.navigation.find((n) => n.id === item.id);
                if (!target) return;
                target.type = e.target.value as NavItem["type"];
                if (target.type === "internal") {
                  target.pageId = draft.pages[0]?.id;
                } else {
                  target.url = target.url || "https://";
                }
              }, "Navigation type updated")}
              className="bg-[#0f0d0a] border border-[#4d4535] px-2 py-1"
            >
              <option value="internal">Internal page</option>
              <option value="external">External URL</option>
            </select>
          </label>

          {item.type === "internal" ? (
            <label className="flex items-center justify-between text-xs">
              <span className="text-[#bcae8c] uppercase tracking-wider">Page</span>
              <select
                value={item.pageId}
                onChange={(e) => onMutate((draft) => {
                  const target = draft.navigation.find((n) => n.id === item.id);
                  if (!target) return;
                  target.pageId = e.target.value;
                }, "Navigation target page updated")}
                className="bg-[#0f0d0a] border border-[#4d4535] px-2 py-1"
              >
                {content.pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <Input
              label="External URL"
              value={item.url || ""}
              onChange={(value) => onMutate((draft) => {
                const target = draft.navigation.find((n) => n.id === item.id);
                if (!target) return;
                target.url = value;
              }, "Navigation URL updated")}
            />
          )}

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={(e) => onMutate((draft) => {
                const target = draft.navigation.find((n) => n.id === item.id);
                if (!target) return;
                target.visible = e.target.checked;
              }, "Navigation visibility updated")}
            />
            Visible in menu
          </label>

          <button
            className="w-full border border-[#5a513f] px-2 py-1 text-xs"
            onClick={() => onMutate((draft) => {
              const target = draft.navigation.find((n) => n.id === item.id);
              if (!target) return;
              target.children = target.children || [];
              target.children.push({
                id: uid("nav-child"),
                label: "Dropdown Item",
                type: "external",
                url: "https://example.com",
                visible: true,
              });
            }, "Dropdown menu item added")}
          >
            Add dropdown menu item
          </button>

          {item.children?.map((child) => (
            <div key={child.id} className="border border-[#3e372c] p-2">
              <div className="flex gap-2">
                <input
                  value={child.label}
                  onChange={(e) => onMutate((draft) => {
                    const target = draft.navigation.find((n) => n.id === item.id);
                    const sub = target?.children?.find((c) => c.id === child.id);
                    if (!sub) return;
                    sub.label = e.target.value;
                  }, "Dropdown label updated")}
                  className="flex-1 bg-[#0f0d0a] border border-[#4d4535] px-2 py-1 text-sm"
                />
                <button
                  className="p-1 border border-[#5a513f]"
                  onClick={() => onMutate((draft) => {
                    const target = draft.navigation.find((n) => n.id === item.id);
                    if (!target?.children) return;
                    target.children = target.children.filter((c) => c.id !== child.id);
                  }, "Dropdown item removed")}
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
              <Input
                label="URL"
                value={child.url || ""}
                onChange={(value) => onMutate((draft) => {
                  const target = draft.navigation.find((n) => n.id === item.id);
                  const sub = target?.children?.find((c) => c.id === child.id);
                  if (!sub) return;
                  sub.url = value;
                }, "Dropdown URL updated")}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionManager({
  content,
  activePageId,
  selectedSectionId,
  setSelectedSectionId,
  onMove,
  onMutate,
  onUpdatePath,
  onUpdateStyle,
  onSetActivePage,
}: {
  content: SiteContent;
  activePageId: string;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  onMove: (from: number, to: number) => void;
  onMutate: (mutator: (draft: SiteContent) => void, message: string) => void;
  onUpdatePath: (path: string[], value: unknown) => void;
  onUpdateStyle: (path: string[], value: unknown) => void;
  onSetActivePage: (pageId: string) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const page = findPage(content, activePageId);
  const selected = selectedSectionId ? page?.sections.find((item) => item.id === selectedSectionId) : null;

  return (
    <div className="space-y-2">
      <label className="block space-y-1">
        <span className="text-[11px] uppercase tracking-wider text-[#bcae8c]">Editing page</span>
        <select
          className="w-full bg-[#0f0d0a] border border-[#4d4535] px-2 py-2 text-sm"
          value={activePageId}
          onChange={(e) => {
            onSetActivePage(e.target.value);
            setSelectedSectionId(null);
          }}
        >
          {content.pages.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </label>

      <button
        className="w-full border border-[#5a513f] px-3 py-2 text-xs flex items-center justify-center gap-1"
        onClick={() => onMutate((draft) => {
          const target = findPage(draft, activePageId);
          if (!target) return;
          const section: SectionModel = {
            id: uid("sec"),
            name: "New Section",
            type: "text",
            visible: true,
            content: { title: "Section title", body: "Section body" },
            style: { typography: {}, colors: {} },
          };
          target.sections.push(section);
          setSelectedSectionId(section.id);
        }, "Section added")}
      >
        <Plus className="w-3 h-3" /> Add new section
      </button>

      {page?.sections.map((section, index) => (
        <div
          key={section.id}
          className={`border p-2 ${selectedSectionId === section.id ? "border-[#d9b24c]" : "border-[#4a4335]"}`}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex === null) return;
            onMove(dragIndex, index);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
        >
          <div className="flex items-center justify-between gap-2">
            <button className="flex-1 text-left text-sm" onClick={() => setSelectedSectionId(section.id)}>{section.name}</button>
            <div className="flex gap-1">
              <button className="p-1 border border-[#5a513f]" onClick={() => onMove(index, Math.max(index - 1, 0))}><ArrowUp className="w-3 h-3" /></button>
              <button className="p-1 border border-[#5a513f]" onClick={() => onMove(index, Math.min(index + 1, (page?.sections.length || 1) - 1))}><ArrowDown className="w-3 h-3" /></button>
              <button className="p-1 border border-[#5a513f]" onClick={() => onMutate((draft) => {
                const target = findPage(draft, activePageId);
                const current = target?.sections.find((s) => s.id === section.id);
                if (!target || !current) return;
                const copy = structuredClone(current);
                copy.id = uid("sec");
                copy.name = `${current.name} Copy`;
                target.sections.splice(index + 1, 0, copy);
              }, "Section duplicated")}><Plus className="w-3 h-3" /></button>
              <button className="p-1 border border-[#5a513f]" onClick={() => onMutate((draft) => {
                const target = findPage(draft, activePageId);
                if (!target) return;
                target.sections = target.sections.filter((s) => s.id !== section.id);
                if (selectedSectionId === section.id) setSelectedSectionId(null);
              }, "Section deleted")}><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1"><input type="checkbox" checked={section.visible} onChange={(e) => onMutate((draft) => {
              const target = findSection(draft, activePageId, section.id);
              if (!target) return;
              target.visible = e.target.checked;
            }, "Section visibility updated")} /> visible</label>
          </div>
        </div>
      ))}

      {selected && (
        <div className="border border-[#4a4335] p-2 space-y-3">
          <Input label="Section name" value={selected.name} onChange={(value) => onMutate((draft) => {
            const section = findSection(draft, activePageId, selected.id);
            if (!section) return;
            section.name = value;
          }, "Section renamed")} />
          <label className="block space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#bcae8c]">Section type</span>
            <select
              value={selected.type}
              onChange={(e) => onMutate((draft) => {
                const section = findSection(draft, activePageId, selected.id);
                if (!section) return;
                section.type = e.target.value;
              }, "Section type updated")}
              className="w-full bg-[#0f0d0a] border border-[#4d4535] px-3 py-2 text-sm"
            >
              <option value="hero">Hero</option>
              <option value="text">Text</option>
              <option value="events">Events</option>
              <option value="ministries">Ministries</option>
              <option value="contact">Contact</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#bcae8c] mb-2">Section content</div>
            <DynamicEditor value={selected.content} path={[]} onChange={onUpdatePath} />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#bcae8c] mb-2">Typography controls</div>
            <TypographyEditor
              typography={{ ...emptyTypography, ...(selected.style.typography || {}) }}
              onChange={(path, value) => onUpdateStyle(["typography", ...path], value)}
            />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#bcae8c] mb-2">Color controls</div>
            <ColorEditor
              colors={{ ...content.theme.colors, ...(selected.style.colors || {}) }}
              onChange={(path, value) => onUpdateStyle(["colors", ...path], value)}
            />
          </div>

          <Input
            label="Section background image"
            value={selected.style.backgroundImage || ""}
            onChange={(value) => onUpdateStyle(["backgroundImage"], value)}
          />
        </div>
      )}
    </div>
  );
}

function MediaManager({
  media,
  onUpload,
  onDelete,
}: {
  media: MediaItem[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="border border-dashed border-[#5f5643] px-3 py-4 text-center text-xs block cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*,application/pdf,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.currentTarget.value = "";
          }}
        />
        <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Upload image, logo, PDF, or video</span>
      </label>

      {media.map((item) => (
        <div key={item.id} className="border border-[#4b4335] p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {item.type === "image" || item.type === "logo" ? (
              <img src={item.url} alt={item.name} className="w-10 h-10 object-cover border border-[#5b523f]" />
            ) : (
              <div className="w-10 h-10 border border-[#5b523f] grid place-items-center text-[10px]">{item.type}</div>
            )}
            <div>
              <div className="text-xs">{item.name}</div>
              <div className="text-[10px] text-[#bcae8c]">{item.type}</div>
            </div>
          </div>
          <div className="flex gap-1">
            <a href={item.url} target="_blank" rel="noreferrer" className="p-1 border border-[#5b523f]"><ImagePlus className="w-3 h-3" /></a>
            <button onClick={() => onDelete(item.id)} className="p-1 border border-[#5b523f]"><Trash2 className="w-3 h-3" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographyEditor({
  typography,
  onChange,
}: {
  typography: TypographySettings;
  onChange: (path: string[], value: unknown) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input label="Font family" value={typography.fontFamily} onChange={(value) => onChange(["fontFamily"], value)} />
      <Input label="Font size" value={typography.fontSize} onChange={(value) => onChange(["fontSize"], Number(value) || 16)} />
      <Input label="Font weight" value={typography.fontWeight} onChange={(value) => onChange(["fontWeight"], Number(value) || 400)} />
      <ColorInput label="Font color" value={typography.color} onChange={(value) => onChange(["color"], value)} />
      <Input label="Letter spacing" value={typography.letterSpacing} onChange={(value) => onChange(["letterSpacing"], Number(value) || 0)} />
      <Input label="Line height" value={typography.lineHeight} onChange={(value) => onChange(["lineHeight"], Number(value) || 1.5)} />
      <label className="block space-y-1">
        <span className="text-[11px] uppercase tracking-wider text-[#bcae8c]">Alignment</span>
        <select value={typography.textAlign} onChange={(e) => onChange(["textAlign"], e.target.value)} className="w-full bg-[#0f0d0a] border border-[#4d4535] px-3 py-2 text-sm">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] uppercase tracking-wider text-[#bcae8c]">Case</span>
        <select value={typography.transform} onChange={(e) => onChange(["transform"], e.target.value)} className="w-full bg-[#0f0d0a] border border-[#4d4535] px-3 py-2 text-sm">
          <option value="none">Normal</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={typography.bold} onChange={(e) => onChange(["bold"], e.target.checked)} /> Bold</label>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={typography.italic} onChange={(e) => onChange(["italic"], e.target.checked)} /> Italic</label>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={typography.underline} onChange={(e) => onChange(["underline"], e.target.checked)} /> Underline</label>
    </div>
  );
}

function ColorEditor({
  colors,
  onChange,
}: {
  colors: ColorSettings;
  onChange: (path: string[], value: unknown) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      <ColorInput label="Text color" value={colors.textColor} onChange={(value) => onChange(["textColor"], value)} />
      <ColorInput label="Background color" value={colors.backgroundColor} onChange={(value) => onChange(["backgroundColor"], value)} />
      <ColorInput label="Button color" value={colors.buttonColor} onChange={(value) => onChange(["buttonColor"], value)} />
      <ColorInput label="Button hover color" value={colors.buttonHoverColor} onChange={(value) => onChange(["buttonHoverColor"], value)} />
      <ColorInput label="Navigation color" value={colors.navigationColor} onChange={(value) => onChange(["navigationColor"], value)} />
      <ColorInput label="Footer color" value={colors.footerColor} onChange={(value) => onChange(["footerColor"], value)} />
      <ColorInput label="Card color" value={colors.cardColor} onChange={(value) => onChange(["cardColor"], value)} />
      <ColorInput label="Border color" value={colors.borderColor} onChange={(value) => onChange(["borderColor"], value)} />
      <ColorInput label="Section backgrounds" value={colors.sectionBackground} onChange={(value) => onChange(["sectionBackground"], value)} />
      <Input label="Overlay color (hex/rgb/rgba)" value={colors.overlayColor} onChange={(value) => onChange(["overlayColor"], value)} />
    </div>
  );
}

function ColorAndTypographyEditor({
  typography,
  colors,
  onTypographyChange,
  onColorChange,
}: {
  typography: TypographySettings;
  colors: ColorSettings;
  onTypographyChange: (path: string[], value: unknown) => void;
  onColorChange: (path: string[], value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#bcae8c] mb-2">Typography controls</div>
        <TypographyEditor typography={typography} onChange={onTypographyChange} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#bcae8c] mb-2">Color controls</div>
        <ColorEditor colors={colors} onChange={onColorChange} />
      </div>
    </div>
  );
}

function DynamicEditor({
  value,
  path,
  onChange,
}: {
  value: unknown;
  path: string[];
  onChange: (path: string[], value: unknown) => void;
}) {
  if (typeof value === "string") {
    const key = path[path.length - 1] || "value";
    if (/(color)$/i.test(key)) {
      return <ColorInput label={key} value={value} onChange={(next) => onChange(path, next)} />;
    }
    return <Input label={key} value={value} onChange={(next) => onChange(path, next)} />;
  }

  if (typeof value === "number") {
    return <Input label={path[path.length - 1] || "value"} value={value} onChange={(next) => onChange(path, Number(next) || 0)} />;
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={value} onChange={(e) => onChange(path, e.target.checked)} />
        {path[path.length - 1] || "enabled"}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider text-[#bcae8c]">{path[path.length - 1] || "items"}</div>
        {value.map((item, index) => (
          <div key={`${path.join(".")}-${index}`} className="border border-[#4a4335] p-2">
            <DynamicEditor value={item} path={[...path, String(index)]} onChange={onChange} />
            <button
              className="mt-2 px-2 py-1 border border-[#5a513f] text-xs"
              onClick={() => {
                const next = value.filter((_, i) => i !== index);
                onChange(path, next);
              }}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          className="px-2 py-1 border border-[#5a513f] text-xs"
          onClick={() => {
            const next = [...value, typeof value[0] === "object" ? {} : ""];
            onChange(path, next);
          }}
        >
          Add item
        </button>
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return (
      <div className="space-y-2">
        {Object.entries(obj).map(([key, child]) => (
          <div key={[...path, key].join(".")}>{<DynamicEditor value={child} path={[...path, key]} onChange={onChange} />}</div>
        ))}
      </div>
    );
  }

  return null;
}

function CollectionManager({
  title,
  items,
  makeItem,
  fields,
  onMutate,
}: {
  title: string;
  items: Record<string, unknown>[];
  makeItem: () => Record<string, unknown>;
  fields: string[];
  onMutate: (mutator: (items: Record<string, unknown>[]) => void, message: string) => void;
}) {
  return (
    <div className="space-y-2">
      <button
        className="w-full border border-[#5a513f] px-3 py-2 text-xs flex items-center justify-center gap-1"
        onClick={() => onMutate((list) => {
          list.push(makeItem());
        }, `${title} item added`)}
      >
        <Plus className="w-3 h-3" /> Add {title.slice(0, -1)}
      </button>

      {items.map((item, index) => (
        <div key={String(item.id || index)} className="border border-[#4a4335] p-2 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[#d5c7a4]">{String(item.title || `${title} ${index + 1}`)}</div>
            <button
              className="p-1 border border-[#5a513f]"
              onClick={() => onMutate((list) => {
                list.splice(index, 1);
              }, `${title} item deleted`)}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          {fields.map((field) => (
            <div key={field}>
              <Input
                label={field}
                value={String(item[field] || "")}
                onChange={(value) => onMutate((list) => {
                  const target = list[index];
                  target[field] = value;
                }, `${title} updated`)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
