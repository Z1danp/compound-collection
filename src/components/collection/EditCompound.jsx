import { useState } from 'react';
import { X } from 'lucide-react';
import CompoundFormFields from './CompoundFormFields';

export default function EditCompound({
  compound,
  onClose,
  onSaveNotes,
  figure,
}) {
  const [name, setName] = useState(compound?.name ?? '');
  const [smiles, setSmiles] = useState(compound?.smiles ?? '');
  const [tags, setTags] = useState(compound?.tags || []);
  const [notes, setNotes] = useState(compound?.notes || '');

  if (!compound) return null;

  const handleAddTag = (tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleRemoveTag = async (tagToRemove) => {
    try {
      const req = await fetch('http://localhost:3000/api/compounds/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          compound: compound,
          tag: tagToRemove,
        }),
      });
      const saved = await req.json();
    } catch (err) {
      console.error(err);
    }
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleClose = () => {
    // Auto-save notes on close (dummy — logs instead of calling an API)
    onSaveNotes?.(name, smiles, tags, notes, compound.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-2xl bg-white shadow-xl md:w-[90vw] md:max-w-5xl md:flex-row md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile-only header — hidden on desktop, X lives in the notes panel instead */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3 md:hidden">
          <button
            onClick={handleClose}
            aria-label="Tutup"
            className="text-slate-700 transition-colors hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="font-['Space_Grotesk'] font-semibold text-slate-900">
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
        />

        {/* Right panel — notes. 2/3 width on desktop */}
        <div className="flex flex-col p-6 md:w-2/3 md:overflow-y-auto">
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] font-semibold text-slate-900">
                Catatan
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-slate-400">
                · 2 menit lalu
              </span>
            </div>
            {/* Desktop-only close button — mobile uses the header X instead */}
            <button
              onClick={handleClose}
              aria-label="Tutup"
              className="hidden text-slate-400 transition-colors hover:text-slate-700 md:block"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan..."
            className="min-h-50 w-full flex-1 resize-none rounded-xl border border-slate-200 p-4 font-['Plus_Jakarta_Sans'] text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
