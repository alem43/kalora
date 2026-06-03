import Navbar from '#/components/Navbar'
import { api, type InsightsResponse } from '#/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/insights')({
  component: RouteComponent,
})

function RouteComponent() {
  const [data, setData] = useState<InsightsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.food
      .insights()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">This Week</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !data ? (
          <p className="text-destructive">Failed to load insights.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Low-protein breakfasts',
                  value: data.stats.lowProteinBreakfasts,
                },
                { label: 'Late-night meals', value: data.stats.lateNightMeals },
                {
                  label: 'Avg daily protein',
                  value: `${data.stats.avgDailyProtein}g`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border p-3 text-center"
                >
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">📈 Weekly Insights</h2>
              {data.insights.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No patterns yet. Log more meals.
                </p>
              ) : (
                data.insights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start rounded-xl border p-3 text-sm"
                  >
                    <span>⚠️</span>
                    <span>{insight}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
