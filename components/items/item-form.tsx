type ItemFormProps = {
  action: any
  houseId: string
  item?: {
    id: string
    name: string
    category: string | null
    brand: string | null
    model: string | null
    serial_number: string | null
    location: string | null
    purchase_date: string | null
    purchase_price: number | null
    notes: string | null
    archived: boolean
  } | null
}

export function ItemForm({ action, houseId, item }: ItemFormProps) {
  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
      <input type="hidden" name="houseId" value={houseId} />
      {item ? <input type="hidden" name="itemId" value={item.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Nimi</label>
        <input
          name="name"
          defaultValue={item?.name ?? ""}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Kategoria</label>
        <input
          name="category"
          defaultValue={item?.category ?? ""}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <button className="rounded-lg bg-black px-4 py-2 text-white">
        {item ? "Tallenna muutokset" : "Luo irtaimisto"}
      </button>
    </form>
  )
}
