import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider.jsx";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Signup() {
    const { lang, toggleLang, t } = useI18n();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e) {
        e.preventDefault();

       
        console.log("SUBMIT FIRED", { name, email });

        setError("");

        if (pw !== pw2) {
            setError(t.signup.errMismatch);
            return;
        }
        if (pw.length < 6) {
            setError(t.signup.errShort);
            return;
        }

        setLoading(true);
        try {
           
            console.log("Creating user in Firebase Auth...");
            const cred = await createUserWithEmailAndPassword(auth, email, pw);
            console.log("User created", { uid: cred.user.uid, email: cred.user.email });

            
            const displayName = name.trim();
            if (displayName) {
                console.log("Updating profile displayName...");
                await updateProfile(cred.user, { displayName });
                console.log("Profile updated");
            }

            
            console.log("Refreshing token (getIdToken(true))...");
            const token = await cred.user.getIdToken(true);
            console.log("Token refreshed", token ? "(token received)" : "(no token)");

           
            console.log("Calling backend /api/auth/onboard ...");
            const onboardRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/onboard`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ displayName }),
                }
            );

            const onboardData = await onboardRes.json().catch(() => ({}));
            console.log("Onboard response:", onboardRes.status, onboardData);

            if (!onboardRes.ok) {
                throw new Error(onboardData?.error || "Onboard failed");
            }

            
            console.log("Calling backend /api/auth/me ...");
            const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const me = await meRes.json().catch(() => ({}));
            console.log("ME response:", meRes.status, me);

            console.log("Signed up as:", me?.role || "viewer");

           
            if (me?.role === "admin") navigate("/admin");
            else navigate("/dashboard");
        } catch (err) {
            // DEBUG: error real
            console.error("SIGNUP ERROR FULL:", err);
            alert(`${err?.code || "no-code"} - ${err?.message || "no-message"}`);

            const code = err?.code || "";
            if (code === "auth/email-already-in-use")
                setError(t.signup.errEmailInUse || "Email already in use");
            else if (code === "auth/invalid-email")
                setError(t.signup.errInvalidEmail || "Invalid email");
            else if (code === "auth/weak-password")
                setError(t.signup.errWeakPw || "Password too weak (min 6 chars)");
            else if (code === "auth/operation-not-allowed")
                setError("Email/Password sign-in is disabled in Firebase Console.");
            else if (code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.")
                setError("Invalid Firebase API key. Check frontend .env and restart Vite.");
            else setError(err?.message || "Could not create account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-56px)] bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[460px]">
                {/* ENG / ES toggle */}
                <div className="flex justify-end mb-2">
                    <button type="button" onClick={toggleLang} className="nav__iconBtn">
                        {lang === "en" ? "ES" : "EN"}
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">{t.signup.title}</h1>
                    <p className="text-white/70 mt-1">{t.signup.subtitle}</p>
                </div>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs tracking-widest text-white/70">
                                {t.signup.nameLabel}
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/25"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.signup.namePlaceholder}
                            />
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-white/70">
                                {t.signup.emailLabel}
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/25"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.signup.emailPlaceholder}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-white/70">
                                {t.signup.passwordLabel}
                            </label>
                            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 focus-within:border-white/25">
                                <input
                                    className="w-full bg-transparent outline-none"
                                    type={showPw ? "text" : "password"}
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    placeholder="******"
                                    required
                                />
                                <button
                                    type="button"
                                    className="text-xs tracking-widest text-white/60 hover:text-white"
                                    onClick={() => setShowPw((v) => !v)}
                                >
                                    {showPw ? t.signup.hide : t.signup.show}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-white/45">{t.signup.pwHint}</p>
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-white/70">
                                {t.signup.confirmLabel}
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/25"
                                type={showPw ? "text" : "password"}
                                value={pw2}
                                onChange={(e) => setPw2(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full rounded-xl bg-white text-black py-3 font-medium hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                        >
                            {loading ? "Creating account..." : t.signup.signupBtn}
                        </button>

                        <div className="pt-2 text-sm text-white/70">
                            {t.signup.haveAccount}{" "}
                            <Link to="/login" className="text-white hover:underline">
                                {t.signup.loginLink}
                            </Link>
                        </div>
                    </form>
                </section>

                <p className="mt-4 text-xs text-white/45">{t.signup.fine}</p>
            </div>
        </main>
    );
}
