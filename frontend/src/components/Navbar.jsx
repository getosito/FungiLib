export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/10">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🍄</span>
                    <span className="font-semibold tracking-wide text-zinc-900">FungiLib</span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-zinc-600">
                    <a className="hover:text-zinc-900" href="#definitions">Definitions</a>
                    <a className="hover:text-zinc-900" href="#about">About</a>
                    <a className="hover:text-zinc-900" href="#communities">Communities</a>
                    <a className="hover:text-zinc-900" href="#forage">Forage</a>
                    <a className="hover:text-zinc-900" href="#learn">Learn</a>
                </div>
            </nav>
        </header>
    );
}
