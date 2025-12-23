import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LANGS = ["en", "es"];

export default function Navbar() {
    const [lang, setLang] = useState("en");

    useEffect(() => {
        const saved = localStorage.getItem("lang");
        if (saved && LANGS.includes(saved)) setLang(saved);
    }, []);

    const t = useMemo(() => {
        const dict = {
            en: {
                definitions: "Definitions",
                about: "About",
                communities: "Communities",
                forage: "Forage",
                learn: "Learn",
                login: "Login",
                signup: "Sign up"
            },
            es: {
                definitions: "Definiciones",
                about: "Acerca de",
                communities: "Comunidades",
                forage: "Recoleccion",
                learn: "Aprender",
                login: "Ingresar",
                signup: "Registrarse"
            },
        };
        return dict[lang];
    }, [lang]);

    const toggleLang = () => {
        const next = lang === "en" ? "es" : "en";
        setLang(next);
        localStorage.setItem("lang", next);
    };

    return (
        <header className="nav">
            <div className="nav__left">
                <div className="nav__brand">
                    <img src="/logo.png" alt="FungiLib" className="nav__logo" />
                    <span className="nav__title">FungiLib</span>
                </div>

                <nav className="nav__links">
                    <a href="#definitions">{t.definitions}</a>
                    <a href="#about">{t.about}</a>
                    <a href="#communities">{t.communities}</a>
                    <a href="#forage">{t.forage}</a>
                    <a href="#learn">{t.learn}</a>
                </nav>
            </div>

            <div className="nav__right">
                <button
                    className="nav__iconBtn"
                    onClick={toggleLang}
                    title="Language"
                >
                    {lang.toUpperCase()}
                </button>

                <Link
                    to="/login"
                    className="nav__btn nav__btn--ghost"
                >
                    {t.login}
                </Link>

                <Link
                    to="/signup"
                    className="nav__btn nav__btn--solid"
                >
                    {t.signup}
                </Link>
            </div>
        </header>
    );
}