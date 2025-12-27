import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AdvancedSearchPanel from "../components/AdvancedSearchPanel";
import SpecimenGrid from "../components/SpecimenGrid";

export default function LabCatalog() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [filters, setFilters] = useState({
        class: "",
        division: "",
        order: "",
        family: "",
        genus: "",
        species: "",
        ecoregion: "",
    });

    useEffect(() => {
        async function load() {
            try {
                setStatus("loading");
                setError("");
                const res = await fetch("/api/fungi");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.fungi ?? data.data ?? [];
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

        const fClass = filters.class.trim().toLowerCase();
        const fDivision = filters.division.trim().toLowerCase();
        const fOrder = filters.order.trim().toLowerCase();
        const fFamily = filters.family.trim().toLowerCase();
        const fGenus = filters.genus.trim().toLowerCase();
        const fSpecies = filters.species.trim().toLowerCase();
        const fEcoregion = filters.ecoregion.trim().toLowerCase();

        return items.filter((x) => {
            const common = (x?.taxonomy?.commonName ?? "").toLowerCase();
            const sci = (x?.taxonomy?.scientificName ?? "").toLowerCase();
            const matchesQuery = !q || common.includes(q) || sci.includes(q);

            const cls = (x?.taxonomy?.class ?? "").toLowerCase();
            const division = (x?.taxonomy?.division ?? "").toLowerCase();
            const order = (x?.taxonomy?.order ?? "").toLowerCase();
            const family = (x?.taxonomy?.family ?? "").toLowerCase();
            const genus = (x?.taxonomy?.genus ?? "").toLowerCase();
            const species = (x?.taxonomy?.species ?? "").toLowerCase();
            const ecoregion = (x?.ecology?.ecoregion ?? "").toLowerCase();

            const matchesClass = !fClass || cls.includes(fClass);
            const matchesDivision = !fDivision || division.includes(fDivision);
            const matchesOrder = !fOrder || order.includes(fOrder);
            const matchesFamily = !fFamily || family.includes(fFamily);
            const matchesGenus = !fGenus || genus.includes(fGenus);
            const matchesSpecies = !fSpecies || species.includes(fSpecies);
            const matchesEcoregion = !fEcoregion || ecoregion.includes(fEcoregion);

            return (
                matchesQuery &&
                matchesClass &&
                matchesDivision &&
                matchesOrder &&
                matchesFamily &&
                matchesGenus &&
                matchesSpecies &&
                matchesEcoregion
            );
        });
    }, [items, query, filters]);

    const onAdvancedToggle = () => setAdvancedOpen((v) => !v);
    const onApplyAdvanced = () => setAdvancedOpen(false);
    const onResetAdvanced = () =>
        setFilters({
            class: "",
            division: "",
            order: "",
            family: "",
            genus: "",
            species: "",
            ecoregion: "",
        });

    const canManage = localStorage.getItem("userRole") === "admin";

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <Hero query={query} setQuery={setQuery} onAdvancedToggle={onAdvancedToggle} />

            <AdvancedSearchPanel
                open={advancedOpen}
                filters={filters}
                setFilters={setFilters}
                onApply={onApplyAdvanced}
                onReset={onResetAdvanced}
            />

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
                <SpecimenGrid items={filtered} title="Catalog" canManage={canManage} perPage={12} />
            )}
        </div>
    );
}
