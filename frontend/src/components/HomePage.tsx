import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import logoImage from '../images/logo_image.png'
import logoText from '../images/logo_text.png'

// Placeholder editorial photography (Unsplash License — free for commercial use,
// no attribution required). Swap for original Kalora photography when available.
const IMAGE_DAY =
  'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=1400&auto=format&fit=crop'
const IMAGE_NIGHT =
  'https://images.unsplash.com/photo-1560434019-4558f9a9e2a1?q=80&w=1400&auto=format&fit=crop'
const IMAGE_NIGHT_WIDE =
  'https://images.unsplash.com/photo-1560434019-4558f9a9e2a1?q=80&w=1800&auto=format&fit=crop'

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

const EASE = 'cubic-bezier(.22,1,.36,1)'

// Light → night color interpolation, driven by how far down the page you are
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bch = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r}, ${g}, ${bch})`
}

const MARQUEE_WORDS = [
  'Circadian rhythm',
  'Metabolic timing',
  'Noon to midnight',
  'Fuel, not debt',
]

const HEATMAP_LEVELS = [
  2, 3, 1, 4, 0, 2, 3, 3, 4, 2, 1, 0, 3, 4, 1, 2, 3, 4, 4, 3, 0, 1, 2, 3, 4, 2,
  3, 1, 4, 4, 2, 0, 3, 4, 1,
]
const HEATMAP_COLORS = ['#173820', '#2C5333', '#4B7A45', '#7CA655', '#B8CC93']

const MOMENTUM_BARS = [38, 52, 68, 84, 30, 48, 62, 78, 92]

const CAPABILITIES = [
  {
    title: 'Circadian mapping',
    body: 'A living timeline of your eating window, plotted against the hours your metabolism actually wants fuel — not a food diary, a rhythm.',
    render: (isActive) => (
      <svg viewBox="0 0 300 160" className="w-full max-w-[260px]">
        <path
          d="M10,125 C55,25 105,20 150,58 C195,96 245,140 290,45"
          fill="none"
          stroke="#7CA655"
          strokeWidth="2.5"
          pathLength="1"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: isActive ? 0 : 1,
            transition: `stroke-dashoffset 1.3s ${EASE}`,
          }}
        />
        <circle
          cx="150"
          cy="58"
          r="5.5"
          fill="#FAF8F2"
          style={{
            opacity: isActive ? 1 : 0,
            transition: `opacity 400ms ease 1.1s`,
          }}
        />
        <line
          x1="150"
          y1="58"
          x2="150"
          y2="150"
          stroke="#7CA655"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.5"
        />
        <text x="150" y="146" textAnchor="middle" fill="#C7D6BE" fontSize="11">
          peak window
        </text>
      </svg>
    ),
  },
  {
    title: 'Metabolic momentum',
    body: 'Eat inside your window and your momentum score climbs. Step outside it and Kalora quietly resets your next target — no lecture, just a new plan.',
    render: (isActive) => (
      <div className="flex items-end gap-2 h-32 w-full max-w-[260px]">
        {MOMENTUM_BARS.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${h < 40 ? 'bg-[#7C4A30]' : 'bg-[#7CA655]'}`}
            style={{
              height: isActive ? `${h}%` : '4%',
              transition: `height 700ms ${EASE} ${isActive ? i * 55 : 0}ms`,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    title: 'Visual harmony',
    body: 'String enough good windows together and your month turns into a calendar of color you actually want to look back on.',
    render: (isActive) => (
      <div className="grid grid-cols-7 gap-1.5">
        {HEATMAP_LEVELS.map((level, i) => (
          <div
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-[3px]"
            style={{
              background: HEATMAP_COLORS[level],
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(0.4)',
              transition: `opacity 450ms ease ${isActive ? i * 10 : 0}ms, transform 450ms ${EASE} ${
                isActive ? i * 10 : 0
              }ms`,
            }}
          />
        ))}
      </div>
    ),
  },
]

