import React from "react";
import { Church, Mail, Phone, MapPin, Heart, ArrowUp } from "lucide-react";
import { GeneralConfig } from "../types";

interface FooterProps {
  config: GeneralConfig;
  setActiveTab: (tab: string) => void;
}

export default function Footer({ config, setActiveTab }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="church-footer" className="bg-brand-dark text-[#D5D2C8] border-t border-[#2C2C2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Brand Header */}
        <div className="flex items-center gap-3 text-white mb-10 pb-8 border-b border-[#2C2C2C]/30">
          <div className="text-left">
            <span className="font-serif font-light tracking-tight text-lg block leading-tight text-brand-beige">
              New Wine
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8A8A] block leading-none">
              Youth Gathering
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Column 1: Service Times & Location */}
          <div className="space-y-4 text-left">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage font-bold">
              Gathering Location &amp; Times
            </h3>
            <div className="space-y-3 text-xs font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-brand-sage flex-shrink-0 mt-0.5" />
                <span className="text-[#D5D2C8] leading-snug">
                  {config.address}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Church className="w-4.5 h-4.5 text-brand-sage flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-beige block font-bold text-[10px] uppercase font-mono tracking-wider">
                    {config.serviceDay}
                  </span>
                  <span className="text-[#A6A399] text-[11px] block mt-0.5">
                    {config.serviceTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact & Connections */}
          <div className="space-y-4 text-left">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-sage font-bold">
              Direct Office Contacts
            </h3>
            <div className="space-y-3 text-xs font-light">
              <a
                id="footer-contact-phone"
                href={`tel:${config.phone}`}
                className="flex items-center gap-2.5 text-[#D5D2C8] hover:text-[#FFFFFF] transition-colors"
              >
                <Phone className="w-4.5 h-4.5 text-brand-sage flex-shrink-0" />
                <span>{config.phone}</span>
              </a>
              <a
                id="footer-contact-mail"
                href={`mailto:${config.email}`}
                className="flex items-center gap-2.5 text-[#D5D2C8] hover:text-[#FFFFFF] transition-colors break-all"
              >
                <Mail className="w-4.5 h-4.5 text-brand-sage flex-shrink-0" />
                <span className="text-[11px]">{config.email}</span>
              </a>
            </div>

            {/* Micro Social Badges */}
            <div className="flex items-center gap-3 pt-3 text-[#8A8A8A] border-t border-[#2C2C2C]/30 mt-4">
              <span className="text-[9px] font-mono uppercase tracking-wider block">
                Connect:
              </span>
              <a
                href="https://www.instagram.com/newwine_tribe/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-sage hover:text-white transition-colors text-xs font-medium underline decoration-brand-sage/30 underline-offset-4"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-[#2C2C2C] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#8A8A8A] font-light">
          <div className="flex flex-wrap items-center gap-1.5 leading-snug">
            <span>&copy; {new Date().getFullYear()} {config.churchName}. All rights reserved locally.</span>
            <span className="text-[#3A3A3A] font-mono hidden sm:inline">|</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#A6A399]">
              Made with <Heart className="w-3 h-3 text-brand-sage/60 fill-current animate-pulse" /> for fellowship
            </span>
          </div>

          <button
            id="footer-scroll-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 bg-transparent hover:bg-white/5 text-[#D5D2C8] px-4.5 py-2 rounded-none transition-all cursor-pointer border border-[#8D8D8D]/30 font-mono text-[10px] uppercase tracking-wider"
          >
            <span>Top of Page</span>
            <ArrowUp className="w-3 h-3 text-brand-sage" />
          </button>
        </div>
      </div>
    </footer>
  );
}
