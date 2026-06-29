import React, { useState } from "react";
import { Menu, X, Church, ShieldAlert, LogIn, LogOut, Settings, User as UserIcon } from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdminEditMode: boolean;
  setIsAdminEditMode: (mode: boolean) => void;
  onOpenLoginModal: () => void;
  onOpenSettingsModal: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  isAdminEditMode,
  setIsAdminEditMode,
  onOpenLoginModal,
  onOpenSettingsModal,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "visit", label: "Visit" },
    { id: "events", label: "Events" },
    { id: "give", label: "Give" },
    { id: "contact", label: "Connect" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminEditMode(false);
  };

  return (
    <nav id="app-navbar" className="bg-brand-bg border-b border-brand-border sticky top-0 z-40">
      {/* Admin quick warning bar */}
      {isAdminEditMode && (
        <div id="admin-mode-indicator-bar" className="bg-amber-100 border-b border-amber-200 text-stone-800 font-mono px-4 py-2 text-center text-xs flex justify-center items-center gap-2 select-none">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span><strong>Administrator Control</strong> is active. Feel free to modify content inline or reset inputs in the CMS board below.</span>
          <button
            id="btn-quick-disable-edit"
            onClick={() => setIsAdminEditMode(false)}
            className="ml-3 bg-brand-dark text-white hover:bg-black text-[10px] uppercase font-bold tracking-widest py-1 px-3 rounded-none transition-all"
          >
            Turn Off
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            {/* Logo */}
            <button
              id="navbar-logo-btn"
              onClick={() => handleTabClick("home")}
              className="flex items-center gap-3 text-brand-dark group cursor-pointer"
            >
              <div className="text-left w-full">
                <span className="font-serif font-bold tracking-normal text-2xl block uppercase leading-none text-[#E6BC53]" style={{ color: "#E6BC53" }}>
                  New{"\u00a0"}Wine
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#6B6B6B] block mt-1">
                  Youth Gathering
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`nav-link-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`relative py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-brand-sage border-b-2 border-brand-sage pb-1 rounded-none font-extrabold"
                    : "text-[#6B6B6B] hover:text-brand-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Access Control & Admin Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div id="user-menu-logged-in" className="relative">
                <button
                  id="btn-welcome-trigger"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-left bg-brand-beige hover:bg-stone-200/80 border border-brand-border px-4 py-2 transition-all cursor-pointer select-none"
                  title="Click to open user menu"
                >
                  <div className="text-right">
                    <div className="text-xs font-semibold text-brand-dark leading-3 flex items-center gap-1.5">
                      <span>Welcome, {currentUser.firstName || currentUser.username}</span>
                      <span className={`text-[8px] text-[#7A7A7A] transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                    </div>
                    <div className="text-[9px] text-[#7A7A7A] uppercase tracking-wider font-mono text-left leading-none mt-1">
                      {currentUser.role} Account
                    </div>
                  </div>
                </button>

                {isUserDropdownOpen && (
                  <>
                    {/* Backdrop to close the dropdown on outer click */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-border shadow-lg z-50 animate-fade-in flex flex-col font-sans text-left">
                      <div className="px-4 py-2 border-b border-stone-100 bg-brand-bg text-[9px] text-[#8A8A8A] font-mono uppercase tracking-wider">
                        Account Actions
                      </div>
                      
                      <button
                        id="dropdown-item-settings"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onOpenSettingsModal();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-brand-bg hover:text-brand-dark transition-colors cursor-pointer flex items-center gap-2 border-b border-stone-50"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-brand-sage" />
                        <span>ACCOUNT SETTINGS</span>
                      </button>

                      {currentUser.role === "admin" && (
                        <button
                          id="dropdown-item-admin"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsAdminEditMode(!isAdminEditMode);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b border-stone-100 ${
                            isAdminEditMode ? "text-amber-700 bg-amber-50 hover:bg-amber-100" : "text-stone-700 hover:bg-brand-bg"
                          }`}
                        >
                          <Settings className="w-3.5 h-3.5 text-amber-500" />
                          <span>ADMIN EDIT MODE: {isAdminEditMode ? "ON" : "OFF"}</span>
                        </button>
                      )}

                      <button
                        id="dropdown-item-logout"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>LOG OUT</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="btn-login-trigger"
                  onClick={onOpenLoginModal}
                  className="text-xs font-bold uppercase tracking-widest border border-brand-dark px-4 py-2.5 hover:bg-brand-dark hover:text-white transition-colors rounded-none bg-transparent text-brand-dark cursor-pointer font-sans"
                >
                  Member Login
                </button>
                <button
                  id="btn-nav-give-now"
                  onClick={() => handleTabClick("give")}
                  className="text-xs font-bold uppercase tracking-widest bg-brand-sage text-white px-4 py-2.5 hover:bg-brand-sage-dark transition-all rounded-none cursor-pointer font-sans"
                >
                  Give Online
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            {currentUser && currentUser.role === "admin" && (
              <button
                id="btn-mobile-toggle-edit"
                onClick={() => setIsAdminEditMode(!isAdminEditMode)}
                className={`p-2 rounded-full mr-2 transition-all cursor-pointer ${
                  isAdminEditMode ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-50 focus:outline-none transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-sheet" className="lg:hidden border-t border-stone-100 bg-stone-50/98 backdrop-blur-md px-4 pt-2 pb-6 space-y-1 animate-fade-in">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`nav-mobile-link-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`block w-full text-left px-4 py-3 rounded-md text-base font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-[#B2A795] hover:text-[#E6BC53] hover:bg-stone-150"
              }`}
              style={{ color: "#E6BC53" }}
            >
              {tab.label}
            </button>
          ))}

          <div className="pt-4 border-t border-stone-200 mt-4 space-y-3">
            {currentUser ? (
              <div className="px-4 space-y-2">
                <div className="flex justify-between items-center bg-white p-3 rounded-md border border-stone-100">
                  <div>
                    <div className="text-sm font-bold text-stone-800">Welcome {currentUser.firstName || currentUser.username}</div>
                    <div className="text-[11px] text-stone-500 uppercase font-mono">{currentUser.role} Account</div>
                  </div>
                  <button
                    id="btn-mobile-logout"
                    onClick={handleLogout}
                    className="p-1.5 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                <button
                  id="btn-mobile-settings"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSettingsModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#2C2C2C] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-all shadow-sm"
                >
                  <UserIcon className="w-4 h-4 text-brand-sage" />
                  <span>Account Settings</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-mobile-login"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full text-center bg-stone-900 text-white font-semibold py-3 rounded-md shadow-sm text-sm"
              >
                Member / Admin Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
