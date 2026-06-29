import React, { useState } from "react";
import {
  Play,
  Pause,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Send,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Coffee,
  Smile,
  Flame,
  Music,
  Globe,
  Compass,
  Heart
} from "lucide-react";
import {
  GeneralConfig,
  ChurchEvent,
  Sermon,
  Devotional,
  StaffMember,
  PastServiceGalleryItem,
  PrayerRequest,
  VisitorSignup
} from "../types";

// ==========================================
// HOME SUB-PAGE
// ==========================================
interface HomeViewProps {
  config: GeneralConfig;
  sermons: Sermon[];
  devotionals: Devotional[];
  events: ChurchEvent[];
  setActiveTab: (tab: string) => void;
  onOpenPlanVisit: () => void;
}

export function HomeView({
  config,
  sermons,
  devotionals,
  events,
  setActiveTab,
  onOpenPlanVisit,
}: HomeViewProps) {
  const latestSermon = sermons[0];
  const latestDevotional = devotionals[0];
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      {/* Geometric Split Hero Structure */}
      <section id="hero-banner-geometric" className="border border-brand-border bg-brand-bg flex flex-col lg:flex-row overflow-hidden min-h-[500px]">
        {/* Left Pane: Title & Intent */}
        <div className="w-full lg:w-[60%] p-8 sm:p-12 md:p-16 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-brand-border overflow-hidden bg-brand-bg">
          {/* Decorative floating watermark text */}
          <div className="absolute top-6 left-6 text-[130px] font-serif font-black text-[#F4F1EA] -z-0 select-none leading-none opacity-80 select-none">
            NW
          </div>
          <div className="relative z-10 space-y-6 text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/20 px-3.5 py-1.5 inline-block font-mono">
              Every Other Sunday at {config.serviceTime}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.1] text-brand-dark">
              Cultivating a <br />
              <span className="italic font-serif text-brand-sage font-normal">spirit-filled</span> <br />
              community.
            </h1>
            <p className="text-sm sm:text-base text-[#5A5A5A] max-w-md leading-relaxed font-light">
              A community where young hearts find home, grow in faith, and discover their God-given purpose together. &quot;{config.tagline}&quot;
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-btn-plan-visit"
                onClick={onOpenPlanVisit}
                className="px-8 py-4 bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-none shadow-none transition-all cursor-pointer block"
              >
                Plan Your Visit
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Practical Info & Service Times (Cream Beige Pane) */}
        <div className="w-full lg:w-[40%] bg-brand-beige flex flex-col justify-center p-8 sm:p-12 relative">
          <div className="space-y-8 text-left z-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sage mb-2">Gathering Details</h3>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#8A8A8A] mb-1">When we meet</p>
              <p className="text-xl sm:text-2xl font-times text-brand-dark leading-tight">Every Other Sunday at {config.serviceTime || "4:00PM"}</p>
            </div>

            <div className="pt-2 border-t border-[#E5E2DA]">
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#8A8A8A] mb-1 font-sans">Our Sanctuary</p>
              <p className="text-xl font-times text-brand-dark leading-snug">{config.address}</p>
              <button
                onClick={() => setActiveTab("visit")}
                className="inline-block text-xs font-bold uppercase tracking-wider text-brand-sage underline underline-offset-4 mt-2 bg-transparent border-0 cursor-pointer p-0"
              >
                Get Directions &amp; Access Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Central Statement Highlight Banner */}
      <section id="section-home-mission-geometric" className="border border-brand-border p-8 sm:p-12 bg-brand-bg text-left">
        <div className="max-w-4xl space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-brand-beige text-brand-sage border border-brand-border px-3 py-1 font-bold inline-block">
            Our Core Kingdom Vision
          </span>
          <h2 className="font-serif font-light text-3xl text-brand-dark tracking-tight">
            Awakening Hearts, <span className="italic font-serif text-brand-sage">Raising</span> Disciples
          </h2>
          <p className="text-sm text-[#5A5A5A] font-sans leading-relaxed">
            Our mission is to awaken a generation to Christ by proclaiming the Gospel, reviving the Holy Spirit within believers, and raising passionate young people who live by God’s Word. Through prayer, worship in spirit and truth, and bold service, we seek to impact the world and honor God wholeheartedly.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2 text-[#6B6B6B] font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-sage" /> Raising a Generation
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-sage" /> Spirit Led
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-sage" /> Christ Proclaimed
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Pillars Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 border border-brand-border divide-y md:divide-y-0 md:divide-x divide-brand-border bg-white">
        {/* Pillar 2: Weekly Devotional */}
        <div className="p-8 hover:bg-brand-beige transition-colors duration-300 flex flex-col justify-between text-left group">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#9A9A9A] font-bold">
                02 — Reflection
              </span>
              <span className="text-[10px] text-[#8A8A8A] font-mono">{latestDevotional?.date}</span>
            </div>
            <h3 className="font-serif text-xl text-[#E6BC53]">
              Weekly Devotional
            </h3>
            <p className="text-[10px] text-brand-sage font-mono uppercase tracking-wider font-semibold">
              ✍🏼 BY {latestDevotional?.author}
            </p>
            <p className="text-xs text-[#5A5A5A] leading-relaxed line-clamp-3 italic">
              &quot;{latestDevotional?.content}&quot;
            </p>
          </div>
          <button
            onClick={() => setActiveTab("about")}
            className="text-[#E6BC53] text-xs font-bold uppercase tracking-wider hover:text-brand-sage transition-all flex items-center gap-1 mt-6 cursor-pointer bg-transparent border-0 p-0"
          >
            Read Faith Story &rarr;
          </button>
        </div>

        {/* Pillar 3: Calendar Schedule */}
        <div className="p-8 hover:bg-brand-beige transition-colors duration-300 flex flex-col justify-between text-left group">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#9A9A9A] font-bold">
                03 — Communion
              </span>
              <span className="text-[10px] text-[#8A8A8A] font-mono">{upcomingEvents.length} Active</span>
            </div>
            <h3 className="font-serif text-xl text-[#E6BC53]">
              Upcoming Assemblies
            </h3>
            <div className="space-y-3 pt-1">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="text-xs border-b border-[#E5E2DA] pb-1.5 last:border-0 last:pb-0">
                  <div className="font-bold text-[#E6BC53] truncate">{evt.title}</div>
                  <div className="text-[10px] text-[#7A7A7A] font-mono">{evt.date} at {evt.time}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab("events")}
            className="text-[#E6BC53] text-xs font-bold uppercase tracking-wider hover:text-brand-sage transition-all flex items-center gap-1 mt-6 cursor-pointer bg-transparent border-0 p-0"
          >
            Full Calendar List &rarr;
          </button>
        </div>
      </section>

    </div>
  );
}

