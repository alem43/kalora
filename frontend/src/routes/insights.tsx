import Navbar from '#/components/Navbar'
import { api, type InsightsResponse } from '#/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

export const Route = createFileRoute('/insights')({
  component: RouteComponent,
})

type Pattern = InsightsResponse['patterns'][0]

const PATTERN_META: Record<string, { icon: string; positiveMessage: string }> =
  {
    late_calories: {
      icon: '🌙',
      positiveMessage: "You're not over-relying on late-night calories.",
    },
    low_breakfast_protein: {
      icon: '🥚',
      positiveMessage: 'Your breakfast protein intake looks good.',
    },
    weekend_calories: {
      icon: '📅',
      positiveMessage: 'Your calorie intake is consistent across the week.',
    },
  }

function PatternCard({ pattern }: { pattern: Pattern }) {
  const meta = PATTERN_META[pattern.id]
  const icon = meta?.icon ?? '📌'

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        pattern.detected
          ? 'border-amber-500/40 bg-amber-500/5'
          : 'border-border bg-muted/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={`font-medium text-sm leading-snug ${
              pattern.detected ? '' : 'text-muted-foreground'
            }`}
          >
            {pattern.detected
              ? pattern.message
              : (meta?.positiveMessage ?? 'No pattern detected')}
          </p>
          <p className="text-xs text-muted-foreground">{pattern.detail}</p>
        </div>
        <span className="shrink-0 text-sm">
          {pattern.detected ? '⚠️' : '✅'}
        </span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border p-4 animate-pulse">
      <div className="flex gap-3 items-center">
        <div className="h-6 w-6 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  const [data, setData] = useState<InsightsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.food
      .insights()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const hasEnoughData = (data?.dataRange.totalLogs ?? 0) >= 5
  const detectedCount = data?.patterns.filter((p) => p.detected).length ?? 0

  return (
    <>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load insights.</p>
        ) : !hasEnoughData ? (
          <div className="rounded-xl border p-6 text-center space-y-2">
            <p className="text-3xl">📊</p>
            <p className="font-semibold">Not enough data yet</p>
            <p className="text-sm text-muted-foreground">
              Log at least 5 meals to start seeing patterns.
              {data && data.dataRange.totalLogs > 0
                ? ` You have ${data.dataRange.totalLogs} log${
                    data.dataRange.totalLogs === 1 ? '' : 's'
                  } in the last 30 days.`
                : ''}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {detectedCount === 0
                ? 'No patterns detected — your habits look solid.'
                : `${detectedCount} pattern${detectedCount !== 1 ? 's' : ''} detected in your eating habits.`}
            </p>
            <div className="space-y-3">
              {data!.patterns.map((pattern) => (
                <PatternCard key={pattern.id} pattern={pattern} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Based on {data!.dataRange.totalLogs} meal log
              {data!.dataRange.totalLogs !== 1 ? 's' : ''} over the last 30 days
            </p>
          </>
        )}
      </div>
    </>
  )
}
