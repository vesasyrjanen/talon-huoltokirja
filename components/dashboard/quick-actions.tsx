import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

export function QuickActions() {
  return (
    <Card>
      <h2 className="section-title" style={{ fontSize: 20 }}>Pikatoiminnot</h2>
      <p className="section-lead">Nopeat siirtymät yleisimpiin toimintoihin.</p>

      <div className="ui-actions" style={{ marginTop: 16 }}>
        <ButtonLink href="/houses/new" variant="primary">
          Lisää talo
        </ButtonLink>

        <ButtonLink href="/dashboard">
          Päivitä näkymä
        </ButtonLink>
      </div>
    </Card>
  );
}
