import { useState } from "react";
import { RefreshCw, X } from "lucide-react";

// Placeholder molecule icon — swap with SmilesDrawer render later
function MoleculePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-24 h-24 text-slate-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" />
    </svg>
  );
}

export default function EditCompound({ compound, onClose, onSaveNotes }) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(compound.tags || []);
  const [notes, setNotes] = useState(compound.notes || "");

  if (!compound) return null;

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleClose = () => {
    // Auto-save notes on close (dummy — logs instead of calling an API)
    onSaveNotes?.(compound.id, notes);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full md:w-[78vw] md:max-w-5xl max-h-[85vh] overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile-only header — hidden on desktop, X lives in the notes panel instead */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 shrink-0">
          <button
            onClick={handleClose}
            aria-label="Tutup"
            className="text-slate-700 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-900 font-['Space_Grotesk']">
            Edit senyawa
          </span>
        </div>

        {/* Left panel — compound form. 1/3 width on desktop */}
        <div className="md:w-1/3 p-6 md:overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              defaultValue={compound.name}
              className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-900 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              aria-label="Regenerate"
              className="border border-slate-200 rounded-lg p-2 text-blue-600 hover:bg-slate-50 transition-colors shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl flex items-center justify-center py-10 mb-1.5">
            <MoleculePlaceholder />
          </div>
          <p className="text-xs text-slate-400 mb-4 font-['Plus_Jakarta_Sans']">
            Preview struktur — mengikuti SMILES di bawah
          </p>

          <label className="block text-sm font-semibold text-slate-900 mb-1.5 font-['Plus_Jakarta_Sans']">
            SMILES
          </label>
          <textarea
            rows={2}
            defaultValue={compound.smiles}
            className="w-full min-w-0 border border-blue-500 ring-2 ring-blue-100 rounded-lg px-3 py-2 font-mono text-sm text-slate-700 mb-4 resize-none break-all focus:outline-none"
          />

          <label className="block text-sm font-semibold text-slate-900 mb-1.5 font-['Plus_Jakarta_Sans']">
            Tag
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Tambah tag — tekan Enter"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Plus_Jakarta_Sans']"
          />

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full pl-3 pr-2 py-1.5 font-['Plus_Jakarta_Sans']"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right panel — notes. 2/3 width on desktop */}
        <div className="md:w-2/3 p-6 flex flex-col md:overflow-y-auto">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900 font-['Space_Grotesk']">
                Catatan
              </span>
              <span className="text-xs text-slate-400 font-['Plus_Jakarta_Sans']">
                · 2 menit lalu
              </span>
            </div>
            {/* Desktop-only close button — mobile uses the header X instead */}
            <button
              onClick={handleClose}
              aria-label="Tutup"
              className="hidden md:block text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan..."
            className="flex-1 w-full min-h-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Plus_Jakarta_Sans']"
          />
        </div>
      </div>
    </div>
  );
}