function useReveal(threshold = 0.2) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(el)
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, visible]
}

function useCountUp(active, duration = 1200) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return undefined
    let raf
    let start = null
    const step = (ts) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setT(1 - Math.pow(1 - p, 3))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => raf && cancelAnimationFrame(raf)
  }, [active, duration])
  return t
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: EASE }}
    >
      {children}
    </Tag>
  )
}

function BigNumeral({ to = 24, color = '#EFE7D8' }) {
  const [ref, visible] = useReveal(0.5)
  const t = useCountUp(visible, 1500)
  return (
    <span
      ref={ref}
      className="font-fraunces italic font-black text-[6.5rem] sm:text-[9rem] md:text-[12rem] leading-none select-none block"
      style={{ color, transition: `color 300ms linear` }}
    >
      {Math.round(t * to)}
    </span>
  )
}

function DebtRing() {
  const [ref, visible] = useReveal(0.5)
  const t = useCountUp(visible, 1200)
  const circumference = 327
  const dashoffset = circumference - t * (circumference - 110)
  const hours = t >= 0.999 ? '2' : (t * 2).toFixed(1)
  return (
    <div
      ref={ref}
      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 border-[#F3EAE3] flex items-center justify-center relative shrink-0"
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 w-full h-full -rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="#7C4A30"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xl sm:text-2xl font-black text-[#7C4A30]">
        -{hours}h
      </span>
    </div>
  )
}

const HomePage = () => {
  const [loaded, setLoaded] = useState(false)
  const [cursorActive, setCursorActive] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [active, setActive] = useState(0)
  const cursorTarget = useRef({ x: 0, y: 0 })
  const itemRefs = useRef([])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Smoothed ("lerped") cursor follower
  useEffect(() => {
    const move = (e) => {
      cursorTarget.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', move)
    let raf
    const loop = () => {
      setCursorPos((p) => ({
        x: p.x + (cursorTarget.current.x - p.x) * 0.2,
        y: p.y + (cursorTarget.current.y - p.y) * 0.2,
      }))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Scroll progress, throttled to animation frames — powers the parallax and the day/night rail
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        raf = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers = itemRefs.current.map((el, i) => {
      if (!el) return null
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i)
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
      )
      io.observe(el)
      return io
    })
    return () => observers.forEach((io) => io && io.disconnect())
  }, [])

  const docHeight =
    typeof document !== 'undefined'
      ? document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      : 0
  const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0
  const parallax = Math.min(scrollY * 0.12, 90)

  // How "into the night" the page is — reaches full dark before the very bottom
  // so the bento/footer stretch reads as settled night, not mid-transition.
  const dark = Math.min(progress * 1.3, 1)
  const theme = {
    bg: mix('#FAF8F2', '#0B140E', dark),
    text: mix('#1B2A20', '#EDE7DA', dark),
    muted: mix('#5B5B50', '#9CA79B', dark),
    border: mix('#DEEAD3', '#26392C', dark),
    ghost: mix('#EFE7D8', '#16241A', dark),
  }

  const activateCursor = () => setCursorActive(true)
  const deactivateCursor = () => setCursorActive(false)

  const onMagnetMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    e.currentTarget.style.transform = `translate(${x / 7}px, ${y / 7}px)`
  }
  const onMagnetLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)'
    deactivateCursor()
  }

  const onSpotMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      className="kalora-home min-h-screen selection:bg-[#7CA655]/30 selection:text-[#16301F] overflow-x-hidden antialiased"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        transition: 'background-color 250ms linear, color 250ms linear',
      }}
    >
      <style>{`
        .kalora-home { --ease-k: ${EASE}; }
        @keyframes kaloraRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes kaloraMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .kalora-home *, .kalora-home *::before, .kalora-home *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0s !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Intro curtain — the one orchestrated page-load moment */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2216]"
        style={{
          transform: loaded ? 'translateY(-100%)' : 'translateY(0)',
          opacity: loaded ? 0 : 1,
          pointerEvents: loaded ? 'none' : 'auto',
          transition: `transform 850ms ${EASE}, opacity 850ms ${EASE}`,
        }}
      >
        <span className="font-fraunces italic text-2xl text-[#FAF8F2]/80">
          Kalora
        </span>
      </div>

      {/* Custom cursor, smoothed toward the pointer */}
      <div
        className="pointer-events-none fixed z-50 hidden md:block rounded-full bg-white mix-blend-difference"
        style={{
          width: cursorActive ? 52 : 10,
          height: cursorActive ? 52 : 10,
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
          transition: `width 250ms ${EASE}, height 250ms ${EASE}`,
        }}
      />

      {/* Day → night scroll rail, ties the whole page to the hero's circadian idea */}
      <div className="pointer-events-none hidden lg:flex fixed left-7 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 h-[34vh]">
        <span className="text-[10px] font-semibold tracking-wide text-[#4F6B3A]">
          day
        </span>
        <div className="relative flex-1 w-px bg-linear-to-b from-[#7CA655]/60 via-[#DEEAD3] to-[#16301F]/70">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#16301F] shadow-[0_0_0_4px_rgba(124,166,85,0.18)]"
            style={{
              top: `${progress * 100}%`,
              transition: `top 120ms linear`,
            }}
          />
        </div>
        <span className="text-[10px] font-semibold tracking-wide text-[#16301F]">
          night
        </span>
      </div>

      {/* Ambient print grain */}
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      <Navbar />

      <main className="relative z-10 w-full">
        {/* ---------- HERO ---------- */}
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[58vh] md:min-h-[82vh] overflow-hidden">
              <img
                src={IMAGE_DAY}
                alt="A bright, overhead plate of avocado toast in morning light"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: `translateY(${parallax * 0.4}px) scale(1.08)`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#FAF8F2] via-[#FAF8F2]/15 to-transparent" />
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
                <span
                  className="text-sm font-semibold text-[#4F6B3A] mb-3"
                  style={{
                    animation: loaded ? `kaloraRise 0.8s ${EASE} both` : 'none',
                    animationDelay: '0.85s',
                    opacity: loaded ? undefined : 0,
                  }}
                >
                  Noon
                </span>
                <h1
                  className="font-fraunces text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] leading-[1.02] font-black text-[#16301F] max-w-md"
                  style={{
                    animation: loaded ? `kaloraRise 0.9s ${EASE} both` : 'none',
                    animationDelay: '0.95s',
                    opacity: loaded ? undefined : 0,
                  }}
                >
                  A bowl of pasta at noon is fuel.
                </h1>
              </div>
            </div>

            <div
              className="relative min-h-[58vh] md:min-h-[82vh] overflow-hidden"
              onMouseMove={onSpotMove}
            >
              <img
                src={IMAGE_NIGHT}
                alt="A moody, overhead bowl of pasta lit by a single warm light at night"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: `translateY(${parallax * 0.4}px) scale(1.08)`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0E1E14] via-[#0E1E14]/30 to-black/10" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(320px circle at var(--x, 70%) var(--y, 30%), rgba(255,255,255,0.10), transparent 70%)',
                }}
              />
              <div className="absolute inset-0 z-10 flex flex-col items-end justify-end p-8 sm:p-12 lg:p-16 text-right">
                <span
                  className="text-sm font-semibold text-[#CBB79A] mb-3"
                  style={{
                    animation: loaded ? `kaloraRise 0.8s ${EASE} both` : 'none',
                    animationDelay: '0.8s',
                    opacity: loaded ? undefined : 0,
                  }}
                >
                  Midnight
                </span>
                <h1
                  className="font-fraunces text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] leading-[1.02] font-black text-[#FAF8F2] max-w-md ml-auto"
                  style={{
                    animation: loaded ? `kaloraRise 0.9s ${EASE} both` : 'none',
                    animationDelay: '1s',
                    opacity: loaded ? undefined : 0,
                  }}
                >
                  At midnight, it&rsquo;s metabolic debt.
                </h1>
              </div>
            </div>
          </div>

          <div
            className="relative z-20 -mt-14 sm:-mt-20 flex justify-center px-6"
            style={{
              animation: loaded ? `kaloraRise 0.9s ${EASE} both` : 'none',
              animationDelay: '1.1s',
              opacity: loaded ? undefined : 0,
            }}
          >
            <div className="w-full max-w-xs rounded-[2rem] border border-white/70 bg-white/90 backdrop-blur-md shadow-[0_25px_60px_rgba(20,48,31,0.18)] p-6 sm:p-8">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#7CA655]/40 animate-[spin_140s_linear_infinite]" />
                <div className="absolute inset-5 rounded-full border-2 border-[#DEEAD3]" />
                <div className="absolute inset-5 rounded-full border-2 border-transparent border-t-[#7CA655] border-r-[#7CA655] rotate-45" />
                <div className="absolute inset-10 rounded-full border border-[#16301F]/15" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[38%] h-[38%] rounded-full bg-linear-to-br from-[#9C6644] to-[#5A3620] shadow-[inset_0_-8px_16px_rgba(0,0,0,0.35),0_12px_28px_rgba(90,54,32,0.35)] flex items-center justify-center">
                    <div className="text-white text-center leading-tight">
                      <span className="block text-lg sm:text-xl font-bold">
                        Now
                      </span>
                      <span className="block text-[9px] font-medium opacity-80 mt-0.5">
                        optimal window
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs font-semibold text-[#4F6B3A] shadow-sm border border-[#DEEAD3] whitespace-nowrap">
                  12:00 PM &middot; fuel
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#16301F] px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm whitespace-nowrap">
                  12:00 AM &middot; debt
                </div>
              </div>
            </div>
          </div>

          <div
            className="max-w-xl mx-auto text-center px-6 pt-10 pb-16 sm:pt-14 sm:pb-20"
            style={{
              animation: loaded ? `kaloraRise 0.9s ${EASE} both` : 'none',
              animationDelay: '1.25s',
              opacity: loaded ? undefined : 0,
            }}
          >
            <p className="text-base sm:text-lg text-[#5B5B50] leading-relaxed mb-10">
              Stop counting what you eat. Start feeling{' '}
              <em className="not-italic font-semibold text-[#16301F]">when</em>{' '}
              you eat. Kalora lines your meals up with your body&rsquo;s own
              circadian rhythm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="/register"
                onMouseEnter={activateCursor}
                onMouseMove={onMagnetMove}
                onMouseLeave={onMagnetLeave}
                className="w-full sm:w-auto text-center bg-[#16301F] text-white px-10 py-4 rounded-full text-base font-bold hover:bg-[#1E4530] hover:shadow-[0_12px_30px_rgba(20,48,39,0.3)]"
                style={{
                  transition: `transform 300ms ${EASE}, background-color 250ms ${EASE}, box-shadow 250ms ${EASE}`,
                }}
              >
                Start your journey
              </a>
              <a
                href="#features"
                onMouseEnter={activateCursor}
                onMouseLeave={deactivateCursor}
                className="w-full sm:w-auto text-center bg-white border-2 border-[#DEEAD3] text-[#16301F] px-10 py-4 rounded-full text-base font-bold hover:border-[#7CA655] hover:bg-[#F0F6EB] transition-colors duration-300"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* ---------- MARQUEE (edges feathered with a mask) ---------- */}
        <div
          className="relative py-5 overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            borderTop: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
            transition: 'border-color 250ms linear',
          }}
        >
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'kaloraMarquee 30s linear infinite' }}
          >
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center shrink-0">
                {MARQUEE_WORDS.map((w, i) => (
                  <span
                    key={`${rep}-${w}`}
                    className={`font-fraunces text-2xl sm:text-3xl mx-10 ${
                      i % 2 === 0 ? 'italic' : 'text-[#7CA655]/80'
                    }`}
                    style={
                      i % 2 === 0
                        ? {
                            color: theme.text,
                            opacity: 0.7,
                            transition: 'color 250ms linear',
                          }
                        : undefined
                    }
                  >
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- BIG NUMERAL ---------- */}
        <section className="relative py-20 md:py-32 px-6 text-center overflow-hidden">
          <BigNumeral to={24} color={theme.ghost} />
          <Reveal className="relative -mt-8 sm:-mt-14 md:-mt-20">
            <p
              className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-medium max-w-2xl mx-auto leading-snug"
              style={{ color: theme.text, transition: 'color 250ms linear' }}
            >
              Every hour of the day changes what a calorie means to your body.
            </p>
          </Reveal>
        </section>

        {/* ---------- CAPABILITIES (sticky scroll, choreographed to scroll position) ---------- */}
        <section
          id="features"
          className="max-w-6xl mx-auto px-6 sm:px-8 py-8 md:py-16"
        >
          <div className="md:grid md:grid-cols-2 md:gap-16">
            <div className="hidden md:block sticky top-28 h-[420px] rounded-[2rem] overflow-hidden bg-[#0F2216]">
              {CAPABILITIES.map((c, i) => (
                <div
                  key={c.title}
                  className="absolute inset-0 flex items-center justify-center p-10"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? 'scale(1)' : 'scale(0.96)',
                    transition: `opacity 600ms ${EASE}, transform 600ms ${EASE}`,
                  }}
                >
                  {c.render(active === i)}
                </div>
              ))}
            </div>

            <div className="space-y-16 md:space-y-[46vh] py-2 md:py-10">
              {CAPABILITIES.map((c, i) => (
                <div
                  key={c.title}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className="max-w-md"
                >
                  <div className="md:hidden mb-6 rounded-2xl overflow-hidden bg-[#0F2216] p-8 flex items-center justify-center">
                    {c.render(true)}
                  </div>
                  <h3
                    className="font-fraunces text-2xl sm:text-3xl font-bold mb-3"
                    style={{
                      color: active === i ? theme.text : theme.muted,
                      transition: `color 500ms ${EASE}`,
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{
                      color: theme.muted,
                      transition: 'color 250ms linear',
                    }}
                  >
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PRODUCT DETAIL (bento) ---------- */}
        <section
          id="bento-details"
          className="max-w-6xl mx-auto px-6 sm:px-8 mt-8 md:mt-16"
        >
          <Reveal className="text-center mb-14">
            <h2
              className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-black mb-4 max-w-2xl mx-auto"
              style={{ color: theme.text, transition: 'color 250ms linear' }}
            >
              Built for people who already notice the clock.
            </h2>
            <p
              className="text-base md:text-lg"
              style={{ color: theme.muted, transition: 'color 250ms linear' }}
            >
              An interface that rewards your body&rsquo;s own sense of timing.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">
            <Reveal
              delay={0}
              className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#DEEAD3] hover:shadow-[0_20px_45px_rgba(20,48,31,0.08)] transition-shadow duration-300 min-h-70 md:min-h-0 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#16301F]">
                  The Cadence Map
                </h3>
                <p className="text-[#5B5B50] text-sm md:text-base max-w-sm">
                  Watch your daily decisions build a tapestry. We plot your
                  meals against your circadian rhythm curve.
                </p>
              </div>
              <div className="w-full h-24 mt-6 bg-[#FAF8F2] rounded-xl border border-[#EFE9DD] flex items-end px-4 pb-4 space-x-2">
                <div className="w-1/6 bg-[#DEEAD3] h-1/3 rounded-t-md" />
                <div className="w-1/6 bg-[#7CA655] h-full rounded-t-md relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full ring-2 ring-[#7CA655]" />
                </div>
                <div className="w-1/6 bg-[#B8CC93] h-2/3 rounded-t-md" />
                <div className="w-1/6 bg-[#7C4A30]/35 h-1/4 rounded-t-md" />
                <div className="w-1/6 bg-[#7C4A30]/75 h-1/6 rounded-t-md" />
                <div className="w-1/6 bg-[#DEEAD3] h-1/2 rounded-t-md" />
              </div>
            </Reveal>

            <Reveal
              delay={80}
              className="bg-[#16301F] text-white rounded-3xl p-6 md:p-8 min-h-62.5 md:min-h-0 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-lg">
                ⚡
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Gentle Nudges
                </h3>
                <p className="text-[#C7D6BE] text-sm leading-relaxed">
                  Eat late? Kalora doesn&rsquo;t judge. It quietly recalibrates
                  your next window to pull you back into alignment.
                </p>
              </div>
            </Reveal>

            <Reveal
              delay={160}
              className="bg-[#F0F6EB] rounded-3xl p-6 md:p-8 border border-[#DEEAD3] flex flex-col justify-center items-center text-center min-h-62.5 md:min-h-0"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[#7CA655]"
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
              <h3 className="text-xl font-bold mb-2 text-[#16301F]">
                One-Tap Logging
              </h3>
              <p className="text-[#5B5B50] text-sm px-2">
                No barcode scanning. Just tap when you eat — we calculate the
                biological impact.
              </p>
            </Reveal>

            <Reveal
              delay={240}
              className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#DEEAD3] flex flex-col justify-center min-h-70 md:min-h-0"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="max-w-md text-center sm:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#16301F]">
                    Metabolic Debt Rescue
                  </h3>
                  <p className="text-[#5B5B50] text-sm md:text-base">
                    Understand the true cost of the midnight snack. See exactly
                    how many hours of fasting it takes to clear your metabolic
                    debt.
                  </p>
                </div>
                <DebtRing />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- CLOSING BAND ---------- */}
        <section className="relative mt-24 md:mt-32">
          <div
            className="relative min-h-[46vh] flex items-center justify-center overflow-hidden"
            onMouseMove={onSpotMove}
          >
            <img
              src={IMAGE_NIGHT_WIDE}
              alt="A quiet, dimly lit table set for a late dinner"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-[#0E1E14]/78" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.08), transparent 70%)',
              }}
            />
            <Reveal className="relative z-10 text-center px-6 max-w-xl mx-auto py-24">
              <h2 className="font-fraunces text-3xl sm:text-4xl font-black text-[#FAF8F2] mb-8 leading-tight">
                Your next window opens tomorrow at sunrise.
              </h2>
              <a
                href="/register"
                onMouseEnter={activateCursor}
                onMouseMove={onMagnetMove}
                onMouseLeave={onMagnetLeave}
                className="inline-block bg-[#FAF8F2] text-[#16301F] px-10 py-4 rounded-full text-base font-bold hover:bg-white"
                style={{
                  transition: `transform 300ms ${EASE}, background-color 250ms ${EASE}`,
                }}
              >
                Start your journey
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer
        className="py-12 relative z-10"
        style={{
          backgroundColor: theme.bg,
          borderTop: `1px solid ${theme.border}`,
          transition:
            'background-color 250ms linear, border-color 250ms linear',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
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
            <p
              className="text-sm font-medium"
              style={{ color: theme.muted, transition: 'color 250ms linear' }}
            >
              &copy; {new Date().getFullYear()} Kalora. Aligning nature and
              nutrition.
            </p>
          </div>
          <div
            className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm font-bold"
            style={{ color: theme.muted, transition: 'color 250ms linear' }}
          >
            <a href="#" className="hover:text-[#7CA655] transition-colors">
              The Philosophy
            </a>
            <a href="#" className="hover:text-[#7CA655] transition-colors">
              Science
            </a>
            <a href="#" className="hover:text-[#7CA655] transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-[#7CA655] transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
