import { useState } from "react";
import CompoundList from "./CompoundList";
import FilterBar from "./Filterbar";
import Navbar from "./NavBar";
import AddCompound from "./AddCompound";

// Dummy data — replace with real compound data from API later
const DUMMY_COMPOUNDS = [
  {
    id: 1,
    name: "Benzena",
    smiles: "c1ccccc1",
    tags: ["Aromatic", "Cyclic", "Pelarut", "Toksik"],
    notes:
      "Pelarut nonpolar, titik didih 80,1 °C. Jangan pakai untuk ekstraksi sampel B — residu susah hilang.\n\nCek ulang hasil uji nyala minggu depan; bandingkan dengan toluena.",
  },
  {
    id: 2,
    name: "Toluena",
    smiles: "Cc1ccccc1",
    tags: ["Aromatic"],
    notes: "",
  },
  {
    id: 3,
    name: "Fenol",
    smiles: "Oc1ccccc1",
    tags: ["Aromatic"],
    notes: "",
  },
  {
    id: 4,
    name: "Anilina",
    smiles: "Nc1ccccc1",
    tags: ["Aromatic"],
    notes: "",
  },
  {
    id: 5,
    name: "Metana",
    smiles: "C",
    tags: ["Alkane"],
    notes: "",
  },
  {
    id: 6,
    name: "Glisin",
    smiles: "NCC(=O)O",
    tags: ["Amine"],
    notes: "",
  },
];

function Collection () {
    const [compounds, setCompounds] = useState(DUMMY_COMPOUNDS);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleAddCompound = (newCompound) => {
        setCompounds((prev) => [...prev, { id: Date.now(), ...newCompound }]);
    };

    return (
        <div className="bg-slate-50">
        <Navbar onAddClick={() => setIsAddOpen(true)} />
        <FilterBar />
        <CompoundList compounds={compounds} />
        {isAddOpen && (
            <AddCompound
                onClose={() => setIsAddOpen(false)}
                onAdd={handleAddCompound}
            />
        )}
        </div>
    )
}

export default Collection;