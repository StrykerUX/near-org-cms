"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent } from "@cms/components/ui/card";
import RankedBarList from "./RankedBarList";

interface AnalyticsData {
  rolling: { last24h: number; last7d: number; last30d: number };
  timeseries: { date: string; clicks: number }[];
  topLinks: { linkId: string; title: string; clicks: number }[];
  topUtmSources: { source: string; clicks: number }[];
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-primary">clicks: {payload[0].value}</p>
    </div>
  );
}

export default function LinktreeAnalyticsClient({
  linktreeId,
  linktreeName,
  embedded = false,
}: {
  linktreeId: string;
  linktreeName: string;
  /** When true, skips the back-link/title header (used inline as a tab on the edit page itself). */
  embedded?: boolean;
}) {
  const [range, setRange] = useState<"7" | "30" | "90">("30");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/linktrees/${linktreeId}/analytics?range=${range}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [linktreeId, range]);

  return (
    <div className="space-y-6">
      {!embedded && (
        <div className="flex items-center gap-3">
          <Link href={`/admin/linktrees/${linktreeId}/edit`} className="text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{linktreeName} — Analytics</h1>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {(["7", "30", "90"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              range === r
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {r} days
          </button>
        ))}
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Last 24h</p>
                <p className="text-2xl font-bold mt-1">{data.rolling.last24h}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Last 7 days</p>
                <p className="text-2xl font-bold mt-1">{data.rolling.last7d}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Last 30 days</p>
                <p className="text-2xl font-bold mt-1">{data.rolling.last30d}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Clicks over time
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.timeseries}>
                  <defs>
                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border)" }} />
                  <Area type="monotone" dataKey="clicks" stroke="var(--color-primary)" fill="url(#clicksGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <RankedBarList
              title="Top links"
              items={data.topLinks.map((l) => ({ label: l.title, value: l.clicks }))}
            />
            <RankedBarList
              title="Top UTM sources"
              items={data.topUtmSources.map((s) => ({ label: s.source, value: s.clicks }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
