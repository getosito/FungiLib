import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SiteLayout() {
    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />
            <Outlet />
        </div>
    );
}
