import { useState } from "react";
import { Search, Plus, LogOut, X } from "lucide-react";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-slate-200">
      {/* Main row — always visible */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Logo + Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm font-['Space_Grotesk']">
              R
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-slate-900 text-base font-['Space_Grotesk']">
            Renik Notes
          </span>
        </div>

        {/* Search bar — full width on sm+, icon-only toggle below sm */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama, SMILES, atau tag..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none font-['Plus_Jakarta_Sans']"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search icon toggle — mobile only */}
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label={isSearchOpen ? "Tutup pencarian" : "Buka pencarian"}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isSearchOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>

          {/* Tambah senyawa — icon-only below sm */}
          <button
            aria-label="Tambah senyawa"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 transition-colors text-white text-sm font-medium rounded-full px-3 sm:px-4 py-2 font-['Plus_Jakarta_Sans']"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Tambah senyawa</span>
          </button>

          {/* Logout — icon-only below sm */}
          <button
            aria-label="Logout"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium rounded-full px-3 sm:px-4 py-2 font-['Plus_Jakarta_Sans']"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Second row — search input, mobile only, shown when toggled open */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Cari nama, SMILES, atau tag..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none font-['Plus_Jakarta_Sans']"
            />
          </div>
        </div>
      )}
    </nav>
  );
}