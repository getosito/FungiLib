import Layout from "../components/Layout";

export default function Forage() {
    return (
        <Layout>
            <h1 style={{ margin: "0 0 10px 0" }}>Forage</h1>
            <p style={{ color: "#444" }}>
                Field notes and collection guidance. This page can later include a checklist for specimen collection,
                photo requirements, and safety notes.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                <Card title="Basic field checklist">
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                        <li>Photograph specimen in context (substrate, surroundings).</li>
                        <li>Record GPS coordinates or approximate location.</li>
                        <li>Note substrate (wood, soil, leaf litter, living tree, etc.).</li>
                        <li>Store specimen in paper (avoid plastic if humid).</li>
                    </ul>
                </Card>

                <Card title="Data to record">
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                        <li>Collection number</li>
                        <li>Date and collector</li>
                        <li>Ecoregion</li>
                        <li>Any lab culture reference (if applicable)</li>
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
