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

// Shared left panel — used by both AddCompound and EditCompound
export default function CompoundFormFields({
  name,
  onNameChange,
  smiles,
  onSmilesChange,
  tags,
  onAddTag,
  onRemoveTag,
}) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      onAddTag(tagInput.trim());
      setTagInput("");
    }
  };

  return (
    <div className="md:w-1/3 p-6 md:overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Misal: Benzena"
          className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-900 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          aria-label="Regenerate"
          className="border border-slate-200 rounded-lg p-2.5 text-blue-600 hover:bg-slate-50 transition-colors shrink-0"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 py-10 mb-1.5">
        {smiles.trim() ? (
          <MoleculePlaceholder />
        ) : (
          <>
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" />
            </svg>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans']">
              Ketik SMILES untuk lihat struktur
            </p>
          </>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-4 font-['Plus_Jakarta_Sans']">
        Preview struktur — mengikuti SMILES di bawah
      </p>

      <label className="block text-sm font-semibold text-slate-900 mb-1.5 font-['Plus_Jakarta_Sans']">
        SMILES
      </label>
      <textarea
        rows={2}
        value={smiles}
        onChange={(e) => onSmilesChange(e.target.value)}
        placeholder="Misal: c1ccccc1"
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
              onClick={() => onRemoveTag(tag)}
              className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
