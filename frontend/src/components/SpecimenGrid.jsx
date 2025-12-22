import SpecimenCard from "./SpecimenCard";

export default function SpecimenGrid({ items }) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-center text-sm tracking-[0.3em] text-zinc-700 font-semibold">
                FEATURED SPECIMENS
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item, idx) => (
                    <SpecimenCard
                        key={item?.identification?.primaryKey ?? item?.id ?? idx}
                        item={item}
                    />
                ))}
            </div>
        </section>
    );
}

