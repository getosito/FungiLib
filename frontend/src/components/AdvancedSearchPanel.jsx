import "./AdvancedSearchPanel.css";

export default function AdvancedSearchPanel({ open, filters, setFilters, onApply, onReset }) {
    return (
        <div className={`adv ${open ? "adv--open" : ""}`}>
            <div className="adv__inner">
                <div className="adv__grid">
                    <label>
                        Division
                        <input
                            value={filters.division || ""}
                            onChange={(e) => setFilters((f) => ({ ...f, division: e.target.value }))}
                        />
                    </label>
                    <label>
                        Family
                        <input
                            value={filters.family || ""}
                            onChange={(e) => setFilters((f) => ({ ...f, family: e.target.value }))}
                        />
                    </label>
                    <label>
                        Genus
                        <input
                            value={filters.genus || ""}
                            onChange={(e) => setFilters((f) => ({ ...f, genus: e.target.value }))}
                        />
                    </label>
                    <label>
                        Ecoregion
                        <input
                            value={filters.ecoregion || ""}
                            onChange={(e) => setFilters((f) => ({ ...f, ecoregion: e.target.value }))}
                        />
                    </label>
                </div>

                <div className="adv__actions">
                    <button onClick={onReset} className="adv__btn adv__btn--ghost">
                        Reset
                    </button>
                    <button onClick={onApply} className="adv__btn adv__btn--solid">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

