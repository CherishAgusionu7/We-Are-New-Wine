import { CMSState, SiteContent } from "./types";

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchCMSState(): Promise<CMSState> {
  return request<CMSState>("/api/cms");
}

export async function saveDraft(draft: SiteContent): Promise<CMSState> {
  return request<CMSState>("/api/cms/draft", {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ draft }),
  });
}

export async function publishDraft(label: string): Promise<CMSState> {
  return request<CMSState>("/api/cms/publish", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ label }),
  });
}

export async function restoreVersion(versionId: string): Promise<CMSState> {
  return request<CMSState>("/api/cms/restore-version", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ versionId }),
  });
}

export async function resetSection(pageId: string, sectionId: string): Promise<CMSState> {
  return request<CMSState>("/api/cms/reset-section", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ pageId, sectionId }),
  });
}

export async function uploadMedia(file: File): Promise<{ url: string; type: string; name: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });

  return request<{ url: string; type: string; name: string }>("/api/media/upload", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      name: file.name,
      mimeType: file.type,
      dataUrl,
    }),
  });
}
