import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, X, Check, Star } from 'lucide-react';

function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onClose]);
}

function TagFilterDropdown({ tags, selectedTags, onToggleTag }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Filter tag"
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:shadow-md sm:px-4"
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filter tag</span>
        <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:inline" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {tags.map((tag) => {
              const checked = selectedTags.includes(tag.id);
              return (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        checked
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => onToggleTag(tag.id)}
                    />
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-medium text-slate-700">
                      {tag.name}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <div className="mt-1 border-t border-slate-100 px-3 pt-2">
            <button className="font-['Plus_Jakarta_Sans'] text-sm font-medium text-blue-600 hover:underline">
              Kelola tag...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterBar({
  tags,
  selectedTags,
  onTagsChange,
  showFavoritesOnly,
  onToggleFavorites,
}) {
  const toggleTag = (tagId) => {
    onTagsChange(
      selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]
    );
  };

  const removeTag = (tagId) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId));
  };

  return (
    <div className="sticky top-15 z-20 flex w-full items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
      <div className="flex flex-wrap items-center gap-2">
        {selectedTags.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tagId}
              className="flex items-center gap-1.5 rounded-full bg-amber-100 py-1.5 pr-2 pl-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-amber-800"
            >
              {tag.name}
              <button
                onClick={() => removeTag(tagId)}
                className="rounded-full p-0.5 transition-colors hover:bg-amber-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onToggleFavorites}
          aria-pressed={showFavoritesOnly}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm font-medium transition-colors sm:px-4 ${
            showFavoritesOnly
              ? 'border-amber-200 bg-amber-100 text-amber-800'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <Star
            className={`h-4 w-4 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`}
          />
          <span className="hidden sm:inline">Favorit</span>
        </button>

        <TagFilterDropdown
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
      </div>
    </div>
  );
}
