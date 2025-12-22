function toImg(rawValue) {
    if (!rawValue) return "";
    let s = String(rawValue).trim().replaceAll("\\", "/");
    s = s.replace(/^\.?\//, "");            // quita ./ o /
    s = s.replace(/^docs\/images\//, "images/"); // docs/images -> images
    if (!s.includes("/")) s = `images/${s}`;
    return s.startsWith("/") ? s : `/${s}`;
}

export default function SpecimenCard({ item }) {
    const common = item?.taxonomy?.commonName ?? "Unknown";
    const sci = item?.taxonomy?.scientificName ?? "";
    const raw = item?.ecology?.images?.[0] ?? "";
    const img = toImg(raw);

    return (
        <article className="overflow-hidden rounded-2xl bg-white shadow-sm border border-black/10 hover:shadow-md transition">
            <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                {img ? (
                    <img
                        src={img}
                        alt={common}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="h-full w-full grid place-items-center text-sm text-zinc-400">
                        No image
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="font-semibold text-zinc-900">{common}</div>
                {sci && <div className="italic text-sm text-zinc-600">{sci}</div>}
            </div>
        </article>
    );
}

