import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, X, Check } from "lucide-react";

// Dummy data — replace with real tag counts from API later
const DUMMY_TAGS = [
  { id: "aromatic", label: "Aromatic", count: 4 },
  { id: "alkane", label: "Alkane", count: 1 },
  { id: "protein", label: "Protein", count: 0 },
  { id: "amine", label: "Amine", count: 1 },
];

function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

function TagFilterDropdown({ selectedTags, onToggleTag }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Filter tag"
        className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:shadow-md hover:border-slate-300 transition-colors font-['Plus_Jakarta_Sans']"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filter tag</span>
        <ChevronDown className="hidden sm:inline w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-20">
          {DUMMY_TAGS.map((tag) => {
            const checked = selectedTags.includes(tag.id);
            return (
              <label
                key={tag.id}
                className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      checked
                        ? "bg-amber-500 border-amber-500"
                        : "border-slate-300"
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() => onToggleTag(tag.id)}
                  />
                  <span className="text-sm text-slate-700 font-medium font-['Plus_Jakarta_Sans']">
                    {tag.label}
                  </span>
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  {tag.count}
                </span>
              </label>
            );
          })}
          <div className="border-t border-slate-100 mt-1 pt-2 px-3">
            <button className="text-sm text-blue-600 hover:underline font-medium font-['Plus_Jakarta_Sans']">
              Kelola tag...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const [selectedTags, setSelectedTags] = useState(["aromatic"]);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const removeTag = (tagId) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  return (
    <div className="sticky top-15 z-20 w-full bg-slate-50 flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
      <div className="flex flex-wrap items-center gap-2">
        {selectedTags.map((tagId) => {
          const tag = DUMMY_TAGS.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tagId}
              className="flex items-center gap-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded-full pl-3 pr-2 py-1.5 font-['Plus_Jakarta_Sans']"
            >
              {tag.label}
              <button
                onClick={() => removeTag(tagId)}
                className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>

      <div className="shrink-0">
        <TagFilterDropdown selectedTags={selectedTags} onToggleTag={toggleTag} />
      </div>
    </div>
  );
}