import React from 'react'
import Navbar from './Navbar'
import logoImage from '../images/logo_image.png'
import logoText from '../images/logo_text.png'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FAFCF8] text-[#173A27] font-sans selection:bg-[#82B85A]/30 selection:text-[#173A27] overflow-x-hidden antialiased">
      <Navbar />
      <main className="relative z-10 w-full">
        <section className="relative py-16 md:py-24 flex flex-col items-center text-center max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-4xl mx-auto z-10 mt-14 sm:mt-24">
            <p className="text-sm font-black tracking-widest text-[#82B85A] mb-6 font-fraunces">
              TIMING IS EVERYTHING
            </p>
            <h1 className="text-[2.625rem] sm:text-5xl md:text-7xl xl:text-7xl leading-none font-black mb-8 font-fraunces">
              A bowl of pasta at noon is{' '}
              <span className="text-[#82B85A] relative inline-block">
                fuel.
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-[#82B85A]/30"
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
              <br className="hidden sm:inline" /> At midnight, it's{' '}
              <span className="text-[#805033] relative inline-block">
                debt.
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-[#805033]/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 0 100 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-base md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop counting what you eat. Start feeling <strong>when </strong>
              you eat. Kalora is the first metabolic compass that harmonizes
              your nutrition with your circadian rhythm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20 w-full max-w-72 mx-auto sm:max-w-none">
              <a
                href="/register"
                className="bg-[#173A27] text-white px-10 py-4 rounded-full text-base font-bold hover:bg-[#204E35] hover:scale-105 hover:shadow-[0_8px_25px_rgba(23,58,39,0.3)] transition-all duration-300 w-full sm:w-auto block text-center"
              >
                Start your journey
              </a>
              <a
                href="#features"
                className="bg-white border-2 border-[#E2EEDB] text-[#173A27] px-10 py-4 rounded-full text-base font-bold hover:border-[#82B85A] hover:bg-[#F4F9F1] hover:scale-105 transition-all duration-300 w-full sm:w-auto block text-center"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="relative w-full max-w-3xl mx-auto sm:mt-12 flex justify-center items-center px-4">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-[#82B85A]/10 rounded-full blur-3xl z-0"></div>
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-112.5 md:h-112.5 z-10 flex items-center justify-center group">
              <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#82B85A]/50 animate-[spin_120s_linear_infinite]"></div>
              <div className="absolute inset-6 sm:inset-8 md:inset-12 rounded-full border-[3px] border-[#E2EEDB] shadow-inner"></div>
              <div className="absolute inset-6 sm:inset-8 md:inset-12 rounded-full border-[3px] border-transparent border-t-[#82B85A] border-r-[#82B85A] rotate-45 transition-transform duration-1000 group-hover:rotate-90"></div>
              <div className="absolute inset-12 sm:inset-16 md:inset-24 rounded-full border-2 border-[#173A27]/20"></div>
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-linear-to-br from-[#9C6644] to-[#6B4226] rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_15px_35px_rgba(107,66,38,0.4)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105 cursor-pointer">
                <div className="text-white text-center">
                  <span className="block text-xl sm:text-2xl font-bold tracking-tight">
                    Now
                  </span>
                  <span className="block text-[10px] sm:text-xs font-medium opacity-80 uppercase tracking-widest mt-1">
                    Optimal
                  </span>
                </div>
              </div>
              <div className="absolute top-0 -translate-y-1/2 bg-white px-4 py-1 rounded-full text-xs sm:text-sm font-bold text-[#82B85A] shadow-md border border-[#E2EEDB] whitespace-nowrap">
                12:00 PM • Fuel
              </div>
              <div className="absolute bottom-0 translate-y-1/2 bg-[#173A27] px-4 py-1 rounded-full text-xs sm:text-sm font-bold text-white shadow-md whitespace-nowrap">
                12:00 AM • Debt
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="py-10 md:py-24 relative z-10 max-w-7xl mx-auto px-6 sm:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#E2EEDB] hover:border-[#82B85A] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F9F1] flex items-center justify-center mb-8 group-hover:bg-[#82B85A] transition-colors duration-300">
                <svg
                  className="w-7 h-7 text-[#82B85A] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-[#173A27]">
                Circadian Mapping
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                Stop logging blindly. Kalora creates a beautiful timeline
                visualizing your eating window, showing you the exact moment
                your metabolism peaks.
              </p>
            </div>
            <div className="bg-[#173A27] p-8 md:p-10 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#204E35] rounded-full -mr-10 -mt-10 blur-2xl z-0"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#204E35] flex items-center justify-center mb-8">
                  <svg
                    className="w-7 h-7 text-[#82B85A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-white">
                  Metabolic Momentum
                </h3>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  Fuel at the right time? Watch your momentum score grow. An
                  off-hour snack? Kalora gently recalibrates your next window to
                  keep you in sync.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#E2EEDB] hover:border-[#82B85A] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F9F1] flex items-center justify-center mb-8 group-hover:bg-[#82B85A] transition-colors duration-300">
                <svg
                  className="w-7 h-7 text-[#82B85A] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.106-1.79l5.447-2.724a2 2 0 011.896 0L15 4.944l5.447-2.724A2 2 0 0121 4.106v8.776a2 2 0 01-1.106 1.79L15 17.556l-5.447 2.724A2 2 0 019 20z"
                  />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-[#173A27]">
                Visual Harmony
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                String together days of perfect timing and watch your calendar
                bloom with color. Build a living tapestry of great decisions.
              </p>
            </div>
          </div>
        </section>
        <section
          id="bento-details"
          className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 lg:mt-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 font-fraunces">
              Designed for <span className="text-[#82B85A]">Obsession.</span>
            </h2>
            <p className="text-base md:text-xl text-gray-600">
              A UI that rewards your body's natural symmetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[310px]">
            <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#E2EEDB] shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group min-h-70 md:min-h-0 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4F9F1] rounded-bl-full z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10 h-full flex flex-col justify-between items-start w-full">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    The Cadence Map
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base max-w-sm">
                    Watch your daily decisions build a beautiful tapestry. We
                    plot your meals against your circadian rhythm curve.
                  </p>
                </div>
                <div className="w-full h-24 mt-6 bg-gray-50 rounded-xl border border-gray-100 flex items-end px-4 pb-4 space-x-2">
                  <div className="w-1/6 bg-[#E2EEDB] h-1/3 rounded-t-md"></div>
                  <div className="w-1/6 bg-[#82B85A] h-full rounded-t-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full ring-2 ring-[#82B85A]"></div>
                  </div>
                  <div className="w-1/6 bg-[#C6D896] h-2/3 rounded-t-md"></div>
                  <div className="w-1/6 bg-[#805033]/40 h-1/4 rounded-t-md"></div>
                  <div className="w-1/6 bg-[#805033]/80 h-1/6 rounded-t-md"></div>
                  <div className="w-1/6 bg-[#E2EEDB] h-1/2 rounded-t-md"></div>
                </div>
              </div>
            </div>
            <div className="bg-[#173A27] text-white rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group min-h-62.5 md:min-h-0 flex flex-col justify-between">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#204E35] rounded-full blur-2xl group-hover:bg-[#82B85A]/40 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 text-xl">
                    ⚡
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Gentle Nudges
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Eat late? Kalora doesn't judge. It gently recalibrates your
                    next window to pull you back into alignment.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#F4F9F1] rounded-3xl p-6 md:p-8 border border-[#C6D896]/50 hover:border-[#82B85A] transition-colors duration-300 flex flex-col justify-center items-center text-center group min-h-62.5 md:min-h-0">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-[#82B85A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">One-Tap Logging</h3>
              <p className="text-gray-600 text-sm px-2">
                No barcode scanning. Just tap when you eat, we calculate the
                biological impact.
              </p>
            </div>
            <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#E2EEDB] shadow-sm flex flex-col justify-center relative overflow-hidden min-h-70 md:min-h-0">
              <div className="flex flex-col sm:flex-row items-center justify-between z-10 relative gap-6">
                <div className="max-w-md text-center sm:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Metabolic Debt Rescue
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Understand the true cost of the midnight snack. See exactly
                    how many hours of fasting it takes to clear your metabolic
                    debt.
                  </p>
                </div>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 border-[#F9F3F0] flex items-center justify-center relative shrink-0">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="#805033"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="301"
                      strokeDashoffset="100"
                      strokeLinecap="round"
                      className="animate-[pulse_4s_ease-in-out_infinite] hidden sm:block"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#805033"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251"
                      strokeDashoffset="80"
                      strokeLinecap="round"
                      className="animate-[pulse_4s_ease-in-out_infinite] block sm:hidden"
                    />
                  </svg>
                  <span className="text-xl sm:text-2xl font-black text-[#805033]">
                    -2h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white border-t border-[#E2EEDB] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <img
                src={logoImage}
                alt="Kalora"
                className="h-6 w-auto grayscale opacity-60"
              />
              <img
                src={logoText}
                alt="Kalora"
                className="h-4 w-auto grayscale opacity-60"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">
              &copy; {new Date().getFullYear()} Kalora. Aligning nature and
              nutrition.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm font-bold text-gray-500">
            <a href="#" className="hover:text-[#82B85A] transition-colors">
              The Philosophy
            </a>
            <a href="#" className="hover:text-[#82B85A] transition-colors">
              Science
            </a>
            <a href="#" className="hover:text-[#82B85A] transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-[#82B85A] transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
