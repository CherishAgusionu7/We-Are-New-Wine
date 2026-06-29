import { CMSState, SiteContent, SectionModel } from "./types";

const now = () => new Date().toISOString();

const makeSection = (id: string, name: string, type: string, content: Record<string, unknown>): SectionModel => ({
  id,
  name,
  type,
  visible: true,
  content,
  style: {
    typography: {},
    colors: {},
  },
});

export const defaultContent: SiteContent = {
  siteTitle: "New Wine",
  menuTitle: "Youth Gathering",
  theme: {
    fonts: {
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
    },
    colors: {
      textColor: "#f5f0e6",
      backgroundColor: "#0c0c0b",
      buttonColor: "#d9b24c",
      buttonHoverColor: "#be9637",
      navigationColor: "#161410",
      footerColor: "#11100d",
      cardColor: "#1b1914",
      borderColor: "#2f2b21",
      sectionBackground: "#14120e",
      overlayColor: "rgba(0,0,0,0.3)",
    },
    heroBannerImage: "",
    backgroundImage: "",
    logo: "",
  },
  navigation: [
    { id: "nav-home", label: "Home", type: "internal", pageId: "page-home", visible: true },
    { id: "nav-about", label: "About", type: "internal", pageId: "page-about", visible: true },
    { id: "nav-events", label: "Events", type: "internal", pageId: "page-events", visible: true },
    { id: "nav-contact", label: "Contact", type: "internal", pageId: "page-contact", visible: true },
  ],
  pages: [
    {
      id: "page-home",
      title: "Home",
      slug: "home",
      template: "landing",
      visible: true,
      sections: [
        makeSection("sec-hero", "Hero Banner", "hero", {
          eyebrow: "Every Other Sunday at 4:00PM",
          title: "Cultivating a spirit-filled community",
          subtitle: "A community where young hearts find home and purpose together.",
          button: {
            text: "Plan Your Visit",
            link: "#contact",
            color: "#d9b24c",
            size: "md",
            borderRadius: 0,
            icon: "",
            visible: true,
          },
        }),
        makeSection("sec-mission", "Mission", "text", {
          title: "Our Mission",
          body: "We awaken a generation to Christ by proclaiming the Gospel and raising disciples who live by God's Word.",
        }),
        makeSection("sec-home-events", "Upcoming Events", "events", {
          title: "Upcoming Gatherings",
          useGlobalEvents: true,
        }),
        makeSection("sec-home-ministries", "Ministries", "ministries", {
          title: "Ministry Highlights",
          useGlobalMinistries: true,
        }),
      ],
    },
    {
      id: "page-about",
      title: "About",
      slug: "about",
      template: "default",
      visible: true,
      sections: [
        makeSection("sec-about-story", "Our Story", "text", {
          title: "Our Story",
          body: "New Wine began as a humble prayer gathering and grew into a movement centered on discipleship and worship.",
        }),
      ],
    },
    {
      id: "page-events",
      title: "Events",
      slug: "events",
      template: "events",
      visible: true,
      sections: [
        makeSection("sec-events-list", "Events Listing", "events", {
          title: "Church Events",
          useGlobalEvents: true,
        }),
      ],
    },
    {
      id: "page-contact",
      title: "Contact",
      slug: "contact",
      template: "default",
      visible: true,
      sections: [
        makeSection("sec-contact", "Contact Information", "contact", {
          title: "Connect With Us",
          body: "Reach out and we will follow up shortly.",
        }),
      ],
    },
  ],
  contact: {
    email: "connect@newwinegathering.org",
    phone: "(682) 412-5519",
    address: "13509 Lyndon B Johnson Fwy, Garland, TX 75041",
  },
  events: [
    {
      id: "evt-1",
      title: "Encounter Worship Night",
      date: "2026-06-14",
      location: "Main Sanctuary",
      description: "An immersive night of worship and prayer.",
    },
    {
      id: "evt-2",
      title: "Youth Summer Launch",
      date: "2026-06-19",
      location: "Youth Warehouse",
      description: "A welcoming night for youth and families.",
    },
  ],
  ministries: [
    {
      id: "min-1",
      title: "Youth Ministry",
      summary: "Discipleship and mentorship for students.",
      lead: "Pastor Sarah Jenkins",
    },
    {
      id: "min-2",
      title: "Outreach Team",
      summary: "Serving neighborhoods through practical support.",
      lead: "Elizabeth Vance",
    },
  ],
  mediaLibrary: [],
  footer: {
    text: "New Wine Youth Gathering. All rights reserved.",
    links: [
      { id: "foot-home", label: "Home", type: "internal", pageId: "page-home", visible: true },
      { id: "foot-contact", label: "Contact", type: "internal", pageId: "page-contact", visible: true },
    ],
  },
};

export const defaultCMSState: CMSState = {
  draft: structuredClone(defaultContent),
  published: structuredClone(defaultContent),
  versions: [
    {
      id: "ver-initial",
      createdAt: now(),
      label: "Initial version",
      content: structuredClone(defaultContent),
    },
  ],
  updatedAt: now(),
};
