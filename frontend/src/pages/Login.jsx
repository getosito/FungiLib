import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { useI18n } from "../i18n/I18nProvider.jsx";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

export default function Login() {
    const { lang, toggleLang, t } = useI18n();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [showPw, setShowPw] = useState(false);

    const [error, setError] = useState("");
    const [resetMsg, setResetMsg] = useState("");
    const [showSignupHint, setShowSignupHint] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/lab/catalog", { replace: true });
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResetMsg("");
        setShowSignupHint(false);

        try {
            const cred = await signInWithEmailAndPassword(auth, email, pw);

            const token = await cred.user.getIdToken(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch user role");

            const me = await res.json();
            localStorage.setItem("userRole", me.role);
            console.log("Logged in as:", me.role);

            // Open the lab drawer automatically on first landing after login
            sessionStorage.setItem("labDrawerOpenOnce", "1");

            navigate("/lab/catalog", { replace: true });
        } catch (err) {
            console.error("Firebase login error:", err?.code, err?.message, err);

            const code = err?.code || "";
            if (code === "auth/user-not-found") setError("User not found");
            else if (code === "auth/wrong-password") setError("Wrong password");
            else if (code === "auth/invalid-credential") setError("Invalid credentials");
            else if (code === "auth/too-many-requests") setError("Too many attempts. Try later.");
            else if (code === "auth/invalid-email") setError("Invalid email format");
            else setError(code || "Login failed");
        }
    };

    const onForgotPassword = async () => {
        setError("");
        setResetMsg("");
        setShowSignupHint(false);

        if (!email) {
            setError("Please enter your email first.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setResetMsg("Reset link sent!");
        } catch (err) {
            console.error("Password reset error:", err?.code, err?.message, err);

            const code = err?.code || "";
            if (code === "auth/user-not-found") {
                setResetMsg("No account exists with that email.");
                setShowSignupHint(true);
            } else if (code === "auth/invalid-email") {
                setError("Invalid email format.");
            } else if (code === "auth/too-many-requests") {
                setError("Too many attempts. Try later.");
            } else {
                setError("Could not send reset email. Please try again.");
            }
        }
    };

    return (
        <main className="authPage">
            <div className="authWrap">
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

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="authLinkBtn"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "rgba(255,255,255,0.75)",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    fontSize: 12,
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {error && (
                            <div style={{ color: "#ffb4b4", marginTop: 10, marginBottom: 10 }}>
                                {error}
                            </div>
                        )}

                        {resetMsg && (
                            <div style={{ color: "#b9f6c6", marginTop: 10, marginBottom: 10 }}>
                                {resetMsg}{" "}
                                {showSignupHint && (
                                    <>
                                        <Link to="/signup" style={{ textDecoration: "underline", color: "#b9f6c6" }}>
                                            Sign up here
                                        </Link>
                                        .
                                    </>
                                )}
                            </div>
                        )}

                        <button className="authBtn authBtnPrimary" type="submit">
                            {t.login.loginBtn}
                        </button>

                        <div className="authDivider">{t.login.or}</div>

                        <button className="authBtn authBtnGhost" type="button" disabled>
                            {t.login.googleBtn}
                        </button>

                        <div className="authFooter">
                            {t.login.noAccount} <Link to="/signup">{t.login.createOne}</Link>
                        </div>
                    </form>
                </section>

                <div className="mt-4 text-xs text-white/45">{t.login.fine}</div>
            </div>
        </main>
    );
}
