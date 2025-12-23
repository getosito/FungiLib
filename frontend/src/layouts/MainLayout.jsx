import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // ajusta la ruta si tu Navbar está en otro lugar

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
            <Navbar />
            <Outlet />
        </div>
    );
}
