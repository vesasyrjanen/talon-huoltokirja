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
  const isEdit = Boolean(item)

  return (
    <form action={action} className="ui-card" style={{ display: 'grid', gap: 20 }}>
      <input type="hidden" name="houseId" value={houseId} />
      {item ? <input type="hidden" name="itemId" value={item.id} /> : null}

      <section style={{ display: 'grid', gap: 14 }}>
        <div>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 6 }}>
            {isEdit ? 'Irtaimiston tiedot' : 'Perustiedot'}
          </h2>
          <p className="section-lead">
            {isEdit
              ? 'Päivitä kohteen perustiedot alle.'
              : 'Aloita nimellä ja lisää sen jälkeen muut tiedot tarpeen mukaan.'}
          </p>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Nimi</label>
          <input
            name="name"
            defaultValue={item?.name ?? ""}
            required
            className="w-full rounded-lg border px-3 py-2"
            placeholder="esim. Bosch porakone, Husqvarna-ruohonleikkuri"
          />
          <div className="ui-meta">Anna nimi, jolla löydät kohteen helposti myöhemmin.</div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Kategoria</label>
          <input
            name="category"
            defaultValue={item?.category ?? ""}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="esim. Työkalu, Kodinkone, Elektroniikka, Kone"
          />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <div>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 6 }}>
            Tunnistetiedot
          </h2>
          <p className="section-lead">Nämä auttavat huolloissa, takuissa ja dokumenteissa.</p>
        </div>

        <div className="ui-grid cols-2">
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Merkki</label>
            <input
              name="brand"
              defaultValue={item?.brand ?? ""}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="esim. Bosch"
            />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Malli</label>
            <input
              name="model"
              defaultValue={item?.model ?? ""}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="esim. GSB 18V-55"
            />
          </div>
        </div>

        <div className="ui-grid cols-2">
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Sarjanumero</label>
            <input
              name="serialNumber"
              defaultValue={item?.serial_number ?? ""}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="esim. 123456789"
            />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Sijainti</label>
            <input
              name="location"
              defaultValue={item?.location ?? ""}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="esim. Varasto, autotalli, tekninen tila"
            />
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <div>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 6 }}>
            Hankintatiedot
          </h2>
          <p className="section-lead">Voit jättää nämä tyhjiksi ja täydentää myöhemmin.</p>
        </div>

        <div className="ui-grid cols-2">
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Ostopäivä</label>
            <input
              type="date"
              name="purchaseDate"
              defaultValue={item?.purchase_date ?? ""}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Ostohinta</label>
            <input
              name="purchasePrice"
              defaultValue={item?.purchase_price ?? ""}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="esim. 1299.90"
            />
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 8 }}>
        <div>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 6 }}>
            Muistiinpanot
          </h2>
          <p className="section-lead">Kirjaa tähän esimerkiksi kunto, lisätiedot tai huomiot.</p>
        </div>

        <textarea
          name="notes"
          defaultValue={item?.notes ?? ""}
          className="min-h-32 w-full rounded-lg border px-3 py-2"
          placeholder="esim. mukana alkuperäinen laatikko ja käyttöohje"
        />
      </section>

      {item ? (
        <div className="ui-card compact" style={{ background: '#fafafa' }}>
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
        </div>
      ) : null}

      <div className="ui-actions">
        <button className="ui-button-link primary" style={{ cursor: 'pointer' }}>
          {item ? "Tallenna muutokset" : "Tallenna irtaimisto"}
        </button>
      </div>
    </form>
  )
}
