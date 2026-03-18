import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/config/app-url";
import { Layout } from "@/components/layout/layout";
import { Card } from "@/components/ui/card";

type PageProps = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { sent, error } = await searchParams;

  async function sendMagicLink(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email) {
      redirect("/login?error=1");
    }

    const supabase = await createClient();
    const appUrl = getAppUrl();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error("login signInWithOtp error", error);
      redirect("/login?error=1");
    }

    redirect("/login?sent=1");
  }

  return (
    <Layout>
      <div className="page-stack" style={{ maxWidth: 760, margin: "0 auto" }}>
        <section>
          <h1 className="page-title">Kirjaudu sisään</h1>
          <p className="page-lead">
            Saat kirjautumislinkin sähköpostiisi. Linkkiä klikkaamalla pääset
            suoraan sovellukseen.
          </p>
        </section>

        {sent === "1" ? (
          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Kirjautumislinkki lähetetty</h2>
            <p className="section-lead">
              Tarkista sähköpostisi ja avaa saapunut magic link.
            </p>
          </Card>
        ) : null}

        {error === "1" ? (
          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Kirjautuminen ei onnistunut</h2>
            <p className="section-lead">
              Tarkista sähköpostiosoite ja yritä uudelleen.
            </p>
          </Card>
        ) : null}

        <div className="ui-grid cols-2">
          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Magic link</h2>
            <p className="section-lead">
              Syötä sähköpostiosoite ja lähetä kirjautumislinkki.
            </p>

            <form action={sendMagicLink} style={{ marginTop: 18, display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontWeight: 600 }}>Sähköposti</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="esim. nimi@email.com"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="ui-actions">
                <button
                  type="submit"
                  className="ui-button-link primary"
                  style={{ cursor: "pointer" }}
                >
                  Lähetä kirjautumislinkki
                </button>
              </div>
            </form>
          </Card>

          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Demo-ohje</h2>
            <p className="section-lead">
              Jos testaat sovellusta ensimmäistä kertaa, tämä on helpoin tapa:
            </p>

            <div className="ui-meta" style={{ marginTop: 14, display: "grid", gap: 10, lineHeight: 1.7 }}>
              <div>1. Syötä sähköpostiosoite</div>
              <div>2. Avaa sähköpostiin tullut magic link</div>
              <div>3. Siirry Etusivulle ja avaa rakennus</div>
              <div>4. Kokeile järjestelmiä, irtaimistoa, dokumentteja ja QR-koodia</div>
            </div>

            <div className="ui-meta" style={{ marginTop: 18 }}>
              Etkö halua kirjautua juuri nyt?{" "}
              <Link href="/" style={{ textDecoration: "underline" }}>
                Palaa aloitussivulle
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
