import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AdvancedSearchPanel from "../components/AdvancedSearchPanel";
import SpecimenGrid from "../components/SpecimenGrid";

export default function Home() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    // Advanced Search
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [filters, setFilters] = useState({
        division: "",
        family: "",
        genus: "",
        ecoregion: "",
    });

    // --- CHECK IF USER IS ADMIN ---
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        async function load() {
            try {
                setStatus("loading");
                setError("");
                const res = await fetch("/api/fungi");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.fungi ?? data.data ?? []);
                setItems(list);
                setStatus("done");
            } catch (e) {
                setStatus("error");
                setError(e?.message || String(e));
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const fDivision = filters.division.trim().toLowerCase();
        const fFamily = filters.family.trim().toLowerCase();
        const fGenus = filters.genus.trim().toLowerCase();
        const fEcoregion = filters.ecoregion.trim().toLowerCase();

        return items.filter((x) => {
            const common = (x?.taxonomy?.commonName ?? "").toLowerCase();
            const sci = (x?.taxonomy?.scientificName ?? "").toLowerCase();
            const matchesQuery = !q || common.includes(q) || sci.includes(q);

            const division = (x?.taxonomy?.division ?? "").toLowerCase();
            const family = (x?.taxonomy?.family ?? "").toLowerCase();
            const genus = (x?.taxonomy?.genus ?? "").toLowerCase();
            const ecoregion = (x?.ecology?.ecoregion ?? "").toLowerCase();

            const matchesDivision = !fDivision || division.includes(fDivision);
            const matchesFamily = !fFamily || family.includes(fFamily);
            const matchesGenus = !fGenus || genus.includes(fGenus);
            const matchesEcoregion = !fEcoregion || ecoregion.includes(fEcoregion);

            return matchesQuery && matchesDivision && matchesFamily && matchesGenus && matchesEcoregion;
        });
    }, [items, query, filters]);

    const onAdvancedToggle = () => setAdvancedOpen((v) => !v);
    const onApplyAdvanced = () => setAdvancedOpen(false);
    const onResetAdvanced = () => setFilters({ division: "", family: "", genus: "", ecoregion: "" });

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <Hero
                query={query}
                setQuery={setQuery}
                onAdvancedToggle={onAdvancedToggle}
            />

            <AdvancedSearchPanel
                open={advancedOpen}
                filters={filters}
                setFilters={setFilters}
                onApply={onApplyAdvanced}
                onReset={onResetAdvanced}
            />

            {/* --- ADMIN ONLY: ADD BUTTON --- */}
           {/* --- ADMIN ONLY: ADD BUTTON --- */}
{/* --- ADMIN ONLY: ADD BUTTON --- */}
{/* --- ADMIN DASHBOARD TOOLBAR --- */}
{isAdmin && (
    <div className="mx-auto max-w-6xl px-4 mt-6 mb-8">
        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex flex-wrap justify-between items-center shadow-sm">
            
            {/* LEFT SIDE: Add Button */}
            <button 
                onClick={() => window.location.href = "/add-specimen"} 
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-md active:scale-95"
            >
                <span className="text-xl leading-none">+</span> Add New Specimen
            </button>

            {/* RIGHT SIDE: Profile & Logout */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500 hidden sm:inline-block">
                    Logged in as <b>Admin</b>
                </span>
                
                <div className="h-8 w-px bg-zinc-300 hidden sm:block"></div> {/* Divider Line */}

                <button 
                    onClick={() => {
                        if(window.confirm("Are you sure you want to sign out?")) {
                            localStorage.removeItem("user");
                            localStorage.removeItem("token");
                            window.location.reload();
                        }
                    }}
                    className="flex items-center gap-2 bg-white text-zinc-700 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition border border-zinc-300 text-sm shadow-sm"
                >
                    🚪 Sign Out
                </button>
            </div>
        </div>
    </div>
)}

            {status === "loading" && (
                <div className="mx-auto max-w-6xl px-4 py-10 text-zinc-600">Loading...</div>
            )}

            {status === "error" && (
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="font-bold">Error loading fungi</div>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{error}</pre>
                </div>
            )}

            {status === "done" && (
                <>
                    <div className="mx-auto max-w-6xl px-4 pt-6 text-sm text-zinc-600">
                        Showing <b>{Math.min(filtered.length, 12)}</b> of <b>{filtered.length}</b> matches
                    </div>

                    <SpecimenGrid items={filtered.slice(0, 12)} />
                </>
            )}
           {/* ADMIN ACTIONS */}

        </div>
    );
}