import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import EditCompound from './EditCompound';
import SmilesDrawer from 'smiles-drawer';

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
      style={{ width: '25%', height: 'auto', display: 'flex' }}
    />
  );
}

function CompoundCard({ compound, onEdit, onDelete }) {
  const handleCardClick = () => {
    onEdit(compound);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // prevent triggering handleCardClick
    onDelete(compound);
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-center justify-center bg-white py-8">
        <MoleculeFigure smiles={compound.smiles} />
      </div>

      <div className="border-t border-slate-100" />

      <div className="p-4">
        <h3 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900">
          {compound.name}
        </h3>
        <p className="mt-0.5 font-mono truncate text-sm text-slate-400">
          {compound.smiles}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {compound.tags.map((tagName) => (
              <span key={tagName} className="rounded-full bg-amber-100 px-3 py-1 font-['Plus_Jakarta_Sans'] text-xs font-medium text-amber-800">
                {tagName}
              </span>
            ))}
          </div>
          <button
            onClick={handleDeleteClick}
            aria-label={`Hapus ${compound.name}`}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CardList({ compounds, tags, compoundTags }) {
  const [editingCompound, setEditingCompound] = useState(null);

  const handleEdit = (compound) => {
    setEditingCompound(compound);
  };

  const handleCloseModal = () => {
    setEditingCompound(null);
  };

  const handleSaveNotes = (compoundId, notes) => {
    // Dummy for now — will call update API later
    console.log(`Auto-save notes for compound ${compoundId}:`, notes);
  };

  const handleDelete = (compound) => {
    // Dummy for now — will call delete API later
    alert(`Hapus senyawa: ${compound.name}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {compounds.map((compound) => (
          <CompoundCard
            key={compound.id}
            compound={compound}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingCompound && (
        <EditCompound
          compound={editingCompound}
          onClose={handleCloseModal}
          onSaveNotes={handleSaveNotes}
          figure={MoleculeFigure}
        />
      )}
    </>
  );
}
