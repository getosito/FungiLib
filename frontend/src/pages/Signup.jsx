import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function Signup() {
    const { lang, toggleLang, t } = useI18n();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
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
            await new Promise(r => setTimeout(r, 600));
        } catch (err) {
            setError("Could not create account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-56px)] bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[460px]">

                {/* ENG / ES toggle */}
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        onClick={toggleLang}
                        className="nav__iconBtn"
                    >
                        {lang === "en" ? "ES" : "EN"}
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">{t.signup.title}</h1>
                    <p className="text-white/70 mt-1">
                        {t.signup.subtitle}
                    </p>
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
                            <p className="mt-2 text-xs text-white/45">
                                {t.signup.pwHint}
                            </p>
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

                <p className="mt-4 text-xs text-white/45">
                    {t.signup.fine}
                </p>
            </div>
        </main>
    );
}
