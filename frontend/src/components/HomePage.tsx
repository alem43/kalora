import React from 'react'
import Navbar from './Navbar'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-avocado-200 selection:text-kalora-dark-green">
      <Navbar />

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* --- HERO SECTION --- */}
        <section className="py-24 text-center md:flex md:items-center md:text-left md:space-x-12">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
              Harmonize Your Body with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-avocado-400 to-emerald-600">
                Organic Rhythm.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Most apps list what you eat. We help you feel *when* to eat.
              Discover a beautiful symmetry between your nutrition and your
              body's cadence with the first app focused on timing.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="/register"
                className="bg-avocado-500 text-kalora-dark-green px-10 py-5 rounded-full text-lg font-bold hover:bg-avocado-400 shadow-[0_4px_10px_rgba(34,197,94,0.3)] transition-all"
              >
                Start For Free
              </a>
              <a
                href="#features"
                className="bg-gray-100 text-kalora-dark-green px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-200 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
          {/* Hero Visual - an illustrative element */}
          <div className="flex-1 mt-16 md:mt-0 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* The concentric circles from the logo, but subtle and large */}
              <div className="w-[30rem] h-[30rem] border-avocado-100 border-[1.5px] rounded-full scale-[1.03] opacity-20"></div>
              <div className="w-[26rem] h-[26rem] border-avocado-200 border-[2px] rounded-full scale-[1.02] opacity-30"></div>
              <div className="w-[22rem] h-[22rem] border-avocado-300 border-[2.5px] rounded-full scale-[1.01] opacity-40"></div>
              <div className="w-[18rem] h-[18rem] border-avocado-400 border-[3px] rounded-full opacity-50"></div>
              <div className="w-[14rem] h-[14rem] border-avocado-500 border-[3.5px] rounded-full opacity-60"></div>
            </div>
            <div className="w-full h-80 bg-gray-100 rounded-3xl flex items-center justify-center z-10 relative">
              <div className="w-64 h-64 flex items-center justify-center bg-white rounded-3xl shadow-lg p-6">
                {/* Use the provided logo again, subtly */}
                <div className="w-40 h-40 flex flex-col items-center justify-center bg-gray-100 rounded-full mb-4">
                  <span className="text-4xl font-bold text-gray-400 mb-2">
                    #
                  </span>
                  {/* <img src="f55ed978-32a2-47f7-ac99-41d3599eea88_removalai_preview.png" alt="Kalora Logo" className="w-32 h-32" /> */}
                  <p className="text-xl font-bold text-kalora-dark-green">
                    Kalora
                  </p>
                </div>
                <p className="text-sm text-center text-gray-500 leading-snug">
                  Visualizing your metabolic rhythm through the perfect daily
                  cadence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- THE PHILOSOPHY --- */}
        <section
          id="philosophy"
          className="py-24 my-20 rounded-3xl"
          style={{
            backgroundImage:
              'linear-gradient(to bottom right, white 0%, #F1FCEF 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12 text-kalora-dark-green tracking-tight">
              The Gentle Symphony of Timing
            </h2>
            <blockquote className="text-4xl md:text-5xl font-medium leading-snug text-gray-900 border-l-8 border-avocado-500 pl-10 text-left mb-16 italic font-serif">
              "A 500-calorie bowl of pasta isn't just 500 calories.
              <br />
              <span className="text-avocado-500 font-semibold not-italic">
                At noon, it's fuel.
              </span>
              <br />
              <span className="text-brown-500 font-semibold not-italic">
                At midnight, it's metabolic debt.
              </span>
              "
            </blockquote>
            <p className="mt-8 text-xl text-gray-600 text-left leading-relaxed">
              While other apps count, Kalora listens. Discover the elegant
              simplicity of aligning your nutrition with your unique biological
              rhythm. We guide you not just on *what* to nourish yourself with,
              but precisely *when*, creating a seamless, natural flow that
              fosters vitality from within.
            </p>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-kalora-dark-green">
              Cultivate Your Metabolic Balance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 hover:border-avocado-200 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-avocado-100 flex items-center justify-center mb-8">
                {/* Feature Icon: a clock or timeline element */}
                <svg
                  className="w-8 h-8 text-avocado-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-5 text-gray-900">
                Cadence Tracking
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900">
                Log your meals with beautiful, intuitive ease. Our unique
                timeline visualizes your pattern, allowing you to see the
                perfect moment for each meal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 hover:border-avocado-200 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-avocado-100 flex items-center justify-center mb-8">
                {/* Feature Icon: a feedback or bio-feedback element */}
                <svg
                  className="w-8 h-8 text-avocado-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-5 text-gray-900">
                Bio-Intuitive Insights
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900">
                Get gentle, instant feedback. Fuel at the right time? A soft,
                warm glow. An off-hour snack? A gentle nudge towards balance. We
                illuminate your path to natural symmetry.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 hover:border-avocado-200 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-avocado-100 flex items-center justify-center mb-8">
                {/* Feature Icon: a map, pattern, or tapestry element */}
                <svg
                  className="w-8 h-8 text-avocado-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.106-1.79l5.447-2.724a2 2 0 011.896 0L15 4.944l5.447-2.724A2 2 0 0121 4.106v8.776a2 2 0 01-1.106 1.79L15 17.556l-5.447 2.724A2 2 0 019 20z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-5 text-gray-900">
                Metabolic Harmony Map
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900">
                A beautiful visual reflection of your consistency. String
                together days of perfect timing and watch your calendar bloom
                with color. Build a tapestry of good decisions.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-100 bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="text-gray-500 mb-6 md:mb-0 space-y-1">
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              {/* Tiny logo placement */}
              {/* <img src="f55ed978-32a2-47f7-ac99-41d3599eea88_removalai_preview.png" alt="Kalora Logo" className="w-5 h-5 opacity-50" /> */}
              <span className="text-sm font-bold text-gray-300">#</span>
              <span className="text-xl font-bold tracking-tighter text-gray-400">
                Kalora
              </span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; 2026 Kalora. Cultivating Inner Balance, naturally.
            </p>
          </div>
          <div className="space-x-8 text-sm text-gray-500 font-medium">
            <a
              href="#"
              className="hover:text-kalora-dark-green transition-colors"
            >
              Our Approach
            </a>
            <a
              href="#"
              className="hover:text-kalora-dark-green transition-colors"
            >
              Contact Support
            </a>
            <a
              href="#"
              className="hover:text-kalora-dark-green transition-colors"
            >
              Research Base
            </a>
            <a
              href="#"
              className="hover:text-kalora-dark-green transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
