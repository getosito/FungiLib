import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { auth } from "../config/firebase";

function toImg(rawValue) {
    if (!rawValue) return "";

    let s = String(rawValue).trim();
    s = s.replace(/,$/, "");

    if (s.startsWith("http://") || s.startsWith("https://")) {
        return s;
    }

    s = s.replaceAll("\\", "/");
    s = s.replace(/^\.?\//, "");
    s = s.replace(/^docs\/images\//, "images/");

    if (!s.includes("/")) s = `images/${s}`;

    return `/${s}`;
}

function getSpecimenId(item) {
    return (
        item?.identification?.primaryKey ||
        item?.id ||
        item?.identification?.collectionNumber ||
        "unknown"
    );
}

function dash(v) {
    const s = v === null || v === undefined ? "" : String(v).trim();
    return s.length ? s : "-";
}

export default function SpecimenCard({ item, canManage = false, onDeleted }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const menuRef = useRef(null);

    const id = getSpecimenId(item);

    const common = item?.taxonomy?.commonName ?? "Unknown";
    const sci = item?.taxonomy?.scientificName ?? "";
    const raw = item?.ecology?.images?.[0] ?? "";
    const img = toImg(raw);

    const lab = item?.labInfo;

    useEffect(() => {
        function onDocClick(e) {
            if (open && menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const onEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        navigate(`/lab/specimens/${encodeURIComponent(id)}/edit`);
    };

    const onDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);

        const ok = window.confirm(`Delete specimen ${id}?`);
        if (!ok) return;

        try {
            setBusy(true);

            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            const token = await user.getIdToken(true);

            const res = await fetch(`/api/fungi/${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status} ${text}`);
            }

            if (typeof onDeleted === "function") onDeleted(id);
        } catch (err) {
            alert(err?.message || "Delete failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <article className="relative">
            {canManage && (
                <div ref={menuRef} className="absolute right-3 top-3 z-10">
                    <button
                        type="button"
                        className="nav__iconBtn"
                        aria-label="Specimen actions"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen((v) => !v);
                        }}
                    >
                        ⋮
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                            <button
                                type="button"
                                onClick={onEdit}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={onDelete}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-zinc-50"
                                disabled={busy}
                                style={{ opacity: busy ? 0.6 : 1 }}
                            >
                                {busy ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Link to={`/fungi/${encodeURIComponent(id)}`} className="block">
                <article className="overflow-hidden rounded-2xl bg-white shadow-sm border border-black/10 hover:shadow-md transition">
                    <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                        {img ? (
                            <img
                                src={img}
                                alt={common}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="h-full w-full grid place-items-center text-sm text-zinc-400">
                                No image
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <div className="font-semibold text-zinc-900">{common}</div>
                        {sci && <div className="italic text-sm text-zinc-600">{sci}</div>}

                        {/* Compact admin summary (clean) */}
                        {canManage && lab && (
                            <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-semibold text-zinc-900">
                                        Lab (admin)
                                    </div>
                                    <span className="text-[11px] text-zinc-500">
                                        Entry: {dash(lab.herbariumEntryNumber)}
                                    </span>
                                </div>

                                <div className="mt-1 text-xs text-zinc-700">
                                    <span className="font-semibold text-zinc-800">Collector:</span>{" "}
                                    {dash(lab.collector)}
                                </div>

                                <div className="mt-0.5 text-xs text-zinc-700">
                                    <span className="font-semibold text-zinc-800">Shelf/Box:</span>{" "}
                                    {dash(lab.shelfNumber)} / {dash(lab.boxNumber)}
                                </div>

                                <div className="mt-1">
                                    <span className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-700">
                                        View details in Edit
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </Link>
        </article>
    );
}
