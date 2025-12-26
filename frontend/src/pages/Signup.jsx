import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function Signup() {
    const { lang, toggleLang, t } = useI18n();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [showPw, setShowPw] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        
        // --- SIMULATION SIGNUP ---
        // 1. Pretend to check passwords
        if (pw !== pw2) {
            alert("Passwords do not match!");
            return;
        }

        // 2. Pretend to create account
        console.log("Creating simulation account for:", email);
        alert("✅ Account created successfully! (Simulation)\nPlease log in with your new account.");
        
        // 3. Send to Login Page
        navigate("/login");
    };

    return (
        <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[460px]">

                {/* ENG / ES toggle */}
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        onClick={toggleLang}
                        className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm font-bold"
                    >
                        {lang === "en" ? "ES" : "EN"}
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">{t.signup?.title || "Create Account"}</h1>
                    <p className="text-white/70 mt-1">{t.signup?.subtitle || "Join the community"}</p>
                </div>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs tracking-widest text-white/70 uppercase font-bold">Name</label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-black/60 transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-white/70 uppercase font-bold">Email</label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-black/60 transition"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-white/70 uppercase font-bold">Password</label>
                            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 focus-within:border-emerald-500/50 focus-within:bg-black/60 transition">
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
                                    className="text-xs tracking-widest text-white/60 hover:text-white uppercase font-bold"
                                    onClick={() => setShowPw((v) => !v)}
                                >
                                    {showPw ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-white/70 uppercase font-bold">Confirm Password</label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-black/60 transition"
                                type={showPw ? "text" : "password"}
                                value={pw2}
                                onChange={(e) => setPw2(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>

                        <button
                            className="w-full rounded-xl bg-white text-black py-3 font-bold hover:bg-gray-200 transition transform active:scale-[0.98]"
                            type="submit"
                        >
                            {t.signup?.signupBtn || "Sign Up"}
                        </button>

                        <div className="pt-2 text-sm text-white/70 text-center">
                            Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-bold ml-1">Log in</Link>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}