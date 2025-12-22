import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SpecimenGrid from "../components/SpecimenGrid";

export default function Home() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

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
        if (!q) return items;
        return items.filter((x) => {
            const common = (x?.taxonomy?.commonName ?? "").toLowerCase();
            const sci = (x?.taxonomy?.scientificName ?? "").toLowerCase();
            return common.includes(q) || sci.includes(q);
        });
    }, [items, query]);

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />
            <Hero query={query} setQuery={setQuery} />

            {status === "loading" && (
                <div className="mx-auto max-w-6xl px-4 py-10 text-zinc-600">Loading...</div>
            )}

            {status === "error" && (
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="font-bold">Error loading fungi</div>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{error}</pre>
                </div>
            )}

            {status === "done" && <SpecimenGrid items={filtered.slice(0, 12)} />}
        </div>
    );
}
