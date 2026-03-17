import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string | number;
  accent?: "default" | "danger";
}) {
  const color = accent === "danger" ? "#b91c1c" : "#111827";

  return (
    <Card compact>
      <div className="ui-meta">{label}</div>
      <div style={{ marginTop: 10, fontSize: 30, fontWeight: 700, color }}>
        {value}
      </div>
    </Card>
  );
}
