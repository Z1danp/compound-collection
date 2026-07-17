import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import EditCompound from "./EditCompound";
import SmilesDrawer from "smiles-drawer";

// Placeholder molecule icon — swap with SmilesDrawer render later
function MoleculePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-20 h-20 text-slate-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" />
    </svg>
  );
}

function MoleculeFigure({smiles}) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef || !smiles) return;
    const drawer = new SmilesDrawer.SmiDrawer({width: 550, height: 450})
    drawer.draw(smiles, svgRef.current, 'light')
  }, [smiles])

  return (
    <svg 
    ref={svgRef}
    style={{width:'25%', height:'auto', display:'flex'}}/>
  )
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
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className="flex items-center justify-center py-8 bg-white">
        <MoleculeFigure smiles={compound.smiles} />
      </div>

      <div className="border-t border-slate-100" />

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-base font-['Space_Grotesk']">
          {compound.name}
        </h3>
        <p className="text-sm text-slate-400 font-mono mt-0.5">
          {compound.smiles}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="bg-amber-100 text-amber-800 text-xs font-medium rounded-full px-3 py-1 font-['Plus_Jakarta_Sans']">
            {compound.tags[0]}
          </span>
          <button
            onClick={handleDeleteClick}
            aria-label={`Hapus ${compound.name}`}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CardList({ compounds }) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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