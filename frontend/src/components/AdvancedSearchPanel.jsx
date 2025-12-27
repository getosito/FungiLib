export default function AdvancedSearchPanel({
    open,
    filters,
    setFilters,
    onApply,
    onReset,
}) {
    if (!open) return null;

    const onChange = (key) => (e) => {
        const val = e.target.value;
        setFilters((prev) => ({ ...prev, [key]: val }));
    };

    return (
        <section className="mx-auto max-w-6xl px-4 pb-10">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                {/* Grid: 2 rows (adjusts automatically) */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Class
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.class ?? ""}
                            onChange={onChange("class")}
                            placeholder="e.g., Agaricomycetes"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Division
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.division ?? ""}
                            onChange={onChange("division")}
                            placeholder="e.g., Basidiomycota"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Order
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.order ?? ""}
                            onChange={onChange("order")}
                            placeholder="e.g., Polyporales"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Family
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.family ?? ""}
                            onChange={onChange("family")}
                            placeholder="e.g., Polyporaceae"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Genus
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.genus ?? ""}
                            onChange={onChange("genus")}
                            placeholder="e.g., Pycnoporus"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Species
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.species ?? ""}
                            onChange={onChange("species")}
                            placeholder="e.g., Sanguineus"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-700">
                            Ecoregion
                        </label>
                        <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                            value={filters.ecoregion ?? ""}
                            onChange={onChange("ecoregion")}
                            placeholder="e.g., Atlantic Forest"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </section>
    );
}
