export default function Hero({ query, setQuery }) {
    return (
        <section className="bg-[#f4f1ec] border-b border-black/10">
            <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                <div className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-700">
                    MUSHROOMS & FUNGI
                </div>

                <div className="mt-8 flex items-center justify-center gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find some fungi..."
                        className="w-full max-w-md rounded-md border border-black/15 px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <button className="rounded-md border border-black/15 px-4 py-2 text-sm bg-white hover:bg-zinc-50">
                        Advanced Search
                    </button>
                </div>

                <div className="mt-10 mx-auto h-px w-48 bg-black/15" />
            </div>
        </section>
    );
}

