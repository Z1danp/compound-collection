import { useState, useRef, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import SmilesDrawer from 'smiles-drawer';

// Cari nama senyawa dari SMILES via PubChem.
// Coba nama trivial/umum (sinonim pertama) dulu, baru jatuh ke nama IUPAC.
async function fetchPubchemName(smiles) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ smiles }),
  };

  // 1. Nama trivial/umum
  const synRes = await fetch(
    'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/synonyms/JSON',
    options
  );
  if (synRes.ok) {
    const data = await synRes.json();
    const synonym = data?.InformationList?.Information?.[0]?.Synonym?.[0];
    if (synonym) return synonym;
  }

  // 2. Jatuh ke nama IUPAC
  const iupacRes = await fetch(
    'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/property/IUPACName/JSON',
    options
  );
  if (iupacRes.ok) {
    const data = await iupacRes.json();
    return data?.PropertyTable?.Properties?.[0]?.IUPACName ?? null;
  }

  return null;
}

function MoleculeFigure({ smiles }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !smiles) return;

    const drawer = new SmilesDrawer.SmiDrawer({ scale: 1 });
    drawer.draw(smiles, svgRef.current, 'light');
    // library memasang width/height px — kembalikan biar tetap responsif
    svgRef.current.style.width = '100%';
    svgRef.current.style.height = 'auto';
  }, [smiles]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        overflow: 'visible',
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
  allTags = [],
}) {
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const suggestionsRef = useRef(null);

  const handleSync = async () => {
    if (!smiles.trim()) return;
    setIsSyncing(true);
    try {
      const name = await fetchPubchemName(smiles.trim());
      if (name) {
        onNameChange(name);
      }
    } catch (err) {
      console.error('Gagal sinkron dari PubChem:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const suggestions = tagInput.trim()
    ? allTags.filter(
        (t) =>
          t.toLowerCase().includes(tagInput.trim().toLowerCase()) &&
          !tags.includes(t)
      )
    : [];

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      onAddTag(tagInput.trim());
      setTagInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (tag) => {
    onAddTag(tag);
    setTagInput('');
    setShowSuggestions(false);
  };

  const hasSuggestions = showSuggestions && suggestions.length > 0;

  useEffect(() => {
    if (hasSuggestions) {
      suggestionsRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [hasSuggestions]);

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
          type="button"
          onClick={handleSync}
          disabled={isSyncing || !smiles.trim()}
          aria-label="Sinkron nama dari PubChem"
          className="shrink-0 rounded-lg border border-slate-200 p-2.5 text-blue-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => smiles.trim() && setIsPreviewExpanded((v) => !v)}
        className={`mb-1.5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 transition-all ${
          isPreviewExpanded ? 'px-10 py-10' : 'px-6 py-4'
        } ${
          smiles.trim()
            ? isPreviewExpanded
              ? 'cursor-zoom-out hover:border-slate-300'
              : 'cursor-zoom-in hover:border-slate-300'
            : 'cursor-default'
        }`}
      >
        {smiles.trim() ? (
          <div className={isPreviewExpanded ? 'w-full' : 'w-40'}>
            <MoleculeFigure smiles={smiles} />
          </div>
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
      </button>
      <p className="mb-4 font-['Plus_Jakarta_Sans'] text-xs text-slate-400">
        {smiles.trim()
          ? isPreviewExpanded
            ? 'Klik struktur untuk perkecil'
            : 'Klik struktur untuk perbesar'
          : 'Preview struktur — mengikuti SMILES di bawah'}
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
      <div className="relative mb-3">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleAddTag}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          placeholder="Tambah tag — tekan Enter"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {hasSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectSuggestion(tag)}
                className="block w-full px-3 py-2 text-left font-['Plus_Jakarta_Sans'] text-sm text-slate-700 hover:bg-slate-50"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

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
