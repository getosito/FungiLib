import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider.jsx";
import { useLabUI } from "../layouts/LabLayout";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

function MenuIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function Navbar() {
    const { lang, toggleLang, t } = useI18n();
    const location = useLocation();
    const navigate = useNavigate();

    const isLabRoute = location.pathname.startsWith("/lab");
    const labUI = isLabRoute ? useLabUI() : null;

    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthReady(true);
        });
        return () => unsub();
    }, []);

    const onSignOut = async () => {
        await signOut(auth);
        navigate("/");
    };

    const nav = t?.nav || {};
    const labels = {
        definitions: nav.definitions || "DEFINITIONS",
        about: nav.about || "ABOUT",
        communities: nav.communities || "COMMUNITIES",
        forage: nav.forage || "FORAGE",
        learn: nav.learn || "LEARN",
        login: nav.login || "Login",
        signup: nav.signup || "Sign up",
        signout: nav.signout || "Sign out",
        myLab: nav.myLab || "My Laboratory",
    };

    return (
        <header className="nav">
            <div className="nav__left">
                {isLabRoute && labUI && (
                    <button
                        type="button"
                        onClick={labUI.toggleDrawer}
                        className="nav__iconBtn"
                        aria-label="Open lab menu"
                    >
                        <MenuIcon />
                    </button>
                )}

                <Link to="/" className="nav__brand">
                    <strong>FungiLib</strong>
                </Link>

                <nav className="nav__links">
                    <Link to="/definitions">{labels.definitions}</Link>
                    <Link to="/about">{labels.about}</Link>
                    <Link to="/communities">{labels.communities}</Link>
                    <Link to="/forage">{labels.forage}</Link>
                    <Link to="/learn">{labels.learn}</Link>
                </nav>
            </div>

            <div className="nav__right">
                <button
                    type="button"
                    onClick={toggleLang}
                    className="nav__iconBtn"
                    aria-label="Toggle language"
                >
                    {lang === "en" ? "ES" : "EN"}
                </button>

                {!authReady ? null : !user ? (
                    <>
                        <Link to="/login" className="nav__btn">
                            {labels.login}
                        </Link>
                        <Link to="/signup" className="nav__btn nav__btn--primary">
                            {labels.signup}
                        </Link>
                    </>
                ) : (
                    <>
                        {!isLabRoute && (
                            <Link to="/lab/catalog" className="nav__btn">
                                {labels.myLab}
                            </Link>
                        )}
                        <button
                            type="button"
                            className="nav__btn nav__btn--primary"
                            onClick={onSignOut}
                        >
                            {labels.signout}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
