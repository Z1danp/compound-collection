import CompoundList from "./CompoundList";
import FilterBar from "./Filterbar";
import Navbar from "./NavBar";

function Collection () {
    return (
        <div className="bg-slate-50">
        <Navbar />
        <FilterBar />
        <CompoundList />
        </div>
    )
}

export default Collection;