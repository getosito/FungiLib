import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function getPk(item) {
    return (
        item?.identification?.primaryKey ||
        item?.id ||
        item?.identification?.collectionNumber ||
        "unknown"
    );
}

function formatWhen(iso) {
    if (!iso) return "";
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return String(iso);

    return new Date(t).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function LabDashboard() {
    const navigate = useNavigate();

    const role = useMemo(() => localStorage.getItem("userRole") || "", []);
    const isAdmin = role === "admin";
    const canAccess = role === "admin" || role === "member";

    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!canAccess) {
            navigate("/login");
            return;
        }
    }, [canAccess, navigate]);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setStatus("loading");
                setError("");

                const res = await fetch("/api/fungi");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const list = Array.isArray(data)
                    ? data
                    : data?.data ?? data?.fungi ?? [];

                if (!alive) return;

                setItems(list);
                setStatus("done");
            } catch (e) {
                if (!alive) return;
                setStatus("error");
                setError(e?.message || String(e));
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    const stats = useMemo(() => {
        const total = items.length;

        let withImages = 0;
        let withGps = 0;
        let withEcoregion = 0;
        let withLabInfo = 0;

        for (const x of items) {
            if (
                Array.isArray(x?.ecology?.images) &&
                x.ecology.images.some((s) => String(s || "").trim())
            )
                withImages++;
            if (x?.ecology?.gps?.lat != null && x?.ecology?.gps?.lng != null)
                withGps++;
            if (String(x?.ecology?.ecoregion || "").trim())
                withEcoregion++;
            if (x?.labInfo && Object.keys(x.labInfo).length > 0)
                withLabInfo++;
        }

        const latest = [...items]
            .sort((a, b) => {
                const ta = Date.parse(a?.updatedAt || a?.createdAt || 0) || 0;
                const tb = Date.parse(b?.updatedAt || b?.createdAt || 0) || 0;
                return tb - ta;
            })
            .slice(0, 6);

        return { total, withImages, withGps, withEcoregion, withLabInfo, latest };
    }, [items]);

    return (
        <>
            {/* NAVBAR */}
            <Navbar />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Lab Dashboard</h1>
                        <p className="mt-1 text-sm text-zinc-600">
                            Quick overview of the collection and management tools.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/" className="nav__btn">
                            Public site
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/lab/specimens/new"
                                className="nav__btn nav__btn--primary"
                            >
                                + Add specimen
                            </Link>
                        )}
                    </div>
                </div>

                {status === "loading" && (
                    <div className="mt-6 text-sm text-zinc-600">
                        Loading dashboard...
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {status === "done" && (
                    <>
                        {/* Stats */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Total specimens"
                                value={stats.total}
                            />
                            <StatCard
                                label="With images"
                                value={`${stats.withImages} / ${stats.total}`}
                            />
                            <StatCard
                                label="With GPS"
                                value={`${stats.withGps} / ${stats.total}`}
                            />
                            <StatCard
                                label="With lab info"
                                value={`${stats.withLabInfo} / ${stats.total}`}
                            />
                        </div>

                        {/* Actions + Latest */}
                        <div className="mt-6 grid gap-4 lg:grid-cols-3">
                            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                                <div className="text-sm font-semibold text-zinc-900">
                                    Quick actions
                                </div>
                                <div className="mt-4 grid gap-2">
                                    <Link className="nav__btn" to="/lab/catalog">
                                        Browse catalog
                                    </Link>
                                    <Link
                                        className="nav__btn"
                                        to="/lab/specimens"
                                    >
                                        Manage specimens
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-zinc-900">
                                        Latest updated
                                    </div>
                                    <Link
                                        to="/lab/catalog"
                                        className="text-sm underline text-zinc-700"
                                    >
                                        View all
                                    </Link>
                                </div>

                                <div className="mt-4 divide-y divide-zinc-100">
                                    {stats.latest.map((x) => {
                                        const pk = getPk(x);
                                        const title =
                                            x?.taxonomy?.commonName ||
                                            x?.taxonomy?.scientificName ||
                                            pk;
                                        const when =
                                            x?.updatedAt || x?.createdAt || "";

                                        return (
                                            <div
                                                key={pk}
                                                className="py-3 flex items-center justify-between gap-3"
                                            >
                                                <div>
                                                    <div className="font-medium text-zinc-900">
                                                        {title}
                                                    </div>
                                                    <div className="text-xs text-zinc-500">
                                                        {pk}
                                                        {when
                                                            ? ` - ${formatWhen(
                                                                when
                                                            )}`
                                                            : ""}
                                                    </div>
                                                </div>

                                                {isAdmin && (
                                                    <Link
                                                        to={`/lab/specimens/${encodeURIComponent(
                                                            pk
                                                        )}/edit`}
                                                        className="nav__btn nav__btn--primary"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-xs font-semibold text-zinc-600">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
                {value}
            </div>
        </div>
    );
}
