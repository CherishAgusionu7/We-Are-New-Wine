import { NavItem, PageModel, SectionModel, SiteContent } from "./types";

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function cloneContent(content: SiteContent): SiteContent {
  return structuredClone(content);
}

export function findPage(content: SiteContent, pageId: string): PageModel | undefined {
  return content.pages.find((p) => p.id === pageId);
}

export function findSection(content: SiteContent, pageId: string, sectionId: string): SectionModel | undefined {
  const page = findPage(content, pageId);
  return page?.sections.find((s) => s.id === sectionId);
}

export function reorder<T>(items: T[], from: number, to: number): T[] {
  const copy = [...items];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export function ensureNavigationMatchesPages(content: SiteContent): SiteContent {
  const pageMap = new Map(content.pages.map((p) => [p.id, p]));

  const cleaned = content.navigation.filter((item) => {
    if (item.type !== "internal") return true;
    if (!item.pageId) return false;
    return pageMap.has(item.pageId);
  });

  const ids = new Set(cleaned.filter((i) => i.type === "internal").map((i) => i.pageId));

  content.pages.forEach((page) => {
    if (!ids.has(page.id)) {
      cleaned.push({
        id: uid("nav"),
        label: page.title,
        type: "internal",
        pageId: page.id,
        visible: page.visible,
      });
    }
  });

  cleaned.forEach((item) => {
    if (item.type === "internal" && item.pageId) {
      const page = pageMap.get(item.pageId);
      if (page) {
        item.label = page.title;
        item.visible = page.visible;
      }
    }
  });

  content.navigation = cleaned;
  return content;
}

export function updateNestedValue<T extends Record<string, unknown>>(
  obj: T,
  path: string[],
  value: unknown,
): T {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  const copy = { ...obj } as Record<string, unknown>;

  if (tail.length === 0) {
    copy[head] = value;
    return copy as T;
  }

  const current = copy[head];
  if (typeof current === "object" && current !== null && !Array.isArray(current)) {
    copy[head] = updateNestedValue(current as Record<string, unknown>, tail, value);
    return copy as T;
  }

  copy[head] = updateNestedValue({}, tail, value);
  return copy as T;
}

export function withSectionUpdate(
  content: SiteContent,
  pageId: string,
  sectionId: string,
  updater: (section: SectionModel) => SectionModel,
): SiteContent {
  const next = cloneContent(content);
  const page = next.pages.find((p) => p.id === pageId);
  if (!page) return next;
  page.sections = page.sections.map((section) => (section.id === sectionId ? updater(section) : section));
  return next;
}

export function flattenNav(items: NavItem[]): NavItem[] {
  const list: NavItem[] = [];
  items.forEach((item) => {
    list.push(item);
    if (item.children?.length) {
      list.push(...flattenNav(item.children));
    }
  });
  return list;
}
