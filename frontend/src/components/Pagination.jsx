export default function Pagination({
    page,
    totalPages,
    onPageChange,
    maxButtons = 7,
}) {
    if (totalPages <= 1) return null;

    const clamp = (n) => Math.max(1, Math.min(totalPages, n));
    const go = (p) => onPageChange(clamp(p));

    const getButtons = () => {
        // Always show: 1 ... middle ... last
        const buttons = new Set([1, totalPages, page]);

        const half = Math.floor(maxButtons / 2);
        for (let i = 1; i <= half; i++) {
            buttons.add(page - i);
            buttons.add(page + i);
        }

        const arr = Array.from(buttons)
            .filter((n) => n >= 1 && n <= totalPages)
            .sort((a, b) => a - b);

        // Insert ellipsis markers
        const out = [];
        for (let i = 0; i < arr.length; i++) {
            const cur = arr[i];
            const prev = arr[i - 1];
            if (i > 0 && cur - prev > 1) out.push("…");
            out.push(cur);
        }
        return out;
    };

    const buttons = getButtons();

    return (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                className="nav__btn"
                onClick={() => go(page - 1)}
                disabled={page <= 1}
                style={{ opacity: page <= 1 ? 0.5 : 1 }}
            >
                ← Previous
            </button>

            {buttons.map((b, idx) =>
                b === "…" ? (
                    <span key={`e-${idx}`} className="px-2 text-zinc-500">
                        …
                    </span>
                ) : (
                    <button
                        key={b}
                        type="button"
                        className="nav__btn"
                        onClick={() => go(b)}
                        aria-current={b === page ? "page" : undefined}
                        style={
                            b === page
                                ? { borderColor: "rgba(255,255,255,0.55)" }
                                : undefined
                        }
                    >
                        {b}
                    </button>
                )
            )}

            <button
                type="button"
                className="nav__btn"
                onClick={() => go(page + 1)}
                disabled={page >= totalPages}
                style={{ opacity: page >= totalPages ? 0.5 : 1 }}
            >
                Next →
            </button>
        </div>
    );
}
