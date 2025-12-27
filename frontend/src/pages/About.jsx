import Layout from "../components/Layout";

export default function About() {
    return (
        <Layout>
            <h1 style={{ margin: "0 0 10px 0" }}>About FungiLib</h1>

            <p style={{ color: "#444" }}>
                FungiLib is a digital catalog for fungal specimens studied and collected by the Mycology Laboratory
                (FACEN – UNA). The platform replaces paper-based fungi records with a searchable database that
                supports taxonomy, ecology, collection metadata, and internal lab observations.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                <Card title="Main goals">
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                        <li>Centralize specimen records in a digital system.</li>
                        <li>Enable fast browsing and search for students and researchers.</li>
                        <li>Support editing and management using role-based access.</li>
                    </ul>
                </Card>

                <Card title="What’s included">
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                        <li>Taxonomy fields (division → species).</li>
                        <li>Ecology and locality data (ecoregion, GPS, images).</li>
                        <li>Collection metadata and lab observations (admin-only).</li>
                    </ul>
                </Card>
            </div>
        </Layout>
    );
}

function Card({ title, children }) {
    return (
        <section style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fff" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{title}</h3>
            {children}
        </section>
    );
}