// ===========================// ==========================================
// ABOUT SUB-PAGE
// ==========================================
interface AboutViewProps {
  config: GeneralConfig;
  staff: StaffMember[];
  gallery: PastServiceGalleryItem[];
}

export function AboutView({ config, staff, gallery }: AboutViewProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "pastor" | "leadership" | "committee" | "staff">("all");

  const filteredStaff = staff.filter((s) => activeCategory === "all" || s.category === activeCategory);

  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      {/* Intro section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
        <div className="space-y-6">
          <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1 font-bold">
            Who We Represent
          </span>
          <h1 className="font-serif font-light text-4xl sm:text-5xl leading-tight text-brand-dark">
            {config.storyTitle}
          </h1>
          <p className="text-[#5A5A5A] text-sm leading-relaxed font-sans whitespace-pre-wrap font-light">
            {config.storyContent}
          </p>
        </div>

        {/* Statement of Faith container (Cream balance block) */}
        <div className="bg-brand-beige border border-brand-border rounded-none p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-brand-dark">Our Core Creed</h3>
            <p className="text-[10px] text-brand-sage font-mono tracking-[0.20em] uppercase font-bold">Statement of Biblical Faith</p>
          </div>
          <p className="text-[#5A5A5A] text-xs font-sans italic leading-relaxed whitespace-pre-wrap border-l-2 border-brand-sage pl-4">
            &quot;{config.statementOfFaith}&quot;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E5E2DA]">
            <div>
              <span className="block text-[9px] text-[#8A8A8A] font-mono uppercase tracking-widest font-bold">Mission Statement</span>
              <p className="text-brand-dark text-xs leading-relaxed font-sans mt-1 font-light">{config.missionStatement}</p>
            </div>
            <div>
              <span className="block text-[9px] text-[#8A8A8A] font-mono uppercase tracking-widest font-bold">Apostolic Vision</span>
              <p className="text-brand-dark text-xs leading-relaxed font-sans mt-1 font-light">{config.visionStatement}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile Registry */}
      <section className="space-y-8">
        <div className="text-left space-y-3 max-w-2xl">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/20 px-3 py-1.5 inline-block font-bold">
            Pastors &amp; Elders Team
          </span>
          <h2 className="font-serif font-light text-3xl tracking-tight text-brand-dark">
            Our Ministry Fellowship Board
          </h2>
          <p className="text-xs text-[#7A7A7A] font-sans font-light leading-relaxed">
            Our congregation is guided by a servant leadership board committed to extreme physical transparency, spiritual stewardship, and discipleship.
          </p>

          {/* Filtering Badges (Geometric flat lines) */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "all", label: "All Servants" },
              { id: "pastor", label: "Pastors" },
              { id: "leadership", label: "Elders Board" },
              { id: "committee", label: "Committees" },
              { id: "staff", label: "Support Staff" },
            ].map((cat) => (
              <button
                key={cat.id}
                id={`btn-staff-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`text-[10px] font-bold px-4 py-2 font-mono uppercase tracking-widest transition-all cursor-pointer rounded-none border ${
                  activeCategory === cat.id
                    ? "bg-brand-sage text-white border-brand-sage"
                    : "bg-white text-[#5A5A5A] border-brand-border hover:bg-brand-beige"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid with sharp layouts and no rounded-xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              id={`card-staff-${member.id}`}
              className="bg-white border border-brand-border rounded-none p-6 hover:border-brand-sage transition-all space-y-4 text-left"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-none object-cover border border-[#E5E2DA] flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-serif font-semibold text-lg leading-tight text-brand-dark">{member.name}</h3>
                  <p className="font-mono text-[9px] text-brand-sage font-bold uppercase mt-1 tracking-wider">{member.role}</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5 select-all">{member.email}</p>
                </div>
              </div>
              <p className="text-[#5A5A5A] text-xs leading-relaxed font-sans pt-3 border-t border-[#F4F1EA] font-light">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery of Past Services */}
      <section className="space-y-8 text-left">
        <div className="space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/20 px-3 py-1.5 inline-block font-bold">
            Past Services &amp; Drives
          </span>
          <h2 className="font-serif font-light text-3xl text-brand-dark tracking-tight">Gathering Photo Gallery</h2>
          <p className="text-xs text-[#7A7A7A] max-w-xl font-light">
            A visual overview of past Sunday services, community volunteer events, and neighborhood outreach outings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="bg-white border border-brand-border rounded-none overflow-hidden group transition-all flex flex-col h-full hover:border-[#7C8363]"
            >
              <div className="relative aspect-video overflow-hidden bg-brand-beige">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 right-2 bg-brand-dark/90 text-brand-beige font-mono text-[9px] px-2 py-0.5 rounded-none font-medium">
                  {item.date}
                </span>
              </div>
              <div className="p-4 space-y-1.5 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-brand-dark tracking-tight leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[#6B6B6B] text-[11px] leading-relaxed mt-1 font-sans font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// VISIT SUB-PAGE (LOGISTICS)
// ==========================================
interface VisitViewProps {
  config: GeneralConfig;
  onOpenPlanVisit: () => void;
}

export function VisitView({ config, onOpenPlanVisit }: VisitViewProps) {
  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        {/* Logistics column */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1.5 font-bold">
            Visit &amp; Fellowship
          </span>
          <h1 className="font-serif font-light text-3xl sm:text-4xl tracking-tight text-brand-dark leading-snug">
            What Can I Expect on Sundays?
          </h1>

          <p className="text-[#5A5A5A] text-sm leading-relaxed font-sans font-light">
            {config.whatToExpect}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="bg-brand-bg border border-brand-border rounded-none p-6 space-y-2">
              <div className="flex items-center gap-2.5 text-brand-dark font-serif font-semibold text-sm">
                <Coffee className="w-4 h-4 text-brand-sage" /> Parking Instructions
              </div>
              <p className="text-[#6B6B6B] text-xs font-sans leading-relaxed font-light">
                {config.parkingInfo}
              </p>
            </div>

            <div className="bg-brand-bg border border-brand-border rounded-none p-6 space-y-2">
              <div className="flex items-center gap-2.5 text-brand-dark font-serif font-semibold text-sm">
                <Smile className="w-4 h-4 text-brand-sage" /> Dress Code Note
              </div>
              <p className="text-[#6B6B6B] text-xs font-sans leading-relaxed font-light">
                {config.dressCode}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="visit-btn-plan"
              onClick={onOpenPlanVisit}
              className="bg-brand-dark hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-none transition-all cursor-pointer border border-brand-dark"
            >
              Exhort Visitor Planning Form
            </button>
          </div>
        </div>

        {/* Map column */}
        <div className="lg:col-span-5 bg-[#FDFCFB]/50 border border-brand-border rounded-none p-6 space-y-4">
          <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-sage font-bold">
            Interactive Direction Finder
          </span>
          <div className="aspect-square bg-brand-beige rounded-none overflow-hidden border border-brand-border relative">
            <iframe
              src={config.googleMapsEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="New Wine Church location"
            />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="font-serif font-semibold text-brand-dark flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-sage flex-shrink-0" />
              <span>{config.address}</span>
            </div>
            <div className="text-[#8A8A8A] font-mono text-[10px] pl-6 select-all">
              GPS Coordinates: 32.9126 N, -96.6389 W
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// SERMONS SUB-PAGE
// ==========================================
interface SermonsViewProps {
  sermons: Sermon[];
}

export function SermonsView({ sermons }: SermonsViewProps) {
  const [activeSermonId, setActiveSermonId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayToggle = (serm: Sermon) => {
    // If clicking a new sermon
    if (activeSermonId !== serm.id) {
      if (activeAudioElement) {
        activeAudioElement.pause();
      }
      const audio = new Audio(serm.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      audio.play();
      setActiveSermonId(serm.id);
      setIsPlaying(true);
      setActiveAudioElement(audio);

      audio.addEventListener("timeupdate", () => {
        setPlaybackProgress((audio.currentTime / audio.duration) * 100 || 0);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
      });
    } else {
      // Toggling same sermon
      if (isPlaying) {
        activeAudioElement?.pause();
        setIsPlaying(false);
      } else {
        activeAudioElement?.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      <section className="space-y-4 text-left">
        <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1.5 font-bold">
          Sermons Archive
        </span>
        <h1 className="font-serif font-light text-4xl text-brand-dark leading-tight">
          Listen to God&apos;s Weekly Word
        </h1>
        <p className="text-[#5A5A5A] max-w-xl text-xs font-sans leading-relaxed font-light">
          Stream audio messages, read theological summaries, or trace scripture references from Sunday mornings at New Wine. Filter past series.
        </p>
      </section>

      {/* Embedded Player Widget (if playing) */}
      {activeSermonId && (
        <section id="audio-sermon-player-widget" className="bg-brand-dark text-white rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-none animate-slide-up select-none border border-brand-border text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/14 border border-white/20 rounded-none flex items-center justify-center text-brand-sage">
              <Music className="w-5 h-5 animate-pulse text-brand-sage" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-brand-sage block font-bold">Streaming Sabbath Teachings</span>
              <span className="text-sm font-serif font-medium block truncate max-w-md text-brand-beige">
                {sermons.find((s) => s.id === activeSermonId)?.title}
              </span>
              <span className="text-[10px] text-[#A1A1A1] font-mono block">
                {sermons.find((s) => s.id === activeSermonId)?.speaker}
              </span>
            </div>
          </div>

          <div className="flex-grow max-w-lg w-full px-2 space-y-2">
            <div className="w-full bg-[#2A2A2A] h-1.5 rounded-none overflow-hidden">
              <div className="bg-brand-sage h-full rounded-none transition-all duration-300" style={{ width: `${playbackProgress || 0}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#8C8C8C]">
              <span>Live Streaming Channel</span>
              <span>Audio Media Feed</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (activeAudioElement) {
                  if (isPlaying) {
                    activeAudioElement.pause();
                    setIsPlaying(false);
                  } else {
                    activeAudioElement.play();
                    setIsPlaying(true);
                  }
                }
              }}
              className="bg-brand-sage hover:bg-brand-sage/80 text-white p-3 rounded-none transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current text-white" /> : <Play className="w-4 h-4 fill-current text-white" />}
            </button>
            <button
              onClick={() => {
                if (activeAudioElement) {
                  activeAudioElement.pause();
                }
                setActiveSermonId(null);
                setIsPlaying(false);
                setPlaybackProgress(0);
              }}
              className="text-[#A1A1A1] hover:text-white font-mono text-[10px] font-semibold uppercase py-1.5 px-3 bg-transparent border-0 cursor-pointer"
            >
              Close
            </button>
          </div>
        </section>
      )}

      {/* Sermons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.map((serm) => (
          <div
            key={serm.id}
            id={`card-sermon-${serm.id}`}
            className="bg-white border border-brand-border rounded-none p-6 hover:border-brand-sage transition-all flex flex-col justify-between text-left"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="font-bold text-brand-sage bg-brand-sage/10 border border-brand-sage/20 px-2.5 py-1 rounded-none uppercase">
                  {serm.series}
                </span>
                <span className="text-[#8A8A8A] font-mono">{serm.date}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-semibold text-lg tracking-tight text-brand-dark leading-snug">
                  {serm.title}
                </h3>
                <div className="text-[10px] font-mono font-medium text-[#7C8363]">
                  🎙️ {serm.speaker} &bull; 📖 Scripture: {serm.scripture}
                </div>
              </div>

              <p className="text-[#5A5A5A] text-xs leading-relaxed font-sans line-clamp-4 pt-1 font-light">
                {serm.summary}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-[#F4F1EA] mt-6">
              <button
                id={`btn-play-sermon-${serm.id}`}
                onClick={() => handlePlayToggle(serm)}
                className="bg-brand-dark hover:bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-none flex items-center gap-1.5 transition-all cursor-pointer border border-brand-dark"
              >
                {activeSermonId === serm.id && isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-brand-sage fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-white/90 fill-current" /> Stream Audio
                  </>
                )}
              </button>
              {serm.videoUrl && (
                <a
                  href={serm.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8A8A8A] hover:text-brand-sage font-mono text-[10px] uppercase font-semibold py-2.5 border-b border-[#E5E2DA] hover:border-brand-sage transition-all block"
                >
                  Watch Sermon
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// EVENTS CALENDAR SUB-PAGE
// ==========================================
interface EventsViewProps {
  events: ChurchEvent[];
}

export function EventsView({ events }: EventsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const filteredEvents = events.filter((e) => selectedCategory === "all" || e.category === selectedCategory);

  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      <section className="space-y-4 text-left">
        <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1.5 font-bold">
          Gatherings Schedule
        </span>
        <h1 className="font-serif font-light text-4xl text-brand-dark leading-tight">
          Events Calendar
        </h1>
        <p className="text-[#5A5A5A] max-w-xl text-xs font-sans leading-relaxed font-light">
          See where and when our fellowship groups, worship nights, outreach and seasonal cookouts take place. Filter by category directory.
        </p>

        {/* Category filtering (Geometric style) */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: "all", label: "All Assemblies" },
            { id: "general", label: "General" },
            { id: "youth", label: "Youth Ministry" },
            { id: "worship", label: "Worship" },
            { id: "men", label: "Men's Ministry" },
            { id: "women", label: "Women's Circle" },
            { id: "outreach", label: "Local Outreach" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[10px] font-bold px-4 py-2 font-mono uppercase tracking-widest transition-all cursor-pointer rounded-none border ${
                selectedCategory === cat.id
                  ? "bg-brand-sage text-white border-brand-sage"
                  : "bg-white text-[#5A5A5A] border-brand-border hover:bg-brand-beige"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events listing */}
      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#8A8A8A] bg-brand-beige rounded-none border border-brand-border italic">
            No assemblies scheduled in this directory. Switch filter categories above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                id={`card-event-${evt.id}`}
                className="bg-white border border-brand-border rounded-none p-6 hover:border-brand-sage transition-all flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 bg-brand-sage/10 border border-brand-sage/20 text-brand-sage rounded-none">
                      {evt.category}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-brand-sage">
                      {evt.date}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif font-semibold text-lg text-brand-dark tracking-tight leading-tight">
                      {evt.title}
                    </h3>
                    <div className="text-[10px] text-[#7C8363] font-mono">
                      📅 At {evt.time} &bull; 📍 {evt.location}
                    </div>
                  </div>

                  <p className="text-[#5A5A5A] text-xs font-sans leading-relaxed font-light">
                    {evt.description}
                  </p>
                </div>

                {evt.registrationLink && (
                  <div className="pt-4 border-t border-[#F4F1EA] mt-6">
                    <button
                      onClick={() => alert(`Thank you! You are now registered for: ${evt.title}`)}
                      className="w-full text-center bg-brand-dark hover:bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider py-3 rounded-none transition-colors cursor-pointer border border-brand-dark"
                    >
                      Verify Attendance Registration Link
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// GIVE SUB-PAGE (ONLINE STEWARDSHIP)
// ==========================================
interface GiveViewProps {
  config: GeneralConfig;
  setGivingAmount: (amount: number) => void;
}

export function GiveView({ config, setGivingAmount }: GiveViewProps) {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [receiptLog, setReceiptLog] = useState<string | null>(null);

  const handleSimulateDonation = (amountToDonate: number) => {
    if (!amountToDonate || amountToDonate <= 0) return;
    setGivingAmount(config.givingCurrentAmount + amountToDonate);
    setReceiptLog(`Simulated Transaction Approved!\nValue: $${amountToDonate.toLocaleString()}\nMethod: ${selectedMethod.toUpperCase()}\nAllocated Target: ${config.givingGoalTitle}\nThank you for supporting the New Wine community!`);
    setCustomAmount("");
  };

  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        {/* Info panel */}
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1.5 font-bold">
            Support Vineyard Work
          </span>
          <h1 className="font-serif font-light text-4xl text-brand-dark leading-tight">
            Online Giving &amp; Stewardship
          </h1>

          <p className="text-[#5A5A5A] text-sm font-sans leading-relaxed font-light">
            We believe that generosity is a vital part of our discipleship. Giving to New Wine supplies groceries for neighborhood shelters, fuels youth community drives, and grows safe nurseries for families. We do not require collection buckets, but provide secure online giving portals for those who wish to support our ministries.
          </p>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-6 bg-white border border-brand-border rounded-none p-8 space-y-6 text-left">
          <h3 className="font-serif font-semibold text-lg text-brand-dark block border-b border-[#F4F1EA] pb-3">
            Secure Donation Desk
          </h3>

          <div className="space-y-4">
            {/* Amount Selection buttons */}
            <div>
              <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-2 font-mono">Preset Offerings</label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 50, 150, 500].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleSimulateDonation(val)}
                    className="bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-mono text-xs font-bold py-2.5 rounded-none transition-all cursor-pointer border border-[#E5E2DA]"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Custom offering amount ($)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="e.g. 75"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-brand-bg rounded-none border border-brand-border focus:outline-none focus:border-brand-sage"
                  id="donate-custom-input"
                />
                <button
                  id="btn-donate-custom-submit"
                  onClick={() => handleSimulateDonation(Number(customAmount))}
                  className="bg-brand-dark hover:bg-black text-white font-mono text-[11px] font-bold uppercase tracking-widest px-4 rounded-none transition-all cursor-pointer flex-shrink-0 border border-brand-dark"
                >
                  Give Offering
                </button>
              </div>
            </div>

            {/* Method Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-2 font-mono">Payment Provider</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-left">
                {[
                  { id: "stripe", label: "Stripe Link Card" },
                  { id: "paypal", label: "PayPal Express" },
                  { id: "tithely", label: "Tithe.ly Network" },
                ].map((meth) => (
                  <button
                    key={meth.id}
                    onClick={() => setSelectedMethod(meth.id)}
                    className={`p-2.5 rounded-none font-bold uppercase tracking-wider transition-all text-center border cursor-pointer ${
                      selectedMethod === meth.id
                        ? "bg-brand-sage text-white border-brand-sage"
                        : "bg-brand-bg border-brand-border text-[#5A5A5A] hover:bg-brand-beige"
                    }`}
                  >
                    {meth.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Receipt logs */}
            {receiptLog && (
              <div className="bg-[#7C8363]/10 text-[#3D4030] rounded-none p-4 font-mono text-[11px] border border-[#7C8363]/20 whitespace-pre-wrap select-text animate-fade-in text-left">
                {receiptLog}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// CONTACT & CONNECT SUB-PAGE
// ==========================================
interface ContactViewProps {
  config: GeneralConfig;
  onSubmitPrayer: (req: Partial<PrayerRequest>) => void;
  onSubmitSignup: (visit: Partial<VisitorSignup>) => void;
}

export function ContactView({ config, onSubmitPrayer, onSubmitSignup }: ContactViewProps) {
  // Prayer form
  const [prayerName, setPrayerName] = useState<string>("");
  const [prayerEmail, setPrayerEmail] = useState<string>("");
  const [prayerText, setPrayerText] = useState<string>("");
  const [prayerConfidential, setPrayerConfidential] = useState<boolean>(false);
  const [prayerSuccess, setPrayerSuccess] = useState<boolean>(false);

  // Connection form
  const [visitorName, setVisitorName] = useState<string>("");
  const [visitorEmail, setVisitorEmail] = useState<string>("");
  const [visitorPhone, setVisitorPhone] = useState<string>("");
  const [visitorNotes, setVisitorNotes] = useState<string>("");
  const [visitorInterests, setVisitorInterests] = useState<string[]>([]);
  const [visitorSuccess, setVisitorSuccess] = useState<boolean>(false);

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerName || !prayerText) return;
    onSubmitPrayer({
      name: prayerName,
      email: prayerEmail || "anonymous@newwine.org",
      request: prayerText,
      isPrivate: prayerConfidential
    });
    setPrayerSuccess(true);
    setPrayerName("");
    setPrayerEmail("");
    setPrayerText("");
    setPrayerConfidential(false);
    setTimeout(() => setPrayerSuccess(false), 5000);
  };

  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail) return;
    onSubmitSignup({
      name: visitorName,
      email: visitorEmail,
      phone: visitorPhone,
      interestAreas: visitorInterests,
      message: visitorNotes
    });
    setVisitorSuccess(true);
    setVisitorName("");
    setVisitorEmail("");
    setVisitorPhone("");
    setVisitorNotes("");
    setVisitorInterests([]);
    setTimeout(() => setVisitorSuccess(false), 5000);
  };

  const handleInterestToggle = (area: string) => {
    if (visitorInterests.includes(area)) {
      setVisitorInterests(visitorInterests.filter((a) => a !== area));
    } else {
      setVisitorInterests([...visitorInterests, area]);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in text-brand-dark">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Get Connected visitors module */}
        <div className="bg-white border border-brand-border rounded-none p-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1.5 font-bold">
              First - Time Visitor Log
            </span>
            <h2 id="title-connect-form" className="font-serif font-light text-2xl tracking-tight leading-snug text-[#E6BC53]">
              Get Connected to the Community
            </h2>
            <p className="text-xs text-[#5A5A5A] font-sans leading-relaxed font-light">
              New to New Wine? Fill out our visitor card so we can welcome you, answer questions about children&apos;s youth hubs, or invite you to local group dinners.
            </p>
          </div>

          <form onSubmit={handleVisitorSubmit} id="visitor-log-card-form" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
              <div>
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Cooper"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans"
                  id="connect-input-name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rachel@mail.com"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans"
                  id="connect-input-email"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="(555) 492-4958"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans"
                  id="connect-input-phone"
                />
              </div>
            </div>

            {/* Interest Area Checkboxes */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Ministry Interests</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: "youth", label: "Youth Ministry" },
                  { id: "worship", label: "Worship Team" },
                  { id: "outreach", label: "Outreach & Drives" },
                  { id: "homegroups", label: "Weekly Home Groups" },
                  { id: "general", label: "Just General Contact" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInterestToggle(item.id)}
                    className={`p-2.5 rounded-none border text-left transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer ${
                      visitorInterests.includes(item.id)
                        ? "bg-brand-sage border-brand-sage text-white"
                        : "bg-brand-bg border-[#E5E2DA] text-[#5A5A5A] hover:bg-brand-beige"
                    }`}
                  >
                    {visitorInterests.includes(item.id) ? "✓" : "+"} {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono font-mono">Special Questions / Help Requested</label>
              <textarea
                placeholder="Where should I park? How do I get involved?..."
                rows={2}
                value={visitorNotes}
                onChange={(e) => setVisitorNotes(e.target.value)}
                className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans font-light"
                id="connect-textarea-msg"
              />
            </div>

            {visitorSuccess && (
              <div className="bg-[#7C8363]/10 text-[#3D4030] rounded-none p-4 font-mono text-[11px] border border-[#7C8363]/20 whitespace-pre-wrap select-text animate-fade-in">
                ✨ Connection Submitted! A host from our admissions desk will welcome you at connect@newwine.org shortly. See you Sunday morning!
              </div>
            )}

            <button
              id="connect-btn-submit"
              type="submit"
              className="w-full bg-brand-dark hover:bg-black text-white font-mono text-[11px] font-bold uppercase tracking-widest py-4 border border-brand-dark rounded-none cursor-pointer transition-all"
            >
              Submit Connection Card
            </button>
          </form>
        </div>

        {/* Secure Prayer Form Column */}
        <div className="bg-white border border-brand-border rounded-none p-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage bg-brand-sage/10 border border-brand-sage/25 px-3 py-1.5 font-bold">
              Confidential Intercession
            </span>
            <h2 id="title-prayer-form" className="font-serif font-light text-2xl tracking-tight leading-snug text-[#E6BC53]">
              Secure Prayer Request Form
            </h2>
            <p className="text-xs text-[#5A5A5A] font-sans leading-relaxed font-light">
              We believe in a God who hears, heals, and works wonders. Your requests are delivered directly to the New Wine intercessory board.
            </p>
          </div>

          <form onSubmit={handlePrayerSubmit} id="prayer-request-submission-form" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
              <div>
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas"
                  value={prayerName}
                  onChange={(e) => setPrayerName(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans"
                  id="prayer-input-name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Your Contact Email</label>
                <input
                  type="email"
                  placeholder="e.g. optional@mail.com"
                  value={prayerEmail}
                  onChange={(e) => setPrayerEmail(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans"
                  id="prayer-input-email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5 font-mono">Need Intercessory Support? *</label>
              <textarea
                required
                placeholder="Share your physical healing requests, spiritual burdens, family guidance, or praise reports..."
                rows={4}
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark focus:outline-none focus:border-brand-sage transition-all font-sans font-light leading-relaxed font-sans font-light leading-relaxed"
                id="prayer-textarea-body"
              />
            </div>

            {/* Privacy toggle */}
            <div className="flex items-start gap-2.5 text-xs text-left pt-2 font-light select-none">
              <input
                type="checkbox"
                id="checkbox-prayer-confidentiality"
                checked={prayerConfidential}
                onChange={(e) => setPrayerConfidential(e.target.checked)}
                className="mt-1 cursor-pointer accent-brand-sage text-brand-sage rounded-none"
              />
              <label htmlFor="checkbox-prayer-confidentiality" className="text-[#5A5A5A] cursor-pointer text-[11px] leading-snug">
                <strong className="text-[#E6BC53]">Confidential Request:</strong> Only share this prayer request with Pastoral team members (Keep hidden from public lists).
              </label>
            </div>

            {prayerSuccess && (
              <div className="bg-[#7C8363]/10 text-[#3D4030] rounded-none p-4 font-mono text-[11px] border border-[#7C8363]/20 whitespace-pre-wrap select-text animate-fade-in">
                ✓ Prayer Submitted. Your request has been securely enqueued to our leaders. We are praying with you!
              </div>
            )}

            <button
              id="prayer-btn-submit"
              type="submit"
              className="w-full bg-brand-dark hover:bg-black text-white font-mono text-[11px] font-bold uppercase tracking-widest py-4 border border-brand-dark rounded-none cursor-pointer transition-all animate-fade-in"
            >
              Submit Intercession Request
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
