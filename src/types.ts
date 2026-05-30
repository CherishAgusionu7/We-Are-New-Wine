export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  series: string;
  videoUrl?: string; // YouTube or simulation
  audioUrl?: string;
  summary: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  category: "all" | "youth" | "men" | "women" | "outreach" | "worship" | "general";
  registrationLink?: string;
}

export interface Devotional {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string; // Support markdown/paragraphs
  category: "Devotional" | "Community Update" | "Pastoral Note";
  imageSeed?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: "pastor" | "leadership" | "committee" | "staff";
  bio: string;
  email: string;
  phone?: string;
  avatarUrl: string;
}

export interface PastServiceGalleryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  email: string;
  request: string;
  isPrivate: boolean; // only visible to leaders
  dateSubmitted: string;
  status: "pending" | "prayed" | "answered";
}

export interface VisitorSignup {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interestAreas: string[];
  message?: string;
  dateSubmitted: string;
}

export interface GeneralConfig {
  churchName: string;
  tagline: string;
  heroImage: string;
  missionStatement: string;
  visionStatement: string;
  statementOfFaith: string;
  storyTitle: string;
  storyContent: string;
  
  // Service logistics
  serviceDay: string;
  serviceTime: string;
  address: string;
  googleMapsEmbedUrl: string;
  
  // Visitor logistics
  whatToExpect: string;
  parkingInfo: string;
  dressCode: string;
  
  // Contact info
  email: string;
  phone: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  
  // Church Goals/Giving tracking
  givingGoalTitle?: string;
  givingGoalAmount?: number;
  givingCurrentAmount?: number;
}

export interface UserCookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface UserNotificationPreferences {
  emailNewsletter: boolean;
  emailSystemUpdates: boolean;
  emailPrayerCircle: boolean;
  pushWeeklyDevos: boolean;
  pushSermonReleases: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  status: "Success" | "Failed";
}

export interface User {
  username: string;
  role: "admin" | "member";
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  profilePic?: string;
  businessCategory?: string;
  cookiePreferences?: UserCookiePreferences;
  notificationPreferences?: UserNotificationPreferences;
  loginHistory?: LoginHistoryEntry[];
}
