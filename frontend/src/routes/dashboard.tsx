import FoodLog from '#/components/FoodLog'
import Goal from '#/components/Goal'
import Navbar from '#/components/Navbar'
import ShouldIEatThis from '#/components/ShouldIEatThis'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { api } from '#/lib/api'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const dateObj = new Date()
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = dateObj
    .toLocaleDateString(undefined, { month: 'short' })
    .toUpperCase()
  const year = dateObj.getFullYear()

  return (
    <div className="min-h-screen bg-[#FAFCF8] text-[#173A27] font-sans selection:bg-[#82B85A]/30 selection:text-[#173A27] antialiased relative overflow-hidden pb-32">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
      <div className="absolute -top-40 -right-40 w-150 h-150 bg-[#82B85A]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] -left-40 w-125 h-125 bg-[#805033]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-40 right-[20%] w-100 h-100 bg-[#C6D896]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="grow w-full max-w-350 mx-auto px-6 sm:px-8 lg:px-12 pt-32 lg:pt-40">
          <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82B85A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#82B85A]"></span>
                </span>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#82B85A]">
                  Live Rhythm Active
                </p>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-[#173A27]">
                Metabolic <br className="hidden sm:block" />
                <span className="relative inline-block mt-2 sm:mt-0">
                  <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-[#173A27] to-[#805033]">
                    Overview.
                  </span>
                  <svg
                    className="absolute w-full h-4 -bottom-1 left-0 text-[#82B85A]/30 z-0"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-end text-right">
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">
                Issue
              </div>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-4xl font-light tracking-tighter">
                  {day}
                </span>
                <span className="text-xl font-bold text-[#82B85A]">
                  {month}
                </span>
                <span className="text-xl text-gray-400">{year}</span>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-12 group relative">
              <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(23,58,39,0.03)] hover:shadow-[0_30px_60px_rgba(23,58,39,0.08)] transition-all duration-500 overflow-hidden">
                <Goal key={`goal-${refreshKey}`} refreshKey={refreshKey} />
              </div>
            </div>
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-1 bg-linear-to-br from-[#82B85A] to-[#173A27] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-full bg-[#173A27] text-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#204E35] rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#805033]/20 rounded-full blur-2xl -ml-10 -mb-10 z-0"></div>
                <div className="relative z-10 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 text-xl shadow-[0_0_15px_rgba(130,184,90,0.3)]">
                      ⚡
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/10">
                      Engine Active
                    </span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 tracking-tight">
                    Decision
                    <br />
                    Engine
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed max-w-[90%]">
                    Assess metabolic friction before consumption. The system is
                    awaiting your next input.
                  </p>
                </div>
                <div className="relative z-10 mt-auto bg-white/5 p-1 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <ShouldIEatThis onFoodLogged={handleRefresh} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 relative group flex flex-col">
              <div className="h-full bg-white rounded-[2.5rem] p-8 sm:p-10 border border-[#E2EEDB] shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:border-[#82B85A]/30 transition-colors duration-500 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#173A27] tracking-tight">
                      Metabolic Ledger
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                      Chronological Intake Record
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F4F9F1] flex items-center justify-center text-[#82B85A]">
                    <svg
                      className="w-5 h-5"
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
                </div>
                <div className="grow">
                  <FoodLog
                    key={`log-${refreshKey}`}
                    refreshKey={refreshKey}
                    onFoodAdded={handleRefresh}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
