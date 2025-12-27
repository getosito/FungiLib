import Navbar from "../components/Navbar";

export default function LabDashboard() {
    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-8">
                <h1 className="text-xl font-semibold">Lab Dashboard</h1>
                <p className="mt-2 text-sm text-zinc-600">
                    Quick actions, stats, recent specimens, etc.
                </p>
            </div>
        </div>
    );
}
