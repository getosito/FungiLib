import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpecimenCard from "./SpecimenCard";
import Pagination from "./Pagination";

export default function SpecimenGrid({
    items,
    title = "Catalog",
    canManage = false,
    perPage = 12,
}) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    // Keep a local copy so we can remove deleted items instantly
    const [localItems, setLocalItems] = useState(items);

    useEffect(() => {
        setLocalItems(items);
        setPage(1);
    }, [items, perPage]);

    const totalPages = Math.max(1, Math.ceil(localItems.length / perPage));

    const pageItems = useMemo(() => {
        const start = (page - 1) * perPage;
        return localItems.slice(start, start + perPage);
    }, [localItems, page, perPage]);

    const showingStart = localItems.length === 0 ? 0 : (page - 1) * perPage + 1;
    const showingEnd = Math.min(page * perPage, localItems.length);

    const onDeleted = (deletedId) => {
        setLocalItems((prev) =>
            prev.filter((x) => {
                const pk = x?.identification?.primaryKey || x?.id || x?.identification?.collectionNumber;
                return pk !== deletedId;
            })
        );
    };

    // If deleting makes current page empty, step back one page when possible
    useEffect(() => {
        const start = (page - 1) * perPage;
        if (page > 1 && localItems.length <= start) {
            setPage((p) => Math.max(1, p - 1));
        }
    }, [localItems.length, page, perPage]);

    return (
        <section className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
                    <div className="text-sm text-zinc-600">
                        Showing <b>{showingStart}</b>-<b>{showingEnd}</b> of{" "}
                        <b>{localItems.length}</b> specimens
                    </div>
                </div>

                {canManage && (
                    <button
                        type="button"
                        className="nav__btn nav__btn--primary"
                        onClick={() => navigate("/lab/specimens/new")}
                    >
                        + Add specimen
                    </button>
                )}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {pageItems.map((item, idx) => (
                    <SpecimenCard
                        key={item?.identification?.primaryKey ?? item?.id ?? idx}
                        item={item}
                        canManage={canManage}
                        onDeleted={onDeleted}
                    />
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>
    );
}
