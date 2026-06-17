import Navbar from '#/components/Navbar'
import { api, type InsightsResponse } from '#/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

export const Route = createFileRoute('/insights')({
  component: RouteComponent,
})

type Pattern = InsightsResponse['patterns'][0]

const PATTERN_META: Record<
  string,
  { icon: JSX.Element; positiveMessage: string }
> = {
  late_calories: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    positiveMessage: "You're perfectly synced. No late-night metabolic debt.",
  },
  low_breakfast_protein: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    positiveMessage: 'Morning fuel is optimal. Protein intake is strong.',
  },
  weekend_calories: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    positiveMessage: 'Your circadian rhythm holds steady through the weekend.',
  },
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  const meta = PATTERN_META[pattern.id]

  // Default icon if not mapped
  const DefaultIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  )

  const isDetected = pattern.detected
  const icon = meta?.icon ?? DefaultIcon

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-300 border ${
        isDetected
          ? 'border-[#805033]/20 bg-white hover:border-[#805033]/50 hover:shadow-[0_8px_30px_rgba(128,80,51,0.08)]'
          : 'border-[#E2EEDB] bg-white hover:border-[#82B85A] hover:shadow-[0_8px_30px_rgba(130,184,90,0.08)]'
      }`}
    >
      {/* Subtle background glow based on state */}
      <div
        className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-20 transition-colors duration-500 ${isDetected ? 'bg-[#805033]' : 'bg-[#82B85A]'}`}
      ></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
        <div
          className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
            isDetected
              ? 'bg-[#805033]/10 text-[#805033]'
              : 'bg-[#F4F9F1] text-[#82B85A] group-hover:bg-[#82B85A] group-hover:text-white'
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3
              className={`font-extrabold text-lg md:text-xl ${isDetected ? 'text-[#805033]' : 'text-[#173A27]'}`}
            >
              {isDetected ? 'Pattern Detected' : 'Optimal Rhythm'}
            </h3>
            {isDetected ? (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#805033]/10 text-[#805033]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
            ) : (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4F9F1] text-[#82B85A]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            )}
          </div>
          <p className="font-semibold text-[#173A27] text-base leading-snug">
            {isDetected
              ? pattern.message
              : (meta?.positiveMessage ?? 'No deviations detected.')}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {pattern.detail}
          </p>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-[2rem] border border-[#E2EEDB] bg-white p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="h-14 w-14 rounded-2xl bg-[#F4F9F1] shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-center">
            <div className="h-5 w-1/3 rounded-lg bg-[#E2EEDB]" />
            <div className="h-8 w-8 rounded-full bg-[#F4F9F1]" />
          </div>
          <div className="h-4 w-3/4 rounded-lg bg-[#E2EEDB]" />
          <div className="h-3 w-1/2 rounded-lg bg-[#F4F9F1]" />
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
    <div className="min-h-screen bg-[#FAFCF8] text-[#173A27] font-sans selection:bg-[#82B85A]/30 selection:text-[#173A27] antialiased pb-24 relative overflow-hidden">
      {/* SUBTLE BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#82B85A]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10">
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>

        <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-32">
          <div className="mb-12 text-center sm:text-left">
            <p className="text-sm font-bold tracking-widest uppercase text-[#82B85A] mb-2">
              Metabolic Compass
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Your Insights
            </h1>
            <p className="text-lg text-gray-600">
              Decoding the rhythm of your last 30 days.
            </p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : error ? (
              <div className="bg-white rounded-[2rem] border border-red-200 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Connection Interrupted
                </h3>
                <p className="text-gray-500">
                  We couldn't retrieve your metabolic data. Please try again.
                </p>
              </div>
            ) : !hasEnoughData ? (
              <div className="bg-white rounded-[2rem] border border-[#E2EEDB] p-10 text-center shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4F9F1] rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F4F9F1] rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm">
                    <svg
                      className="w-10 h-10 text-[#82B85A]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-3">
                    Gathering Momentum
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed mb-6">
                    Log at least 5 meals to establish your baseline and start
                    seeing circadian patterns.
                  </p>
                  <div className="inline-flex items-center bg-[#F4F9F1] text-[#173A27] px-6 py-3 rounded-full font-bold text-sm border border-[#E2EEDB]">
                    {data && data.dataRange.totalLogs > 0
                      ? `${data.dataRange.totalLogs} log${data.dataRange.totalLogs === 1 ? '' : 's'} recorded out of 5 needed`
                      : '0 logs recorded. Time to start.'}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E2EEDB]">
                  <p className="text-base font-semibold text-gray-600">
                    {detectedCount === 0
                      ? 'Perfect symmetry. No disruptive patterns found.'
                      : `${detectedCount} area${detectedCount !== 1 ? 's' : ''} requiring your attention.`}
                  </p>
                  <div className="text-sm font-bold text-[#82B85A] bg-[#F4F9F1] px-4 py-1.5 rounded-full">
                    {data!.dataRange.totalLogs} meals logged
                  </div>
                </div>

                <div className="space-y-6">
                  {data!.patterns.map((pattern) => (
                    <PatternCard key={pattern.id} pattern={pattern} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
