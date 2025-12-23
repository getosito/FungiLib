import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
                {children}
            </main>
        </>
    );
}
