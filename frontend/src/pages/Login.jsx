import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import "./auth.css";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function Login() {
    const { lang, toggleLang, t } = useI18n();
    const navigate = useNavigate(); // Hook to change pages

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [showPw, setShowPw] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        
        // --- EMERGENCY LOGIN LOGIC ---
        console.log("Simulating Login...");
        
        // 1. Create a fake "Logged In" user
        const fakeUser = {
            email: email,
            role: "admin", // Forces you to be an Admin
            uid: "manual-login-override",
            displayName: "Jonathan"
        };

        // 2. Save it to Local Storage (so the website remembers you)
        localStorage.setItem("user", JSON.stringify(fakeUser));
        localStorage.setItem("token", "fake-session-token-123"); 

        // 3. Redirect to the Home Page
        alert("Login Successful (Simulation)");
        window.location.href = "/"; // Force reload to apply changes
    };

    return (
        <main className="authPage">
            <div className="authWrap">

                {/* ENG/ES toggle */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                    <button
                        type="button"
                        onClick={toggleLang}
                        className="nav__iconBtn"
                        style={{ borderRadius: 12 }}
                        aria-label="Toggle language"
                    >
                        {lang === "en" ? "ES" : "EN"}
                    </button>
                </div>

                <h1 className="authTitle">{t.login.title}</h1>
                <p className="authSub">{t.login.subtitle}</p>

                <section className="authCard">
                    <form onSubmit={onSubmit}>
                        <label className="authLabel">{t.login.emailLabel}</label>
                        <input
                            className="authInput"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.login.emailPlaceholder}
                            required
                        />

                        <label className="authLabel">{t.login.passwordLabel}</label>
                        <div className="authPwWrap">
                            <input
                                className="authPwInput"
                                type={showPw ? "text" : "password"}
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                placeholder="******"
                                required
                            />
                            <button
                                type="button"
                                className="authToggle"
                                onClick={() => setShowPw((v) => !v)}
                            >
                                {showPw ? t.login.hide : t.login.show}
                            </button>
                        </div>

                        <button className="authBtn authBtnPrimary" type="submit">
                            {t.login.loginBtn}
                        </button>

                        <div className="authDivider">{t.login.or}</div>

                        <button className="authBtn authBtnGhost" type="button">
                            {t.login.googleBtn}
                        </button>

                        <div className="authFooter">
                            {t.login.noAccount} <Link to="/signup">{t.login.createOne}</Link>
                        </div>
                    </form>
                </section>

                <div className="mt-4 text-xs text-white/45">
                    {t.login.fine}
                </div>
            </div>
        </main>
    );
}