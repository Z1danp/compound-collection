import { useState } from "react";
import { X } from "lucide-react";
import CompoundFormFields from "./CompoundFormFields";

export default function EditCompound({ compound, onClose, onSaveNotes, figure}) {
  const [name, setName] = useState(compound?.name ?? "");
  const [smiles, setSmiles] = useState(compound?.smiles ?? "");
  const [tags, setTags] = useState(compound?.tags || []);
  const [notes, setNotes] = useState(compound?.notes || "");

  if (!compound) return null;

  const handleAddTag = (tag) => {
    setTags((prev) => [...prev, tag]);
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
        className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full md:w-[90vw] md:max-w-5xl max-h-[85vh] overflow-y-auto md:overflow-hidden"
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

        <CompoundFormFields
          name={name}
          onNameChange={setName}
          smiles={smiles}
          onSmilesChange={setSmiles}
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          figure={figure}
        />

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
