import { useState, useRef, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import SmilesDrawer from 'smiles-drawer';

// Placeholder molecule icon — swap with SmilesDrawer render later
function MoleculePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-24 w-24 text-slate-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" />
    </svg>
  );
}

function MoleculeFigure({ smiles }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef || !smiles) return;

    const drawer = new SmilesDrawer.SmiDrawer({ width: 550, height: 450 });
    drawer.draw(smiles, svgRef.current, 'light');
  }, [smiles]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        overflow: 'visible'
      }}
    />
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
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      onAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  return (
    <div className="border-b border-slate-200 p-6 md:w-1/2 md:overflow-y-auto md:border-r md:border-b-0">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Misal: Benzena"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 font-['Space_Grotesk'] font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          aria-label="Regenerate"
          className="shrink-0 rounded-lg border border-slate-200 p-2.5 text-blue-600 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-1.5 flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 py-10 px-10">
        {smiles.trim() ? (
          <MoleculeFigure smiles={smiles} />
        ) : (
          <>
            <svg
              viewBox="0 0 100 100"
              className="h-10 w-10 text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" />
            </svg>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-slate-400">
              Ketik SMILES untuk lihat struktur
            </p>
          </>
        )}
      </div>
      <p className="mb-4 font-['Plus_Jakarta_Sans'] text-xs text-slate-400">
        Preview struktur — mengikuti SMILES di bawah
      </p>

      <label className="mb-1.5 block font-['Plus_Jakarta_Sans'] text-sm font-semibold text-slate-900">
        SMILES
      </label>
      <textarea
        rows={2}
        value={smiles}
        onChange={(e) => onSmilesChange(e.target.value)}
        placeholder="Misal: c1ccccc1"
        className="mb-4 w-full min-w-0 resize-none rounded-lg border border-blue-500 px-3 py-2 font-mono text-sm break-all text-slate-700 ring-2 ring-blue-100 focus:outline-none"
      />

      <label className="mb-1.5 block font-['Plus_Jakarta_Sans'] text-sm font-semibold text-slate-900">
        Tag
      </label>
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Tambah tag — tekan Enter"
        className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1.5 pr-2 pl-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-slate-700"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="rounded-full p-0.5 transition-colors hover:bg-slate-200"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
