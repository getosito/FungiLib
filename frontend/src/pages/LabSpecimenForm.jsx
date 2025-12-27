import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth } from "../config/firebase";

function emptyForm() {
    return {
        identification: {
            primaryKey: "",
            collectionNumber: "",
        },
        taxonomy: {
            commonName: "",
            scientificName: "",
            division: "",
            class: "",
            order: "",
            family: "",
            genus: "",
            species: "",
        },
        ecology: {
            ecoregion: "",
            images: [""],
        },

        // matches backend + Firestore fields
        labInfo: {
            location: "",
            herbariumEntryNumber: "",
            collector: "",
            collectionNumber: "",
            physicalEvidence: "",
            shelfNumber: "",
            boxNumber: "",
        },
        labNotes: "",
    };
}

export default function LabSpecimenForm({ mode }) {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

    const isEdit = mode === "edit";
    const canManage = localStorage.getItem("userRole") === "admin";

    const [form, setForm] = useState(() => emptyForm());
    const [status, setStatus] = useState(isEdit ? "loading" : "ready");
    const [error, setError] = useState("");

    const title = useMemo(() => (isEdit ? "Edit specimen" : "Add specimen"), [isEdit]);

    useEffect(() => {
        if (!canManage) {
            navigate("/lab/catalog");
            return;
        }
    }, [canManage, navigate]);

    useEffect(() => {
        if (!isEdit) return;

        async function loadOne() {
            try {
                setStatus("loading");
                setError("");

                const res = await fetch(`/api/fungi/${encodeURIComponent(id)}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const normalized = data?.data ?? data;

                setForm({
                    identification: {
                        primaryKey: normalized?.identification?.primaryKey ?? id ?? "",
                        collectionNumber: normalized?.identification?.collectionNumber ?? "",
                    },
                    taxonomy: {
                        commonName: normalized?.taxonomy?.commonName ?? "",
                        scientificName: normalized?.taxonomy?.scientificName ?? "",
                        division: normalized?.taxonomy?.division ?? "",
                        class: normalized?.taxonomy?.class ?? "",
                        order: normalized?.taxonomy?.order ?? "",
                        family: normalized?.taxonomy?.family ?? "",
                        genus: normalized?.taxonomy?.genus ?? "",
                        species: normalized?.taxonomy?.species ?? "",
                    },
                    ecology: {
                        ecoregion: normalized?.ecology?.ecoregion ?? "",
                        images: Array.isArray(normalized?.ecology?.images)
                            ? (normalized.ecology.images.length ? normalized.ecology.images : [""])
                            : [""],
                    },

                    // load from Firestore field "labInfo"
                    labInfo: {
                        location: normalized?.labInfo?.location ?? "",
                        herbariumEntryNumber: normalized?.labInfo?.herbariumEntryNumber ?? "",
                        collector: normalized?.labInfo?.collector ?? "",
                        collectionNumber: normalized?.labInfo?.collectionNumber ?? "",
                        physicalEvidence: normalized?.labInfo?.physicalEvidence ?? "",
                        shelfNumber: normalized?.labInfo?.shelfNumber ?? "",
                        boxNumber: normalized?.labInfo?.boxNumber ?? "",
                    },

                    // load "labNotes"
                    labNotes: normalized?.labNotes ?? "",
                });

                setStatus("ready");
            } catch (e) {
                setStatus("error");
                setError(e?.message || String(e));
            }
        }

        loadOne();
    }, [isEdit, id]);

    const setField = (path, value) => {
        setForm((prev) => {
            const next = structuredClone(prev);
            const parts = path.split(".");
            let cur = next;
            for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
            cur[parts[parts.length - 1]] = value;
            return next;
        });
    };

    const cleanObjectStrings = (obj) => {
        // Remove keys whose values are empty strings (keeps numbers/booleans)
        const out = {};
        for (const [k, v] of Object.entries(obj || {})) {
            if (typeof v === "string") {
                const trimmed = v.trim();
                if (trimmed.length > 0) out[k] = trimmed;
            } else if (v !== undefined) {
                out[k] = v;
            }
        }
        return out;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            const token = await user.getIdToken(true);

            const payload = {
                ...form,
                identification: {
                    ...form.identification,
                    primaryKey: form.identification.primaryKey || form.identification.collectionNumber,
                },
                ecology: {
                    ...form.ecology,
                    images: (form.ecology.images || []).filter((x) => String(x || "").trim().length > 0),
                },

                // correct field names for backend
                labInfo: cleanObjectStrings(form.labInfo),
                labNotes: (form.labNotes ?? "").trim(),
            };

            const url = isEdit ? `/api/fungi/${encodeURIComponent(id)}` : `/api/fungi`;
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status} ${text}`);
            }

            navigate("/lab/catalog");
        } catch (err) {
            setError(err?.message || String(err));
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="mt-1 text-sm text-zinc-600">
                            {isEdit ? "Update taxonomy, ecology, and lab fields." : "Create a new specimen record."}
                        </p>
                    </div>

                    <button type="button" className="nav__btn" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>

                {status === "loading" && <div className="mt-6 text-sm text-zinc-600">Loading...</div>}

                {status === "error" && (
                    <div className="mt-6">
                        <div className="font-bold">Error</div>
                        <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{error}</pre>
                    </div>
                )}

                {status === "ready" && (
                    <form onSubmit={onSubmit} className="mt-6 space-y-6">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <div className="text-sm font-semibold text-zinc-900">Identification</div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Primary key"
                                    value={form.identification.primaryKey}
                                    onChange={(v) => setField("identification.primaryKey", v)}
                                    placeholder="PY-FUN-001"
                                />
                                <Field
                                    label="Collection number"
                                    value={form.identification.collectionNumber}
                                    onChange={(v) => setField("identification.collectionNumber", v)}
                                    placeholder="PY-FUN-001"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <div className="text-sm font-semibold text-zinc-900">Taxonomy</div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Common name"
                                    value={form.taxonomy.commonName}
                                    onChange={(v) => setField("taxonomy.commonName", v)}
                                    placeholder="Red bracket fungus"
                                />
                                <Field
                                    label="Scientific name"
                                    value={form.taxonomy.scientificName}
                                    onChange={(v) => setField("taxonomy.scientificName", v)}
                                    placeholder="Pycnoporus sanguineus"
                                />
                                <Field
                                    label="Division"
                                    value={form.taxonomy.division}
                                    onChange={(v) => setField("taxonomy.division", v)}
                                    placeholder="Basidiomycota"
                                />
                                <Field
                                    label="Class"
                                    value={form.taxonomy.class}
                                    onChange={(v) => setField("taxonomy.class", v)}
                                    placeholder="Agaricomycetes"
                                />
                                <Field
                                    label="Order"
                                    value={form.taxonomy.order}
                                    onChange={(v) => setField("taxonomy.order", v)}
                                    placeholder="Polyporales"
                                />
                                <Field
                                    label="Family"
                                    value={form.taxonomy.family}
                                    onChange={(v) => setField("taxonomy.family", v)}
                                    placeholder="Polyporaceae"
                                />
                                <Field
                                    label="Genus"
                                    value={form.taxonomy.genus}
                                    onChange={(v) => setField("taxonomy.genus", v)}
                                    placeholder="Pycnoporus"
                                />
                                <Field
                                    label="Species"
                                    value={form.taxonomy.species}
                                    onChange={(v) => setField("taxonomy.species", v)}
                                    placeholder="sanguineus"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <div className="text-sm font-semibold text-zinc-900">Ecology</div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Ecoregion"
                                    value={form.ecology.ecoregion}
                                    onChange={(v) => setField("ecology.ecoregion", v)}
                                    placeholder="Atlantic Forest"
                                />

                                <Field
                                    label="Image path or URL (1st)"
                                    value={form.ecology.images?.[0] ?? ""}
                                    onChange={(v) => {
                                        setForm((prev) => {
                                            const next = structuredClone(prev);
                                            if (!Array.isArray(next.ecology.images)) next.ecology.images = [""];
                                            next.ecology.images[0] = v;
                                            return next;
                                        });
                                    }}
                                    placeholder="images/py-001.jpg or https://..."
                                />
                            </div>
                        </div>

                        {/* Admin / Lab observations */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <div className="text-sm font-semibold text-zinc-900">Lab observations (Admin)</div>
                            <p className="mt-1 text-xs text-zinc-600">
                                Internal fields for herbarium/lab management. Not intended for public browsing.
                            </p>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Location"
                                    value={form.labInfo.location}
                                    onChange={(v) => setField("labInfo.location", v)}
                                    placeholder="Mycology Laboratory, Faculty of Sciences"
                                />
                                <Field
                                    label="Entry number"
                                    value={form.labInfo.herbariumEntryNumber}
                                    onChange={(v) => setField("labInfo.herbariumEntryNumber", v)}
                                    placeholder="HEP-2024-112"
                                />
                                <Field
                                    label="Collector"
                                    value={form.labInfo.collector}
                                    onChange={(v) => setField("labInfo.collector", v)}
                                    placeholder="Jonathan"
                                />
                                <Field
                                    label="Collection number (lab)"
                                    value={form.labInfo.collectionNumber}
                                    onChange={(v) => setField("labInfo.collectionNumber", v)}
                                    placeholder="PY-FUN-001"
                                />
                                <Field
                                    label="Physical evidence"
                                    value={form.labInfo.physicalEvidence}
                                    onChange={(v) => setField("labInfo.physicalEvidence", v)}
                                    placeholder="Dried and pressed basidiocarp"
                                />
                                <Field
                                    label="Shelf number"
                                    value={form.labInfo.shelfNumber}
                                    onChange={(v) => setField("labInfo.shelfNumber", v)}
                                    placeholder="3"
                                />
                                <Field
                                    label="Box number"
                                    value={form.labInfo.boxNumber}
                                    onChange={(v) => setField("labInfo.boxNumber", v)}
                                    placeholder="12"
                                />
                                <Field
                                    label="Lab notes"
                                    value={form.labNotes}
                                    onChange={(v) => setField("labNotes", v)}
                                    placeholder="Collected on dead hardwood substrate."
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <button type="button" className="nav__btn" onClick={() => navigate("/lab/catalog")}>
                                Cancel
                            </button>
                            <button type="submit" className="nav__btn nav__btn--primary">
                                {isEdit ? "Save changes" : "Create specimen"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function Field({ label, value, onChange, placeholder }) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-zinc-700">{label}</div>
            <input
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
}
