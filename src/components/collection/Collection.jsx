import { useEffect, useState, useRef } from 'react';
import CardList from './CompoundList';
import FilterBar from './Filterbar';
import Navbar from './NavBar';
import AddCompound from './AddCompound';

function Collection() {
  const [compounds, setCompounds] = useState([]);
  const [tags, setTags] = useState([]);
  const [compoundTags, setCompoundTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const abortControllerRef = useRef(null);

  async function fetchCompounds() {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('http://localhost:3000/api/user/data', {
        credentials: 'include',
        signal: controller.signal,
      });
      const result = await res.json();
      console.log(result);
      setCompounds(result.compounds);
      setTags(result.tags);
      setCompoundTags(result.compoundTags);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error({ message: err });
    }
  }

  useEffect(() => {
    fetchCompounds();
  }, []);

  // buat object tag

  const tagNameById = {};

  for (const tag of tags) {
    tagNameById[tag.id] = tag.name;
  }

  // groupping compoundTags
  const tagIdsByCompoundId = {};

  for (const ct of compoundTags) {
    if (!tagIdsByCompoundId[ct.compound_id]) {
      tagIdsByCompoundId[ct.compound_id] = [];
    }
    tagIdsByCompoundId[ct.compound_id].push(ct.tag_id);
  }

  const handleAddCompound = async (newCompound) => {
    try {
      const req = await fetch('http://localhost:3000/api/compounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          compound: {
            name: newCompound.name,
            smiles: newCompound.smiles,
            notes: newCompound.notes,
            is_favorit: false,
          },
          tags: newCompound.tags,
        }),
      });
      const saved = await req.json();
      setCompounds((prev) => [...prev, saved.compound]);
      setTags((prev) => [...prev, saved.tags]);
      setCompoundTags((prev) => [...prev, saved.compoundTags]);
    } catch (err) {
      console.error({ message: err });
    }
  };

  // Gabung ke compounds
  const compoundsWithTags = compounds.map((compound) => {
    const tagIds = tagIdsByCompoundId[compound.id] || [];

    const tagNames = tagIds.map((tagId) => {
      return tagNameById[tagId];
    });

    return { ...compound, tags: tagNames };
  });

  // Filter Compund
  const filteredCompounds =
    selectedTags.length === 0
      ? compoundsWithTags
      : compoundsWithTags.filter((c) =>
          selectedTags.every((tagId) => c.tags.includes(tagNameById[tagId]))
        );

  // search
  const q = searchQuery.trim().toLowerCase();
  const searchCompounds =
    q === ''
      ? filteredCompounds
      : filteredCompounds.filter((c) => {
          const matchName = c.name.toLowerCase().includes(q);
          const matchSmiles = c.smiles.toLowerCase().includes(q);
          const matchTags = c.tags.some((tagName) =>
            tagName.toLowerCase().includes(q)
          );

          return matchName || matchSmiles || matchTags;
        });

  // Favorite
  const favoriteCompounds = showFavoritesOnly ? searchCompounds.filter((c) => c.is_favorite === true): searchCompounds
  return (
    <div>
      <Navbar
        onAddClick={() => setIsAddOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FilterBar
        tags={tags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((v) => !v)}
      />
      <CardList
        compounds={favoriteCompounds} // <-- ganti jadi filtered
        tags={tagNameById}
        compoundTags={compoundsWithTags}
        fetching={fetchCompounds}
        allTags={tags.map((t) => t.name)}
      />
      {isAddOpen && (
        <AddCompound
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddCompound}
          allTags={tags.map((t) => t.name)}
        />
      )}
    </div>
  );
}

export default Collection;
