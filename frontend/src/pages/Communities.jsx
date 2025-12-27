import Layout from "../components/Layout";

export default function Communities() {
    return (
        <Layout>
            <h1 style={{ margin: "0 0 10px 0" }}>Communities</h1>
            <p style={{ color: "#444" }}>
                This section will host community resources: student groups, local mycology initiatives, and links to
                external databases.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                <Card title="Student & Lab Community">
                    <p style={{ margin: 0, color: "#444" }}>
                        FACEN - UNA students and lab members can collaborate by keeping records consistent and complete.
                        (Later: add contact links, contribution guidelines, and form requests.)
                    </p>
                </Card>

                <Card title="External resources (suggested)">
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                        <li>GBIF (Global Biodiversity Information Facility)</li>
                        <li>Index Fungorum</li>
                        <li>MycoBank</li>
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
