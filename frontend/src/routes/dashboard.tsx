import FoodLog from '#/components/FoodLog'
import Goal from '#/components/Goal'
import Navbar from '#/components/Navbar'
import ShouldIEatThis from '#/components/ShouldIEatThis'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  // Shared synchronization state to refresh components when a log is created
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#FAFCF8] text-[#173A27] font-sans selection:bg-[#82B85A]/30 selection:text-[#173A27] antialiased pb-24 relative overflow-hidden">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

      {/* Radiant Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#82B85A]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#805033]/3 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10">
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          {/* Header Row */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase text-[#82B85A] mb-1">
                Circadian Core
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Metabolic Overview
              </h1>
            </div>
            <div className="text-sm font-semibold text-gray-500 bg-white border border-[#E2EEDB] px-4 py-2 rounded-full shadow-sm">
              Today:{' '}
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Primary Calorie Goal Panel */}
            <div className="lg:col-span-3">
              <Goal key={`goal-${refreshKey}`} refreshKey={refreshKey} />
            </div>

            {/* Main Interactive Tools Stack */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] border border-[#E2EEDB] p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#F4F9F1] rounded-full blur-xl opacity-60 group-hover:scale-120 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-extrabold mb-2 text-[#173A27]">
                    Decision Engine
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Evaluate nutritional sync status before consuming meals to
                    optimize baseline efficiency.
                  </p>
                  <ShouldIEatThis onFoodLogged={handleRefresh} />
                </div>
              </div>
            </div>

            {/* Timeline Logs Container */}
            <div className="lg:col-span-2">
              <FoodLog
                key={`log-${refreshKey}`}
                refreshKey={refreshKey}
                onFoodAdded={handleRefresh}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
