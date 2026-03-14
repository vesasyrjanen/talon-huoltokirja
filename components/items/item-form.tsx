type ItemFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  houseId: string;
  item?: {
    id: string;
    name: string;
    category: string | null;
    brand: string | null;
    model: string | null;
    serial_number: string | null;
    location: string | null;
    purchase_date: string | null;
    purchase_price: number | null;
    notes: string | null;
    archived: boolean;
  } | null;
};

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
          placeholder="esim. Työkalu, Kodinkone, Elektroniikka"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Merkki</label>
          <input
            name="brand"
            defaultValue={item?.brand ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Malli</label>
          <input
            name="model"
            defaultValue={item?.model ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Sarjanumero</label>
          <input
            name="serialNumber"
            defaultValue={item?.serial_number ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Sijainti</label>
          <input
            name="location"
            defaultValue={item?.location ?? ""}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="esim. Varasto, autotalli, tekninen tila"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Ostopäivä</label>
          <input
            type="date"
            name="purchaseDate"
            defaultValue={item?.purchase_date ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ostohinta</label>
          <input
            name="purchasePrice"
            defaultValue={item?.purchase_price ?? ""}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="esim. 1299.90"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Muistiinpanot</label>
        <textarea
          name="notes"
          defaultValue={item?.notes ?? ""}
          className="min-h-32 w-full rounded-lg border px-3 py-2"
        />
      </div>

      {item ? (
        <div className="flex items-center gap-2">
          <input
            id="archived"
            type="checkbox"
            name="archived"
            value="true"
            defaultChecked={item.archived}
          />
          <label htmlFor="archived" className="text-sm">
            Arkistoitu
          </label>
        </div>
      ) : null}

      <button className="rounded-lg bg-black px-4 py-2 text-white">
        {item ? "Tallenna muutokset" : "Luo irtaimisto"}
      </button>
    </form>
  );
}
