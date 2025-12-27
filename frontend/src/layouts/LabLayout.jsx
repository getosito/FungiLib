import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const LabUIContext = createContext(null);

export function useLabUI() {
    const ctx = useContext(LabUIContext);
    if (!ctx) throw new Error("useLabUI must be used within LabLayout");
    return ctx;
}

function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
}

export default function LabLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const SIDEBAR_W = collapsed ? 76 : 260;

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setReady(true);
            if (!u) navigate("/login");
        });
        return () => unsub();
    }, [navigate]);

    useEffect(() => {
        const shouldOpen = sessionStorage.getItem("lab_autodrawer") === "1";
        if (shouldOpen) {
            setDrawerOpen(true);
            sessionStorage.removeItem("lab_autodrawer");
        }
    }, []);

    useEffect(() => {

        if (isMobile()) setDrawerOpen(false);
    }, [location.pathname]);

    const toggleDrawer = () => {
        if (isMobile()) {
            setDrawerOpen((v) => !v);
        } else {
            setCollapsed((v) => !v);
        }
    };

    const closeDrawer = () => setDrawerOpen(false);

    const value = useMemo(
        () => ({
            drawerOpen,
            toggleDrawer,
            closeDrawer,
            setDrawerOpen,
            collapsed,
            setCollapsed,
        }),
        [drawerOpen, collapsed]
    );

    if (!ready) return null;
    if (!user) return null;

    return (
        <LabUIContext.Provider value={value}>
            <div className="min-h-screen bg-white text-zinc-900">
                <div className="flex">
                    {/* Backdrop for mobile drawer */}
                    {drawerOpen && (
                        <button
                            type="button"
                            aria-label="Close lab menu"
                            onClick={closeDrawer}
                            className="fixed inset-0 z-30 bg-black/40 md:hidden"
                        />
                    )}

                    {/* Sidebar */}
                    <aside
                        className={[
                            "z-40",
                            "fixed left-0 top-[60px] h-[calc(100vh-60px)] md:top-0 md:h-screen",
                            "bg-[#0f0f10] text-white border-r border-white/10",
                            "transition-transform duration-200",
                            drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                            "md:block",
                        ].join(" ")}
                        style={{ width: SIDEBAR_W }}
                        aria-label="Lab navigation"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between gap-2">
                                {!collapsed ? (
                                    <div className="text-xs font-semibold tracking-wider text-white/55">
                                        LAB WORKSPACE
                                    </div>
                                ) : (
                                    <div className="text-xs font-semibold text-white/55">LAB</div>
                                )}

                            </div>

                            <nav className="mt-4 flex flex-col gap-2">
                                <LabNavItem to="/lab" label="Dashboard" collapsed={collapsed} icon="🏠" />
                                <LabNavItem to="/lab/catalog" label="Catalog" collapsed={collapsed} icon="📚" />
                                <LabNavItem to="/lab/specimens" label="Specimens" collapsed={collapsed} icon="🧫" />
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main
                        className={[
                            "flex-1 min-h-screen",
                            "md:ml-0",
                            collapsed ? "md:pl-[76px]" : "md:pl-[260px]",
                            "pl-0",
                        ].join(" ")}
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        </LabUIContext.Provider>
    );
}

function LabNavItem({ to, label, collapsed, icon }) {
    return (
        <NavLink
            to={to}
            end={to === "/lab"}
            className={({ isActive }) =>
                [
                    "group flex items-center gap-3 rounded-xl",
                    collapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
                    "text-sm font-medium transition",
                    isActive
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/5 hover:text-white",
                ].join(" ")
            }
            title={collapsed ? label : undefined}
        >
            <span className="w-8 text-center">{icon}</span>
            {!collapsed && <span>{label}</span>}
        </NavLink>
    );
}
