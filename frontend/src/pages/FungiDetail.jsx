import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";

function safe(obj, path, fallback = "") {
    try {
        return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? fallback;
    } catch {
        return fallback;
    }
}

function toImg(rawValue) {
    if (!rawValue) return "";
    let s = String(rawValue).trim();
    s = s.replace(/,$/, "");
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    s = s.replaceAll("\\", "/");
    s = s.replace(/^\.?\//, "");
    s = s.replace(/^docs\/images\//, "images/");
    if (!s.includes("/")) s = `images/${s}`;
    return `/${s}`;
}

export default function FungiDetail() {
    const { id } = useParams();

    const decodedId = useMemo(() => {
        try { return decodeURIComponent(id || ""); } catch { return id || ""; }
    }, [id]);

    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [item, setItem] = useState(null);

    // role read directly (always up-to-date as long as logout removes it)
    const role = localStorage.getItem("userRole") || "";
    const isAdmin = role === "admin";
    const isMemberOrAdmin = role === "member" || role === "admin";

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setStatus("loading");
                setError("");
                setItem(null);

                // 1)
                const res1 = await fetch(`/api/fungi/${encodeURIComponent(decodedId)}`);
                if (res1.ok) {
                    const data1 = await res1.json();
                    const found1 = data1?.fungus ?? data1?.data ?? data1;
                    if (alive) {
                        setItem(found1);
                        setStatus("done");
                    }
                    return;
                }

                // 2) Fallback
                const res2 = await fetch("/api/fungi");
                if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
                const data2 = await res2.json();
                const list = Array.isArray(data2) ? data2 : (data2.fungi ?? data2.data ?? []);
                const found2 = list.find((x) => {
                    const pk = x?.identification?.primaryKey;
                    const xid = x?.id;
                    const cn = x?.identification?.collectionNumber;
                    return pk === decodedId || xid === decodedId || cn === decodedId;
                });

                if (!found2) throw new Error("Specimen not found in /api/fungi list.");

                if (alive) {
                    setItem(found2);
                    setStatus("done");
                }
            } catch (e) {
                if (!alive) return;
                setStatus("error");
                setError(e?.message || String(e));
            }
        }

        load();
        return () => { alive = false; };
    }, [decodedId]);

    const commonName = item?.taxonomy?.commonName ?? "Unknown specimen";
    const scientificName = item?.taxonomy?.scientificName ?? "";
    const imgRaw = item?.ecology?.images?.[0] ?? "";
    const img = toImg(imgRaw);

    return (
        <Layout>
            <Link to="/" style={{ display: "inline-block", marginBottom: 12 }}>
                ← Back to Home
            </Link>

            {status === "loading" && (
                <div style={{ padding: 8 }}>Loading specimen...</div>
            )}

            {status === "error" && (
                <div style={{ padding: 8 }}>
                    <div style={{ fontWeight: 800 }}>Error</div>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
                    <div style={{ marginTop: 10 }}>
                        <b>Requested ID:</b> {decodedId}
                    </div>
                </div>
            )}

            {status === "done" && item && (
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <h1 style={{ margin: "0 0 6px 0" }}>{commonName}</h1>
                        {scientificName && <div style={{ fontStyle: "italic", color: "#555" }}>{scientificName}</div>}
                        <div style={{ marginTop: 6, color: "#444" }}><b>ID:</b> {decodedId}</div>
                    </div>

                    {img && (
                        <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
                            <img
                                src={img}
                                alt={commonName}
                                style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
                            />
                        </div>
                    )}

                    <Section title="Taxonomy">
                        <Row label="Division" value={safe(item, "taxonomy.division", "-")} />
                        <Row label="Class" value={safe(item, "taxonomy.class", "-")} />
                        <Row label="Order" value={safe(item, "taxonomy.order", "-")} />
                        <Row label="Family" value={safe(item, "taxonomy.family", "-")} />
                        <Row label="Genus" value={safe(item, "taxonomy.genus", "-")} />
                        <Row label="Species" value={safe(item, "taxonomy.species", "-")} />
                    </Section>

                    <Section title="Ecology">
                        <Row label="Ecoregion" value={safe(item, "ecology.ecoregion", "-")} />
                        <Row label="GPS (lat)" value={String(safe(item, "ecology.gps.lat", "-"))} />
                        <Row label="GPS (lng)" value={String(safe(item, "ecology.gps.lng", "-"))} />
                    </Section>

                    {/* Collection only for member/admin */}
                    {isMemberOrAdmin && (
                        <Section title="Collection">
                            <Row label="Collection Number" value={safe(item, "identification.collectionNumber", "-")} />
                            <Row label="Collected By" value={safe(item, "collectionData.collectedBy", "-")} />
                            <Row label="Collection Date" value={safe(item, "collectionData.date", "-")} />
                            <Row label="Author" value={safe(item, "collectionData.author", "-")} />
                            <Row label="Culture collection #" value={safe(item, "collectionData.cultureCollectionNumber", "-")} />
                            <Row label="Coordinates" value={safe(item, "collectionData.coordinates", "-")} />
                        </Section>
                    )}

                    {/* Lab-only for admin */}
                    {isAdmin && (
                        <Section title="Lab Observations (Admin)">
                            <Row label="Location" value={safe(item, "labInfo.location", "-")} />
                            <Row label="Entry number" value={safe(item, "labInfo.herbariumEntryNumber", "-")} />
                            <Row label="Collector" value={safe(item, "labInfo.collector", "-")} />
                            <Row label="Collection number (lab)" value={safe(item, "labInfo.collectionNumber", "-")} />
                            <Row label="Physical evidence" value={safe(item, "labInfo.physicalEvidence", "-")} />
                            <Row label="Shelf number" value={safe(item, "labInfo.shelfNumber", "-")} />
                            <Row label="Box number" value={safe(item, "labInfo.boxNumber", "-")} />
                            <Row label="Lab notes" value={safe(item, "labNotes", "-")} />
                        </Section>
                    )}
                </div>
            )}
        </Layout>
    );
}

function Section({ title, children }) {
    return (
        <section style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{title}</h3>
            <div style={{ display: "grid", gap: 8 }}>{children}</div>
        </section>
    );
}

function Row({ label, value }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10 }}>
            <div style={{ fontWeight: 700, color: "#333" }}>{label}</div>
            <div style={{ color: "#444" }}>{value || "-"}</div>
        </div>
    );
}
