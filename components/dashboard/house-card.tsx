import Link from "next/link";

export function HouseCard({
  house,
}: {
  house: { id: string; name: string };
}) {
  return (
    <Link
      href={`/houses/${house.id}`}
      className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-lg font-semibold">{house.name}</h3>
      <div className="mt-4 text-sm font-medium text-neutral-800">
        Avaa talo →
      </div>
    </Link>
  );
}
