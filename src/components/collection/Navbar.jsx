import { useState } from 'react';
import { Search, Plus, LogOut, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Navbar({ onAddClick, searchQuery, onSearchChange }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white">
      {/* Main row — always visible */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo + Wordmark */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <span className="font-['Space_Grotesk'] text-sm font-bold text-white">
              R
            </span>
          </div>
          <span className="hidden font-['Space_Grotesk'] text-base font-semibold text-slate-900 sm:inline">
            Renik Notes
          </span>
        </div>

        {/* Search bar — full width on sm+, icon-only toggle below sm */}
        <div className="hidden max-w-xl flex-1 sm:block">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, SMILES, atau tag..."
              className="w-full bg-transparent font-['Plus_Jakarta_Sans'] text-sm text-slate-600 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search icon toggle — mobile only */}
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label={isSearchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 sm:hidden"
          >
            {isSearchOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>

          {/* Tambah senyawa — icon-only below sm */}
          <button
            onClick={onAddClick}
            aria-label="Tambah senyawa"
            className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm font-medium text-white transition-colors hover:bg-amber-600 sm:px-4"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Tambah senyawa</span>
          </button>

          {/* Logout — icon-only below sm */}
          <button
            aria-label="Logout"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:px-4"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Second row — search input, mobile only, shown when toggled open */}
      {isSearchOpen && (
        <div className="px-4 pb-3 sm:hidden">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, SMILES, atau tag..."
              className="w-full bg-transparent font-['Plus_Jakarta_Sans'] text-sm text-slate-600 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
