import React, { useState } from "react";
import {
  Settings,
  Calendar,
  BookOpen,
  Volume2,
  Users,
  Inbox,
  Contact,
  Plus,
  Trash2,
  Edit3,
  HeartHandshake,
  Check,
  FileCheck,
  HelpCircle
} from "lucide-react";
import {
  GeneralConfig,
  ChurchEvent,
  Sermon,
  Devotional,
  StaffMember,
  PrayerRequest,
  VisitorSignup
} from "../types";

interface CMSDashboardProps {
  config: GeneralConfig;
  setConfig: (config: GeneralConfig) => void;
  events: ChurchEvent[];
  setEvents: (events: ChurchEvent[]) => void;
  sermons: Sermon[];
  setSermons: (sermons: Sermon[]) => void;
  devotionals: Devotional[];
  setDevotionals: (devotionals: Devotional[]) => void;
  staff: StaffMember[];
  setStaff: (staff: StaffMember[]) => void;
  prayerRequests: PrayerRequest[];
  setPrayerRequests: (requests: PrayerRequest[]) => void;
  visitorSignups: VisitorSignup[];
  setVisitorSignups: (signups: VisitorSignup[]) => void;
}

export default function CMSDashboard({
  config,
  setConfig,
  events,
  setEvents,
  sermons,
  setSermons,
  devotionals,
  setDevotionals,
  staff,
  setStaff,
  prayerRequests,
  setPrayerRequests,
  visitorSignups,
  setVisitorSignups,
}: CMSDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"general" | "events" | "sermons" | "devotionals" | "staff" | "prayers" | "visitors">("general");

  // Form states - Quick additions
  const [newEvent, setNewEvent] = useState<Partial<ChurchEvent>>({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "general"
  });

  const [newSermon, setNewSermon] = useState<Partial<Sermon>>({
    title: "",
    speaker: "",
    date: "",
    scripture: "",
    series: "",
    summary: "",
    audioUrl: ""
  });

  const [newDevotional, setNewDevotional] = useState<Partial<Devotional>>({
    title: "",
    author: "",
    category: "Devotional",
    content: ""
  });

  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    role: "",
    category: "leadership",
    bio: "",
    email: "",
    avatarUrl: ""
  });

  // Event handlers
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "givingGoalAmount" || name === "givingCurrentAmount") {
      setConfig({ ...config, [name]: Number(value) || 0 });
    } else {
      setConfig({ ...config, [name]: value });
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    const added: ChurchEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title || "Untitled Gathering",
      date: newEvent.date || "",
      time: newEvent.time || "TBD",
      location: newEvent.location || "TBD",
      description: newEvent.description || "No description provided.",
      category: (newEvent.category as any) || "general",
      registrationLink: newEvent.registrationLink
    };
    setEvents([added, ...events]);
    setNewEvent({ title: "", date: "", time: "", location: "", description: "", category: "general" });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleAddSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSermon.title || !newSermon.speaker) return;
    const added: Sermon = {
      id: `serm-${Date.now()}`,
      title: newSermon.title || "Untitled Sermon",
      speaker: newSermon.speaker || "Guest Speaker",
      date: newSermon.date || new Date().toISOString().split("T")[0],
      scripture: newSermon.scripture || "Various",
      series: newSermon.series || "Stand-Alone Message",
      summary: newSermon.summary || "",
      audioUrl: newSermon.audioUrl || "",
      videoUrl: newSermon.videoUrl || ""
    };
    setSermons([added, ...sermons]);
    setNewSermon({ title: "", speaker: "", date: "", scripture: "", series: "", summary: "", audioUrl: "", videoUrl: "" });
  };

  const handleDeleteSermon = (id: string) => {
    setSermons(sermons.filter((s) => s.id !== id));
  };

  const handleAddDevotional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevotional.title || !newDevotional.content) return;
    const added: Devotional = {
      id: `dev-${Date.now()}`,
      title: newDevotional.title || "Untitled Devotional",
      author: newDevotional.author || "New Wine Leadership",
      date: new Date().toISOString().split("T")[0],
      content: newDevotional.content || "",
      category: (newDevotional.category as any) || "Devotional",
      imageSeed: "faith"
    };
    setDevotionals([added, ...devotionals]);
    setNewDevotional({ title: "", author: "", category: "Devotional", content: "" });
  };

  const handleDeleteDevotional = (id: string) => {
    setDevotionals(devotionals.filter((d) => d.id !== id));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role) return;
    const added: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name || "",
      role: newStaff.role || "",
      category: (newStaff.category as any) || "leadership",
      bio: newStaff.bio || "No biography details shared yet.",
      email: newStaff.email || "wearenewwinetribe@outlook.com",
      avatarUrl: newStaff.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=3&w=256&h=256&q=80"
    };
    setStaff([...staff, added]);
    setNewStaff({ name: "", role: "", category: "leadership", bio: "", email: "", avatarUrl: "" });
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const handleUpdatePrayerStatus = (id: string, newStatus: "prayed" | "answered") => {
    setPrayerRequests(
      prayerRequests.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const handleDeletePrayer = (id: string) => {
    setPrayerRequests(prayerRequests.filter((p) => p.id !== id));
  };

  const handleDeleteSignup = (id: string) => {
    setVisitorSignups(visitorSignups.filter((s) => s.id !== id));
  };

  // Prepopulate standard fields easily
  return (
    <div id="cms-dashboard-root" className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="bg-stone-900 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-sans font-bold text-base leading-tight">New Wine Content Management System</h2>
            <p className="text-[10px] text-stone-400 font-mono">Centralized Sandbox Database Override &amp; Logs</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono">
          Local Storage Synchronized
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
        {/* Navigation panel */}
        <div className="bg-stone-50 border-r border-stone-100 p-4 lg:col-span-1 space-y-1">
          <h3 className="font-sans text-[10px] text-stone-400 font-bold uppercase tracking-wider px-3 mb-2">
            Models
          </h3>
          {[
            { id: "general", label: "Church Config", icon: Settings },
            { id: "events", label: "Gathering Events", icon: Calendar, badge: events.length },
            { id: "sermons", label: "Sermons Media", icon: Volume2, badge: sermons.length },
            { id: "devotionals", label: "Devotionals / Updates", icon: BookOpen, badge: devotionals.length },
            { id: "staff", label: "Leadership Directory", icon: Users, badge: staff.length },
            { id: "prayers", label: "Prayer Requests Inbox", icon: Inbox, badge: prayerRequests.length, highlight: true },
            { id: "visitors", label: "Visitor Connections", icon: Contact, badge: visitorSignups.length, highlight: true },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                id={`cms-tabbtn-${item.id}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white shadow-xs"
                    : `${item.highlight ? "text-stone-700 font-medium" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-stone-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                      isActive ? "bg-stone-800 text-amber-200" : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic configuration layout area */}
        <div id="cms-fields-panel" className="p-6 lg:col-span-4 max-h-[650px] overflow-y-auto">
          {/* General Config Editor */}
          {activeSubTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight">General Gathering Configuration</h3>
                <p className="text-xs text-stone-500">Edit the foundational mission, vision, location hours, and donation target info displayed across the platform.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Gathering Name</label>
                  <input
                    type="text"
                    name="churchName"
                    id="input-config-churchName"
                    value={config.churchName}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    id="input-config-tagline"
                    value={config.tagline}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Mission Statement</label>
                  <textarea
                    name="missionStatement"
                    id="textarea-config-mission"
                    rows={2}
                    value={config.missionStatement}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Vision Statement</label>
                  <textarea
                    name="visionStatement"
                    id="textarea-config-vision"
                    rows={2}
                    value={config.visionStatement}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Statement of Faith</label>
                  <textarea
                    name="statementOfFaith"
                    id="textarea-config-faith"
                    rows={3}
                    value={config.statementOfFaith}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Primary Days (e.g., Every Sunday)</label>
                  <input
                    type="text"
                    name="serviceDay"
                    id="input-config-serviceDay"
                    value={config.serviceDay}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Service Hours</label>
                  <input
                    type="text"
                    name="serviceTime"
                    id="input-config-serviceTime"
                    value={config.serviceTime}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Physical Gathering Address</label>
                  <input
                    type="text"
                    name="address"
                    id="input-config-address"
                    value={config.address}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Giving Goal Objective</label>
                  <input
                    type="text"
                    name="givingGoalTitle"
                    id="input-config-givingGoalTitle"
                    value={config.givingGoalTitle}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Target ($)</label>
                    <input
                      type="number"
                      name="givingGoalAmount"
                      id="input-config-givingGoalAmount"
                      value={config.givingGoalAmount}
                      onChange={handleConfigChange}
                      className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950 hover:border-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Current ($)</label>
                    <input
                      type="number"
                      name="givingCurrentAmount"
                      id="input-config-givingCurrentAmount"
                      value={config.givingCurrentAmount}
                      onChange={handleConfigChange}
                      className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950 hover:border-stone-400"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-stone-800 uppercase mt-2 pb-1 border-b border-stone-100">Visits &amp; Guest Logistics Details</h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">What To Expect description</label>
                  <textarea
                    name="whatToExpect"
                    id="textarea-config-expect"
                    rows={3}
                    value={config.whatToExpect}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Parking Logistics</label>
                  <input
                    type="text"
                    name="parkingInfo"
                    id="input-config-parking"
                    value={config.parkingInfo}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Dress Code Note</label>
                  <input
                    type="text"
                    name="dressCode"
                    id="input-config-dressCode"
                    value={config.dressCode}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    id="input-config-email"
                    value={config.email}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    id="input-config-phone"
                    value={config.phone}
                    onChange={handleConfigChange}
                    className="w-full text-xs p-2.5 rounded border border-stone-200 focus:outline-stone-950"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Events Manager */}
          {activeSubTab === "events" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight">Church Events Schedule</h3>
                  <p className="text-xs text-stone-500">Add or strike events from the active calendar.</p>
                </div>
              </div>

              {/* Add event form */}
              <form onSubmit={handleAddEvent} id="form-cms-add-event" className="bg-stone-50 border border-stone-150 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Register New Gathering Event
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Worship Night"
                      value={newEvent.title || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Category *</label>
                    <select
                      value={newEvent.category || "general"}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    >
                      <option value="general">General</option>
                      <option value="youth">Youth</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="worship">Worship</option>
                      <option value="outreach">Outreach</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Date *</label>
                    <input
                      type="date"
                      required
                      value={newEvent.date || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 7:00 PM"
                      value={newEvent.time || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. East Lawn / Main Hall"
                      value={newEvent.location || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Brief Details</label>
                    <textarea
                      placeholder="Enter event details, registration expectations..."
                      rows={2}
                      value={newEvent.description || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                </div>
                <button
                  id="btn-cms-submit-event"
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save New Event
                </button>
              </form>

              {/* Live Events Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase">Currently Listed Schedule ({events.length})</h4>
                <div className="border border-stone-100 rounded-lg overflow-hidden divide-y divide-stone-100">
                  {events.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400">No scheduled events found. Add one above!</div>
                  ) : (
                    events.map((evt) => (
                      <div key={evt.id} className="p-3.5 flex items-center justify-between text-xs bg-white hover:bg-stone-50 transition-colors">
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-2">
                            <span>{evt.title}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-stone-100 border border-stone-200 rounded text-stone-600 font-mono capitalize">
                              {evt.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            📅 {evt.date} at {evt.time} | 📍 {evt.location}
                          </div>
                          <p className="text-stone-600 mt-1 max-w-xl text-[11px] line-clamp-1">{evt.description}</p>
                        </div>
                        <button
                          id={`btn-cms-delete-event-${evt.id}`}
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1 px-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-100 hover:border-red-100 rounded text-[10px] uppercase font-bold flex items-center gap-1 transition-all"
                          title="Strike/Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sermon Manager */}
          {activeSubTab === "sermons" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight">Sermon Library Index</h3>
                <p className="text-xs text-stone-500">Provide community-wide access to recorded Sunday sermons, speaker scriptures, and summaries.</p>
              </div>

              {/* Add sermon form */}
              <form onSubmit={handleAddSermon} id="form-cms-add-sermon" className="bg-stone-50 border border-stone-150 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Register Audio/Video Sermon
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Message Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Restoring the Vineyard"
                      value={newSermon.title || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Sermon Series</label>
                    <input
                      type="text"
                      placeholder="e.g. Abiding in Grace"
                      value={newSermon.series || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, series: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Lead Proclaimer/Speaker *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor David Miller"
                      value={newSermon.speaker || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, speaker: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Delivery Date</label>
                    <input
                      type="date"
                      value={newSermon.date || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, date: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Scripture Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. Colossians 3:1-4"
                      value={newSermon.scripture || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, scripture: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Audio MP3 Streaming URL (Leave default mock, or host live link)</label>
                    <input
                      type="text"
                      placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                      value={newSermon.audioUrl || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, audioUrl: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Message Summary / Brief Theological Overview</label>
                    <textarea
                      placeholder="Brief overview summarizing key takeaways..."
                      rows={2}
                      value={newSermon.summary || ""}
                      onChange={(e) => setNewSermon({ ...newSermon, summary: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                </div>
                <button
                  id="btn-cms-submit-sermon"
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save New Sermon
                </button>
              </form>

              {/* List of Sermons */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase">Indexed Sermons ({sermons.length})</h4>
                <div className="border border-stone-100 rounded-lg overflow-hidden divide-y divide-stone-100">
                  {sermons.map((serm) => (
                    <div key={serm.id} className="p-3.5 flex items-center justify-between text-xs bg-white hover:bg-stone-50 transition-colors">
                      <div>
                        <div className="font-bold text-stone-900">{serm.title}</div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          🎙️ Proclaimer: {serm.speaker} | 📖 Scripture: {serm.scripture} | 📂 Series: {serm.series} | 📅 {serm.date}
                        </div>
                      </div>
                      <button
                        id={`btn-cms-delete-sermon-${serm.id}`}
                        onClick={() => handleDeleteSermon(serm.id)}
                        className="p-1 px-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-100 hover:border-red-100 rounded text-[10px] uppercase font-bold flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Devotionals Blog Manager */}
          {activeSubTab === "devotionals" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight">Weekly Devotionals &amp; Community Updates</h3>
                <p className="text-xs text-stone-500">Draft spiritual devotionals or share key operational announcements instantly.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleAddDevotional} id="form-cms-add-devotional" className="bg-stone-50 border border-stone-150 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Compose Devotional / Post
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Post Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Finding Peace in Unquiet Seasons"
                      value={newDevotional.title || ""}
                      onChange={(e) => setNewDevotional({ ...newDevotional, title: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Author/Contributor *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor Sarah Jenkins"
                      value={newDevotional.author || ""}
                      onChange={(e) => setNewDevotional({ ...newDevotional, author: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Category Tipo *</label>
                    <select
                      value={newDevotional.category || "Devotional"}
                      onChange={(e) => setNewDevotional({ ...newDevotional, category: e.target.value as any })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    >
                      <option value="Devotional">Spiritual Devotional</option>
                      <option value="Community Update">Community Update</option>
                      <option value="Pastoral Note">Pastoral Note</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Main Content Markdown / Body *</label>
                    <textarea
                      required
                      placeholder="Express the spiritual message, paragraphs, announcements..."
                      rows={4}
                      value={newDevotional.content || ""}
                      onChange={(e) => setNewDevotional({ ...newDevotional, content: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950 font-sans"
                    />
                  </div>
                </div>
                <button
                  id="btn-cms-submit-devotional"
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Weekly Post
                </button>
              </form>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase">Active Published Devotionals ({devotionals.length})</h4>
                <div className="border border-stone-100 rounded-lg overflow-hidden divide-y divide-stone-100">
                  {devotionals.map((dev) => (
                    <div key={dev.id} className="p-3.5 flex items-center justify-between text-xs bg-white hover:bg-stone-50 transition-colors">
                      <div>
                        <div className="font-bold text-stone-900 flex items-center gap-2">
                          <span>{dev.title}</span>
                          <span className="text-[9px] px-2 py-0.2 bg-amber-50 text-amber-800 rounded font-bold font-mono">
                            {dev.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          ✍️ by {dev.author} | Published 📅 {dev.date}
                        </div>
                      </div>
                      <button
                        id={`btn-cms-delete-devotional-${dev.id}`}
                        onClick={() => handleDeleteDevotional(dev.id)}
                        className="p-1 px-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-100 hover:border-red-100 rounded text-[10px] uppercase font-bold flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Leaders & Elders Staff Directory Manager */}
          {activeSubTab === "staff" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight">Leadership &amp; Committee Directory</h3>
                <p className="text-xs text-stone-500">Add, reassign, or alter names, roles, and profiles of elders, pastors, and volunteers.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleAddStaff} id="form-cms-add-staff" className="bg-stone-50 border border-stone-150 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Appoint Leader or Staff
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elder Thomas Cooper"
                      value={newStaff.name || ""}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Church Title / Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Deaconess Committee head"
                      value={newStaff.role || ""}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Account Level Category *</label>
                    <select
                      value={newStaff.category || "leadership"}
                      onChange={(e) => setNewStaff({ ...newStaff, category: e.target.value as any })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    >
                      <option value="pastor">Primary Pastor/Minister</option>
                      <option value="leadership">Elders Leadership Board</option>
                      <option value="committee">Admissions/Finance Committee</option>
                      <option value="staff">Church Support Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Office Email Address</label>
                    <input
                      type="email"
                      placeholder="cooper@newwinegathering.org"
                      value={newStaff.email || ""}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Avatar Image URL (Optional, fallback provided)</label>
                    <input
                      type="text"
                      placeholder="Paste Unsplash face area URL or use placeholder"
                      value={newStaff.avatarUrl || ""}
                      onChange={(e) => setNewStaff({ ...newStaff, avatarUrl: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950 text-stone-500 font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Biography bio (Who are they and what lights them up?)</label>
                    <textarea
                      placeholder="Eldership journey, favorite scriptures, hobbies..."
                      rows={2}
                      value={newStaff.bio || ""}
                      onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
                      className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-stone-950"
                    />
                  </div>
                </div>
                <button
                  id="btn-cms-submit-staff"
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Registered Member
                </button>
              </form>

              {/* Staff Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase">Currently Registered Leaders ({staff.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {staff.map((s) => (
                    <div key={s.id} className="p-3 bg-white border border-stone-150 rounded-lg flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={s.avatarUrl}
                          alt={s.name}
                          className="w-10 h-10 rounded-full object-cover bg-stone-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-stone-900 truncate">{s.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">{s.role}</div>
                          <span className="inline-block text-[8px] tracking-wide font-mono uppercase text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                            {s.category}
                          </span>
                        </div>
                      </div>
                      <button
                        id={`btn-cms-delete-staff-${s.id}`}
                        onClick={() => handleDeleteStaff(s.id)}
                        className="p-1 px-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-100 hover:border-red-100 rounded text-[9px] uppercase font-bold flex-shrink-0 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Secure Prayer Request Inbox */}
          {activeSubTab === "prayers" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-stone-105">
                <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-amber-500" />
                  <span>Secure Prayer Request Inbox (Admins Only)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  These requests are dispatched directly to church elders. Read their request logs, click praying verification badges, or update their statuses.
                </p>
              </div>

              {prayerRequests.length === 0 ? (
                <div className="p-12 text-center text-stone-400 bg-stone-50 rounded-lg border border-stone-100 font-sans text-xs">
                  No prayer requests submitted yet. Use the Contact &amp; Connect tab forms to submit new requests.
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 uppercase">Received Prayer Intercessions ({prayerRequests.length})</h4>
                  <div className="space-y-3">
                    {prayerRequests.map((req) => (
                      <div
                        key={req.id}
                        className={`p-4 rounded-xl border transition-all ${
                          req.status === "answered"
                            ? "bg-emerald-50/50 border-emerald-150 text-emerald-950"
                            : req.status === "prayed"
                            ? "bg-indigo-50/40 border-indigo-150 text-indigo-950"
                            : "bg-white border-stone-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2.5 border-b border-stone-100/60 text-xs">
                          <div>
                            <span className="font-bold text-stone-900">{req.name}</span>
                            <span className="text-stone-400 mx-2 font-mono">/</span>
                            <span className="text-stone-500 font-mono text-[10px] font-medium">{req.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight font-mono ${
                                req.isPrivate
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : "bg-stone-100 text-stone-600 border border-stone-200"
                              }`}
                            >
                              {req.isPrivate ? "🔒 Confidential (Staff Only)" : "🔓 Shared with Intercessory Team"}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono italic">{req.dateSubmitted}</span>
                          </div>
                        </div>

                        <p className="py-3 text-stone-700 font-sans text-xs whitespace-pre-wrap leading-relaxed">
                          &quot;{req.request}&quot;
                        </p>

                        <div className="flex justify-between items-center pt-2.5 border-t border-stone-100/60 text-xs">
                          {/* Current Status Badge */}
                          <div className="flex items-center gap-1 font-mono text-[10px]">
                            <span className="text-stone-400 font-semibold uppercase">Status:</span>
                            <span
                              className={`font-bold uppercase ${
                                req.status === "answered"
                                  ? "text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded"
                                  : req.status === "prayed"
                                  ? "text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded"
                                  : "text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>

                          {/* Quick Admin Actions */}
                          <div className="flex items-center gap-2">
                            {req.status !== "prayed" && req.status !== "answered" && (
                              <button
                                id={`btn-cms-mark-prayed-${req.id}`}
                                onClick={() => handleUpdatePrayerStatus(req.id, "prayed")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Mark Prayed For
                              </button>
                            )}
                            {req.status !== "answered" && (
                              <button
                                id={`btn-cms-mark-answered-${req.id}`}
                                onClick={() => handleUpdatePrayerStatus(req.id, "answered")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <FileCheck className="w-3.5 h-3.5" /> Mark Answered!
                              </button>
                            )}
                            <button
                              id={`btn-cms-delete-prayer-${req.id}`}
                              onClick={() => handleDeletePrayer(req.id)}
                              className="text-stone-400 hover:text-red-500 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                              title="Delete request copy"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visitor Connection Signups Intake */}
          {activeSubTab === "visitors" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h3 className="font-sans font-bold text-lg text-stone-900 tracking-tight flex items-center gap-2">
                  <Contact className="w-5 h-5 text-amber-500" />
                  <span>Visitor Connect Intakes Log</span>
                </h3>
                <p className="text-xs text-stone-500">
                  New visitor signups submitted via the &quot;Get Connected&quot; forms. Staff should reach out to them within 24 hours.
                </p>
              </div>

              {visitorSignups.length === 0 ? (
                <div className="p-12 text-center text-stone-400 bg-stone-50 rounded-lg border border-stone-100 text-xs">
                  No visitors have registered with our intake desk yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 uppercase">Incoming Connections ({visitorSignups.length})</h4>
                  <div className="space-y-3">
                    {visitorSignups.map((sub) => (
                      <div key={sub.id} className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs pb-2 border-b border-stone-200 gap-1.5">
                          <div>
                            <span className="font-bold text-stone-900 text-sm">{sub.name}</span>
                            <span className="text-stone-400 mx-2">|</span>
                            <span className="text-stone-600 font-semibold">{sub.email}</span>
                            {sub.phone && (
                              <>
                                <span className="text-stone-300 mx-2">/</span>
                                <span className="text-stone-500 font-mono text-[10px]">{sub.phone}</span>
                              </>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono tracking-tight">{sub.dateSubmitted}</span>
                        </div>

                        <div className="py-2.5 text-xs text-stone-700">
                          <span className="block font-bold text-stone-800 uppercase text-[9px] tracking-wider mb-1">Interest Directories:</span>
                          <div className="flex flex-wrap gap-1">
                            {sub.interestAreas.length === 0 ? (
                              <span className="text-stone-400 italic text-[10px]">None chosen</span>
                            ) : (
                              sub.interestAreas.map((area) => (
                                <span key={area} className="text-[9px] tracking-tight bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold capitalize">
                                  {area}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {sub.message && (
                          <div className="pt-2 border-t border-stone-100 text-xs">
                            <span className="block font-bold text-stone-800 uppercase text-[9px] tracking-wider mb-0.5">Note/Query:</span>
                            <p className="text-stone-600 bg-white p-2 rounded border border-stone-100 italic">
                              &quot;{sub.message}&quot;
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            id={`btn-cms-delete-signup-${sub.id}`}
                            onClick={() => handleDeleteSignup(sub.id)}
                            className="text-stone-400 hover:text-red-500 hover:bg-stone-100 p-1 rounded-sm text-xs border border-stone-200/40 hover:border-red-150 transition-colors uppercase font-bold text-[9px] px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Archive Log
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
