import { useState } from "react";
import { X } from "lucide-react";
import CompoundFormFields from "./CompoundFormFields";

export default function AddCompound({ onClose, onAdd, allTags }) {
  const [name, setName] = useState("");
  const [smiles, setSmiles] = useState("");
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState("");

  const handleAddTag = (tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = () => {
    onAdd({ name, smiles, tags, notes });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full md:w-[78vw] md:max-w-5xl max-h-[85vh] overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CompoundFormFields
          name={name}
          onNameChange={setName}
          smiles={smiles}
          onSmilesChange={setSmiles}
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          allTags={allTags}
        />

        {/* Right panel — notes (optional) + submit. 2/3 width on desktop */}
        <div className="md:w-2/3 p-6 flex flex-col md:overflow-y-auto">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="font-semibold text-slate-900 font-['Space_Grotesk']">
              Tambah senyawa
            </span>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-1.5 shrink-0">
            <span className="text-sm font-semibold text-slate-900 font-['Plus_Jakarta_Sans']">
              Catatan
            </span>
            <span className="text-xs text-slate-400 font-['Plus_Jakarta_Sans']">
              Opsional
            </span>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan tentang senyawa ini..."
            className="flex-1 w-full min-h-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Plus_Jakarta_Sans'] mb-4"
          />

          <div className="flex justify-end shrink-0">
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !smiles.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium rounded-lg px-5 py-2.5 font-['Plus_Jakarta_Sans']"
            >
              Tambah senyawa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
