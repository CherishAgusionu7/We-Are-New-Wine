export type FontTransform = "none" | "uppercase" | "lowercase";

export interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing: number;
  lineHeight: number;
  textAlign: "left" | "center" | "right";
  transform: FontTransform;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface ColorSettings {
  textColor: string;
  backgroundColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  navigationColor: string;
  footerColor: string;
  cardColor: string;
  borderColor: string;
  sectionBackground: string;
  overlayColor: string;
}

export interface ButtonSettings {
  text: string;
  link: string;
  color: string;
  size: "sm" | "md" | "lg";
  borderRadius: number;
  icon?: string;
  visible: boolean;
}

export interface ThemeSettings {
  fonts: TypographySettings;
  colors: ColorSettings;
  heroBannerImage: string;
  backgroundImage: string;
  logo: string;
}

export interface NavItem {
  id: string;
  label: string;
  type: "internal" | "external";
  pageId?: string;
  url?: string;
  visible: boolean;
  children?: NavItem[];
}

export interface SectionStyle {
  typography: Partial<TypographySettings>;
  colors: Partial<ColorSettings>;
  backgroundImage?: string;
  hidden?: boolean;
}

export interface SectionModel {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  content: Record<string, unknown>;
  style: SectionStyle;
}

export interface PageModel {
  id: string;
  title: string;
  slug: string;
  template: "default" | "landing" | "blog" | "events";
  visible: boolean;
  sections: SectionModel[];
}

export interface ContactInformation {
  email: string;
  phone: string;
  address: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface MinistryItem {
  id: string;
  title: string;
  summary: string;
  lead: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: "image" | "logo" | "pdf" | "video";
  url: string;
  uploadedAt: string;
}

export interface SiteContent {
  siteTitle: string;
  menuTitle: string;
  navigation: NavItem[];
  pages: PageModel[];
  theme: ThemeSettings;
  footer: {
    text: string;
    links: NavItem[];
  };
  contact: ContactInformation;
  events: EventItem[];
  ministries: MinistryItem[];
  mediaLibrary: MediaItem[];
}

export interface SiteVersion {
  id: string;
  createdAt: string;
  label: string;
  content: SiteContent;
}

export interface CMSState {
  draft: SiteContent;
  published: SiteContent;
  versions: SiteVersion[];
  updatedAt: string;
}
