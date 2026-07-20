import { useEffect, useState, useRef } from 'react';
import CompoundList from './CompoundList';
import FilterBar from './Filterbar';
import Navbar from './NavBar';
import AddCompound from './AddCompound';

// Dummy data — replace with real compound data from API later
const DUMMY_COMPOUNDS = [
  {
    id: 1,
    name: 'Benzena',
    smiles: 'c1ccccc1',
    tags: ['Aromatic', 'Cyclic', 'Pelarut', 'Toksik'],
    notes:
      'Pelarut nonpolar, titik didih 80,1 °C. Jangan pakai untuk ekstraksi sampel B — residu susah hilang.\n\nCek ulang hasil uji nyala minggu depan; bandingkan dengan toluena.',
  },
  {
    id: 2,
    name: 'Toluena',
    smiles: 'Cc1ccccc1',
    tags: ['Aromatic'],
    notes: '',
  },
  {
    id: 3,
    name: 'Fenol',
    smiles: 'Oc1ccccc1',
    tags: ['Aromatic'],
    notes: '',
  },
  {
    id: 4,
    name: 'Anilina',
    smiles: 'Nc1ccccc1',
    tags: ['Aromatic'],
    notes: '',
  },
  {
    id: 5,
    name: 'Metana',
    smiles: 'C',
    tags: ['Alkane'],
    notes: '',
  },
  {
    id: 6,
    name: 'Taurocholic Acid',
    smiles:
      'CS(=O)(=O)CCNC(=O)CCC[C@H](C)[C@H]1CC[C@@H]2[C@@]1([C@H](C[C@H]3[C@H]2[C@@H](C[C@H]4[C@@]3(CC[C@H](C4)O)C)O)O)C',
    tags: ['Cholic Acid'],
    notes: '',
  },
];

function Collection() {
  const [compounds, setCompounds] = useState(DUMMY_COMPOUNDS);
  const [tags, setTags] = useState([]);
  const [compoundTags, setCompoundTags] = useState([]);
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

  return (
    <div className="bg-slate-50">
      <Navbar onAddClick={() => setIsAddOpen(true)} />
      <FilterBar />
      <CompoundList
        compounds={compoundsWithTags}
        tags={tagNameById}
        compoundTags={compoundsWithTags}
      />
      {isAddOpen && (
        <AddCompound
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddCompound}
        />
      )}
    </div>
  );
}

export default Collection;
