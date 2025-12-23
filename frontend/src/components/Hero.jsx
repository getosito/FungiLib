import "./Hero.css";
export default function Hero({ query, setQuery, onAdvancedToggle }) {
    return (
        <section className="hero">
            <div className="hero__overlay" />
            <div className="hero__content">
                <h1 className="hero__title">MUSHROOMS &amp; FUNGI</h1>

                <div className="hero__searchRow">
                    <input
                        className="hero__input"
                        placeholder="Find some fungi..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="hero__advBtn" onClick={onAdvancedToggle}>
                        Advanced Search
                    </button>
                </div>

                <p className="hero__subtitle">
                    Digital Fungi Catalog studied and collected by the Mycology Laboratory of the
                    Faculty of Exact and Natural Sciences (FACEN - UNA)
                </p>
            </div>
        </section>
    );
}


