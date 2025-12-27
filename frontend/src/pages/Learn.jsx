import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Learn() {
    return (
        <Layout>
            <h1 style={{ margin: "0 0 10px 0" }}>Learn</h1>
            <p style={{ color: "#444" }}>
                Learning resources for taxonomy and specimen documentation.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                <Card title="How to read a specimen page">
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                        <li><b>Taxonomy</b>: classification fields and scientific name.</li>
                        <li><b>Ecology</b>: ecoregion + GPS + habitat-related notes.</li>
                        <li><b>Collection</b>: who collected it, when, and lab identifiers.</li>
                    </ul>
                </Card>

                <Card title="Try it now">
                    <p style={{ margin: 0, color: "#444" }}>
                        Go back to the catalog and open any specimen to see all sections.
                    </p>
                    <div style={{ marginTop: 10 }}>
                        <Link to="/" className="nav__btn">Open public catalog</Link>
                    </div>
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
