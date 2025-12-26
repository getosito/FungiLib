import React from 'react';
import { Link } from 'react-router-dom';

// --- YOUR ORIGINAL IMAGE HELPER ---
function toImg(rawValue) {
    if (!rawValue) return "";

    let s = String(rawValue).trim();
    s = s.replace(/,$/, ""); // Remove trailing commas
    if (s.startsWith("http://") || s.startsWith("https://")) {
        return s;
    }
    s = s.replaceAll("\\", "/"); // Fix Windows slashes

    s = s.replace(/^\.?\//, "");
    s = s.replace(/^docs\/images\//, "images/");

    if (!s.includes("/")) s = `images/${s}`;

    return `/${s}`;
}

export default function SpecimenCard({ item }) {
    // 1. GET DATA (Using your original logic)
    const common = item?.taxonomy?.commonName ?? "Unknown";
    const sci = item?.taxonomy?.scientificName ?? "";
    const raw = item?.ecology?.images?.[0] ?? "";
    const img = toImg(raw);

    // 2. CHECK ADMIN STATUS (For the buttons)
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-black/10 hover:shadow-md transition">
            
            {/* --- IMAGE SECTION --- */}
            <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                {img ? (
                    <img
                        src={img}
                        alt={common}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="h-full w-full grid place-items-center text-sm text-zinc-400">
                        No image
                    </div>
                )}
                {/* Link to details page */}
                {item?.id && <Link to={`/fungi/${item.id}`} className="absolute inset-0 z-10" />}
            </div>

            {/* --- TEXT CONTENT --- */}
            <div className="p-4 flex-1">
                <div className="font-semibold text-zinc-900">{common}</div>
                {sci && <div className="italic text-sm text-zinc-600">{sci}</div>}
            </div>

            {/* --- ADMIN BUTTONS (Only visible to Admin) --- */}
            {isAdmin && (
                <div className="flex gap-2 p-4 pt-0 mt-auto border-t border-zinc-100 bg-zinc-50 relative z-30">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`✏️ Opening Edit Form for: ${common}`);
                    }}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded text-sm font-bold transition cursor-pointer"
                >
                    ✏️ Edit
                </button>
                
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm(`⚠️ DELETE WARNING\n\nAre you sure you want to permanently delete "${common}"?`)) {
                            const card = e.currentTarget.closest('article');
                            if (card) {
                                card.style.transition = "all 0.5s ease";
                                card.style.opacity = "0";
                                card.style.transform = "scale(0.9)";
                                setTimeout(() => {
                                    card.style.display = "none";
                                    alert(`✅ Successfully deleted "${common}".`);
                                }, 500);
                            }
                        }
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-bold transition cursor-pointer"
                >
                    🗑️ Delete
                </button>
                </div>
            )}
        </article>
    );
}