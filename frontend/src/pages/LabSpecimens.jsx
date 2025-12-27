import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LabSpecimens() {
    const [items, setItems] = useState([]);
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

    const canManage = localStorage.getItem("userRole") === "admin";

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold">Specimens</h1>
                        <p className="mt-1 text-sm text-zinc-600">
                            Manage records (create, edit, delete).
                        </p>
                    </div>

                    {canManage && (
                        <Link to="/lab/specimens/new" className="nav__btn nav__btn--primary">
                            + Add specimen
                        </Link>
                    )}
                </div>

                {status === "loading" && (
                    <div className="mt-6 text-sm text-zinc-600">Loading...</div>
                )}

                {status === "error" && (
                    <div className="mt-6">
                        <div className="font-bold">Error loading fungi</div>
                        <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{error}</pre>
                    </div>
                )}

                {status === "done" && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50 text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Common name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Scientific name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((x, idx) => {
                                    const id =
                                        x?.identification?.primaryKey ||
                                        x?.id ||
                                        x?.identification?.collectionNumber ||
                                        String(idx);

                                    const common = x?.taxonomy?.commonName ?? "Unknown";
                                    const sci = x?.taxonomy?.scientificName ?? "";

                                    return (
                                        <tr key={id} className="border-t border-zinc-200">
                                            <td className="px-4 py-3">{id}</td>
                                            <td className="px-4 py-3">{common}</td>
                                            <td className="px-4 py-3 italic text-zinc-600">{sci}</td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    to={`/lab/specimens/${encodeURIComponent(id)}/edit`}
                                                    className="underline"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
