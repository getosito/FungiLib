import Layout from "../components/Layout";

export default function Definitions() {
    return (
        <Layout>
            <h1 style={{ margin: "0 0 10px 0" }}>Definitions</h1>
            <p style={{ color: "#444", marginTop: 0 }}>
                Quick glossary for basic mycology terms used in FungiLib.
            </p>

            <Glossary
                items={[
                    {
                        term: "Specimen",
                        def: "A collected fungal sample stored and described for study.",
                    },
                    {
                        term: "Taxonomy",
                        def: "The scientific classification system (division, class, order, family, genus, species).",
                    },
                    {
                        term: "Ecoregion",
                        def: "A geographic area defined by its ecology and environmental conditions.",
                    },
                    {
                        term: "Basidiocarp",
                        def: "The fruiting body of basidiomycete fungi (often the visible ‘mushroom’).",
                    },
                    {
                        term: "Culture collection number",
                        def: "A lab reference ID for isolated cultures stored in the laboratory.",
                    },
                ]}
            />
        </Layout>
    );
}

function Glossary({ items }) {
    return (
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {items.map((x) => (
                <div
                    key={x.term}
                    style={{
                        border: "1px solid #eee",
                        borderRadius: 14,
                        padding: 14,
                        background: "#fff",
                    }}
                >
                    <div style={{ fontWeight: 800 }}>{x.term}</div>
                    <div style={{ color: "#444", marginTop: 6 }}>{x.def}</div>
                </div>
            ))}
        </div>
    );
}
