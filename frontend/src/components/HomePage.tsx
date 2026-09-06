import React, { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import Navbar from './Navbar'
import logoImage from '../images/logo_image.png'
import logoText from '../images/logo_text.png'
const IMAGE_DAY =
  'https://images.unsplash.com/photo-1732534252987-b37494a42c3a?q=80&w=1800&auto=format&fit=crop'
const IMAGE_NIGHT =
  'https://images.unsplash.com/photo-1606659894125-40824878b6ce?q=80&w=1800&auto=format&fit=crop'
const IMAGE_NIGHT_WIDE =
  'https://images.unsplash.com/photo-1758405155772-ef0f0077375c?q=80&w=2200&auto=format&fit=crop'
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"
const EASE = 'cubic-bezier(.22,1,.36,1)'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

const MARQUEE_WORDS = [
  'Circadian rhythm',
  'Metabolic timing',
  'Noon to midnight',
  'Fuel, not debt',
  'Biological alignment',
]

const HEATMAP_LEVELS = [
  2, 3, 1, 4, 0, 2, 3, 3, 4, 2, 1, 0, 3, 4, 1, 2, 3, 4, 4, 3, 0, 1, 2, 3, 4, 2,
  3, 1, 4, 4, 2, 0, 3, 4, 1,
]
const HEATMAP_COLORS = ['#173820', '#2C5333', '#4B7A45', '#7CA655', '#B8CC93']
const MOMENTUM_BARS = [38, 52, 68, 84, 30, 48, 62, 78, 92]

const THEME_LIGHT = {
  bg: '#FAF8F2',
  text: '#16301F',
  muted: '#5B5B50',
  border: '#DEEAD3',
}
const THEME_DARK = {
  bg: '#070E0A',
  text: '#FAF8F2',
  muted: '#9CA79B',
  border: '#1C2920',
}

const CAPABILITIES = [
  {
    title: 'Circadian mapping',
    body: 'A living timeline of your eating window, plotted against the hours your metabolism actually wants fuel.',
    render: (isActive: boolean) => (
      <svg
        viewBox="0 0 300 160"
        className="w-full max-w-70 drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B7A45" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#B8CC93" stopOpacity="1" />
            <stop offset="100%" stopColor="#4B7A45" stopOpacity="0.2" />
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path
          d="M10,125 C55,25 105,20 150,58 C195,96 245,140 290,45"
          fill="none"
          stroke="url(#glow)"
          strokeWidth="3.5"
          pathLength="1"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: isActive ? 0 : 1,
            transition: `stroke-dashoffset 1.5s ${EASE}`,
          }}
        />
        <path
          d="M10,125 C55,25 105,20 150,58 C195,96 245,140 290,45"
          fill="none"
          stroke="#B8CC93"
          strokeWidth="8"
          filter="url(#blur)"
          opacity={isActive ? 0.3 : 0}
          style={{ transition: `opacity 1.5s ${EASE}` }}
        />
        <circle
          cx="150"
          cy="58"
          r="6"
          fill="#FAF8F2"
          className="drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1)' : 'scale(0)',
            transition: `all 800ms ${EASE} 1.1s`,
          }}
        />
        <line
          x1="150"
          y1="58"
          x2="150"
          y2="150"
          stroke="#FAF8F2"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.4"
        />
        <text
          x="150"
          y="146"
          textAnchor="middle"
          fill="#FAF8F2"
          fontSize="10"
          className="font-mono tracking-widest uppercase opacity-80"
        >
          Peak Window
        </text>
      </svg>
    ),
  },
  {
    title: 'Metabolic momentum',
    body: 'Eat inside your window and your momentum score climbs. Step outside it and Kalora quietly resets your next target.',
    render: (isActive: boolean) => (
      <div className="flex items-end gap-2.5 h-32 w-full max-w-70">
        {MOMENTUM_BARS.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${h < 40 ? 'bg-[#7C4A30]' : 'bg-[#7CA655]'} relative group`}
            style={{
              height: isActive ? `${h}%` : '4%',
              transition: `height 800ms ${EASE} ${isActive ? i * 65 : 0}ms`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Visual harmony',
    body: 'String enough good windows together and your month turns into a calendar of color you actually want to look back on.',
    render: (isActive: boolean) => (
      <div className="grid grid-cols-7 gap-2">
        {HEATMAP_LEVELS.map((level, i) => (
          <div
            key={i}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg"
            style={{
              background: HEATMAP_COLORS[level],
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(0.2)',
              transition: `opacity 500ms ease ${isActive ? i * 12 : 0}ms, transform 500ms ${EASE} ${isActive ? i * 12 : 0}ms`,
            }}
          />
        ))}
      </div>
    ),
  },
]

function useReveal(
  delay = 0,
  threshold = 0.2,
): [React.RefObject<any>, boolean] {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout> | undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay)
          io.unobserve(el)
        }
      },
      { threshold },
    )

    io.observe(el)

    return () => {
      if (timer) clearTimeout(timer)
      io.disconnect()
    }
  }, [threshold, delay])

  return [ref, visible]
}

function useCountUp(active: boolean, duration = 1200) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return undefined
    if (prefersReducedMotion()) {
      setT(1)
      return undefined
    }
    let raf: number
    let start: number | null = null
    const step = (ts: number) => {
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

function BentoCard({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay: number
  className: string
}) {
  const [ref, visible] = useReveal(delay, 0.1)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={(el) => {
        ref.current = el
        cardRef.current = el
      }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-[2rem] overflow-hidden transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionTimingFunction: EASE }}
    >
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%)',
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}

function BigNumeral({ to = 24 }: { to?: number }) {
  const [ref, visible] = useReveal(0, 0.5)
  const t = useCountUp(visible, 2200)
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative flex justify-center items-center w-full overflow-hidden py-16 md:py-28 bg-[#070E0A]"
    >
      <span
        className="font-fraunces italic font-black text-[12rem] sm:text-[18rem] md:text-[26rem] lg:text-[34rem] leading-none select-none tracking-tighter"
        style={{
          background:
            'linear-gradient(180deg, rgba(250,248,242,0.34) 0%, rgba(124,166,85,0.08) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '1.5px rgba(250,248,242,0.14)',
          color: 'transparent',
        }}
      >
        {Math.round(t * to)}
      </span>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-mono text-xs md:text-sm tracking-wide text-white/70">
          Hours in a metabolic cycle
        </span>
      </div>
    </div>
  )
}

function DebtRing() {
  const [ref, visible] = useReveal(0, 0.5)
  const t = useCountUp(visible, 1500)
  const circumference = 327
  const dashoffset = circumference - t * (circumference - 110)
  const hours = t >= 0.99 ? '2.0' : (t * 2).toFixed(1)

  return (
    <div
      ref={ref}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-10 border-[#F3EAE3] flex items-center justify-center relative shrink-0 drop-shadow-xl bg-white"
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-md"
      >
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#7C4A30"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <span className="block text-2xl md:text-3xl font-black text-[#7C4A30] leading-none">
          -{hours}h
        </span>
        <span className="block font-mono text-[9px] uppercase tracking-widest text-[#7C4A30]/60 mt-1">
          Debt
        </span>
      </div>
    </div>
  )
}

const HomePage = () => {
  const [loaded, setLoaded] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [activeCap, setActiveCap] = useState(0)

  const cursorDotRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const title = "Kalora | Nutrition timed to your body's clock"
    const description =
      'Kalora connects what you eat with when you eat it, helping you build nutrition habits around your natural biological rhythm.'
    const url = window.location.href

    document.title = title

    const upsertMeta = (
      attr: 'name' | 'property',
      key: string,
      content: string,
    ) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, key)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'theme-color', '#16301F')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', IMAGE_DAY)
    upsertMeta('property', 'og:site_name', 'Kalora')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', IMAGE_DAY)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    let structuredData = document.getElementById('kalora-structured-data')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.id = 'kalora-structured-data'
      structuredData.setAttribute('type', 'application/ld+json')
      document.head.appendChild(structuredData)
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Kalora',
      description,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url,
    })
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (
      prefersReducedMotion() ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return undefined
    }

    let mouseX = -100
    let mouseY = -100
    let cursorX = -100
    let cursorY = -100
    let heroSpotR = 0
    let targetHeroSpotR = 0
    let heroSpotX = 50
    let heroSpotY = 50
    let rafId: number

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY

      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const insideHero =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (insideHero) {
        heroSpotX = event.clientX - rect.left
        heroSpotY = event.clientY - rect.top
        targetHeroSpotR = 520
      }
    }

    const onHeroLeave = () => {
      targetHeroSpotR = 0
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    heroRef.current?.addEventListener('mouseleave', onHeroLeave)

    const loop = () => {
      cursorX += (mouseX - cursorX) * 0.16
      cursorY += (mouseY - cursorY) * 0.16
      heroSpotR += (targetHeroSpotR - heroSpotR) * 0.08

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      }

      if (heroRef.current) {
        heroRef.current.style.setProperty('--spot-x', `${heroSpotX}px`)
        heroRef.current.style.setProperty('--spot-y', `${heroSpotY}px`)
        heroRef.current.style.setProperty('--spot-r', `${heroSpotR}px`)
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      heroRef.current?.removeEventListener('mouseleave', onHeroLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])
  useEffect(() => {
    let raf: number | null = null
    let lastUpdate = 0

    const onScroll = () => {
      if (raf) return

      raf = requestAnimationFrame(() => {
        const now = performance.now()

        if (now - lastUpdate >= 40) {
          const heroBottom = heroRef.current?.getBoundingClientRect().bottom
          setIsDark(
            heroBottom !== undefined && heroBottom < window.innerHeight * 0.35,
          )
          lastUpdate = now
        }

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
          if (entry.isIntersecting) setActiveCap(i)
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
      )
      io.observe(el)
      return io
    })
    return () => observers.forEach((io) => io && io.disconnect())
  }, [])

  const theme = isDark ? THEME_DARK : THEME_LIGHT

  const magneticMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    event.currentTarget.style.transform = `translate(${x / 6}px, ${y / 6}px)`
  }

  const magneticLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      className="kalora-home min-h-screen selection:bg-[#7CA655]/40 selection:text-[#16301F] antialiased"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        transition: `background-color 700ms ${EASE}, color 700ms ${EASE}`,
      }}
    >
      <style>{`
        .mask-image-btt { mask-image: linear-gradient(to top, transparent, black 20%, black 100%); -webkit-mask-image: linear-gradient(to top, transparent, black 20%, black 100%); }
        @keyframes kaloraRise { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes kaloraMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .kalora-home *,
          .kalora-home *::before,
          .kalora-home *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-2000 focus:rounded focus:bg-[#16301F] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-[#7CA655]"
      >
        Skip to main content
      </a>

      <div
        aria-hidden="true"
        className="fixed inset-0 z-1000 flex items-center justify-center bg-[#070E0A]"
        style={{
          clipPath: loaded ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
          transition: `clip-path 1.2s ${EASE} 0.2s`,
          pointerEvents: loaded ? 'none' : 'auto',
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.5em] text-[#FAF8F2] uppercase animate-pulse">
          Initializing Rhythm
        </span>
      </div>

      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-9999 hidden lg:block w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-[#7CA655] will-change-transform"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-100 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      <Navbar />

      <main id="main-content" className="relative z-10 w-full">
        <section
          ref={heroRef}
          aria-labelledby="hero-heading"
          className="relative w-full h-screen overflow-hidden bg-[#FAF8F2] interactive"
        >
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-6 md:px-16 lg:px-24 z-10">
            <div className="max-w-4xl mt-12 md:mt-0">
              <h1
                id="hero-heading"
                className="font-fraunces text-[clamp(3.5rem,12vw,11rem)] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] leading-[0.85] font-black text-[#16301F] tracking-tight"
              >
                <span className="block overflow-hidden pb-2">
                  <span
                    className="block animate-[kaloraRise_1.2s_cubic-bezier(.22,1,.36,1)_both]"
                    style={{ animationDelay: '1.1s' }}
                  >
                    Pasta at noon
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="block animate-[kaloraRise_1.2s_cubic-bezier(.22,1,.36,1)_both]"
                    style={{ animationDelay: '1.2s' }}
                  >
                    is{' '}
                    <em className="italic font-light pr-4 text-[#7CA655]">
                      pure
                    </em>{' '}
                    fuel.
                  </span>
                </span>
              </h1>
              <p
                className="mt-8 text-base md:text-lg text-[#5B5B50] max-w-sm animate-[kaloraRise_1s_ease-out_both]"
                style={{ animationDelay: '1.3s' }}
              >
                Burned cleanly by a metabolism that&rsquo;s wide awake and ready
                to use it.
              </p>
              <p className="sr-only">
                Pasta at noon is burned as fuel by an active metabolism. The
                same pasta at midnight is stored instead, becoming a metabolic
                debt your body has to pay off the next day. Kalora times your
                nutrition to this rhythm instead of only counting calories.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-[85%] md:w-[55%] lg:w-[45%] h-full md:h-[90%] z-[-1] mask-image-btt">
              <img
                src={IMAGE_DAY}
                alt=""
                aria-hidden="true"
                width="1800"
                height="1200"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-center opacity-95 scale-[1.02]"
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#070E0A] flex flex-col justify-center px-6 md:px-16 lg:px-24 z-20 overflow-hidden will-change-[clip-path]"
            style={{
              clipPath:
                'circle(var(--spot-r, 0px) at var(--spot-x, 50%) var(--spot-y, 50%))',
            }}
          >
            <div className="max-w-4xl relative z-30 mt-12 md:mt-0">
              <h2
                aria-hidden="true"
                className="font-fraunces text-[clamp(3.5rem,12vw,11rem)] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] leading-[0.85] font-black text-[#FAF8F2] tracking-tight"
              >
                <span className="block pb-2">Pasta at midnight</span>
                <span className="block">
                  is{' '}
                  <em className="italic font-light text-[#4B7A45] pr-4">
                    metabolic
                  </em>{' '}
                  debt.
                </span>
              </h2>
              <p className="mt-8 text-base md:text-lg text-[#9CA79B] max-w-sm">
                Stored instead, becoming a loan your body has to pay off
                tomorrow.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-[85%] md:w-[55%] lg:w-[45%] h-full md:h-[90%] z-21 mask-image-btt">
              <img
                src={IMAGE_NIGHT}
                alt=""
                aria-hidden="true"
                width="1800"
                height="1200"
                loading="eager"
                fetchPriority="low"
                decoding="async"
                className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity scale-[1.02]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#070E0A] via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <div
          aria-hidden="true"
          className="relative py-8 sm:py-10 overflow-hidden bg-[#7CA655] text-[#070E0A] rotate-[-1.5deg] scale-105 my-24 interactive"
        >
          <div className="flex whitespace-nowrap animate-[kaloraMarquee_25s_linear_infinite]">
            {[0, 1, 2].map((rep) => (
              <div key={rep} className="flex items-center shrink-0">
                {MARQUEE_WORDS.map((w, i) => (
                  <React.Fragment key={`${rep}-${w}`}>
                    <span
                      className={`font-fraunces text-4xl md:text-6xl mx-8 uppercase font-black tracking-tighter ${i % 2 !== 0 ? 'italic font-light' : ''}`}
                    >
                      {w}
                    </span>
                    <span className="font-mono text-xl mx-8 opacity-40">•</span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section
          id="features"
          aria-labelledby="capabilities-heading"
          className="max-w-360 mx-auto px-6 lg:px-12 py-16 md:py-32"
        >
          <h2 id="capabilities-heading" className="sr-only">
            Core capabilities
          </h2>
          <div className="md:grid md:grid-cols-12 md:gap-16 items-start">
            <div
              aria-hidden="true"
              className="hidden md:block md:col-span-6 lg:col-span-7 sticky top-32 h-125 rounded-[3rem] overflow-hidden bg-[#070E0A] border border-white/5 shadow-2xl"
            >
              {CAPABILITIES.map((c, i) => (
                <div
                  key={c.title}
                  className="absolute inset-0 flex items-center justify-center p-12"
                  style={{
                    opacity: activeCap === i ? 1 : 0,
                    transform: activeCap === i ? 'scale(1)' : 'scale(0.92)',
                    transition: `all 800ms ${EASE}`,
                  }}
                >
                  {c.render(activeCap === i)}
                </div>
              ))}
            </div>

            <div className="md:col-span-6 lg:col-span-5 space-y-24 md:space-y-[60vh] py-10 md:py-32 relative z-10">
              {CAPABILITIES.map((c, i) => (
                <div
                  key={c.title}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className="max-w-lg interactive"
                >
                  <div
                    aria-hidden="true"
                    className="md:hidden mb-8 rounded-[2rem] overflow-hidden bg-[#070E0A] border border-white/5 p-8 flex items-center justify-center h-65 sm:h-80"
                  >
                    {c.render(true)}
                  </div>
                  <span
                    className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 block"
                    style={{
                      color: activeCap === i ? '#7CA655' : theme.muted,
                      transition: `color 500ms ${EASE}`,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    className="font-fraunces text-4xl sm:text-5xl font-black mb-6 tracking-tight leading-[1.1]"
                    style={{
                      color: activeCap === i ? theme.text : theme.muted,
                      transition: `color 500ms ${EASE}`,
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="text-lg md:text-xl leading-relaxed"
                    style={{
                      color: activeCap === i ? theme.muted : 'transparent',
                      transition: `color 500ms ${EASE}`,
                    }}
                  >
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BigNumeral to={24} />

        <section
          id="bento-details"
          aria-labelledby="features-heading"
          className="max-w-360 mx-auto px-6 lg:px-12 py-20 md:py-32"
        >
          <div className="text-center mb-20 max-w-3xl mx-auto interactive">
            <h2
              id="features-heading"
              className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-[1.05]"
              style={{ color: theme.text, transition: 'color 250ms linear' }}
            >
              Built for people who notice the clock.
            </h2>
            <p
              className="text-lg md:text-xl font-mono tracking-tight"
              style={{ color: theme.muted, transition: 'color 250ms linear' }}
            >
              An interface that rewards your body’s biological sense of timing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[340px]">
            <BentoCard
              delay={0}
              className="md:col-span-7 bg-[#16301F] text-white interactive"
            >
              <div className="flex flex-col h-full justify-between p-4">
                <div>
                  <h3 className="font-fraunces text-3xl font-bold mb-3">
                    The Cadence Map
                  </h3>
                  <p className="text-[#9CA79B] text-sm md:text-base max-w-md">
                    Watch your daily decisions build a tapestry. We plot your
                    meals against your circadian rhythm curve.
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="w-full h-32 mt-8 bg-[#0B140E] rounded-2xl border border-white/5 flex items-end px-4 pb-4 space-x-3 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-t from-[#7CA655]/20 to-transparent opacity-50" />
                  {[3, 6, 9, 4, 2, 7].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/10 hover:bg-[#7CA655] transition-colors rounded-t-lg relative group"
                      style={{ height: `${h * 10}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-mono text-[9px] bg-white text-black px-2 py-1 rounded transition-opacity">
                        {h * 10}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard
              delay={100}
              className="md:col-span-5 bg-[#7CA655] text-[#16301F] interactive"
            >
              <div className="flex flex-col h-full justify-between p-4">
                <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl">
                  <svg
                    className="w-6 h-6 text-[#16301F]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-fraunces text-3xl font-bold mb-3">
                    One-Tap Logging
                  </h3>
                  <p className="text-[#16301F]/80 text-sm md:text-base font-medium">
                    No barcode scanning. Just tap when you eat. We calculate the
                    biological impact instantly.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard
              delay={200}
              className="md:col-span-5 bg-[#FAF8F2] border border-[#DEEAD3] text-[#16301F] interactive"
            >
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div aria-hidden="true">
                  <DebtRing />
                </div>
                <h3 className="font-fraunces text-2xl font-bold mt-8 mb-2">
                  Debt Rescue
                </h3>
                <p className="text-[#5B5B50] text-sm">
                  See exactly how many hours of fasting clear your late-night
                  metabolic debt.
                </p>
              </div>
            </BentoCard>

            <BentoCard
              delay={300}
              className="md:col-span-7 bg-[#070E0A] border border-white/10 text-white interactive"
            >
              <div className="flex flex-col h-full justify-center p-4">
                <h3 className="font-fraunces text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Gentle Nudges.
                </h3>
                <p className="text-[#9CA79B] text-lg max-w-lg">
                  Eat late? Kalora doesn’t judge. It quietly recalibrates your
                  next window to pull you back into alignment without the
                  lecture.
                </p>
              </div>
            </BentoCard>
          </div>
        </section>

        <section className="relative mt-24 md:mt-40">
          <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            <img
              src={IMAGE_NIGHT_WIDE}
              alt="Quiet dinner table in warm evening light"
              width="2200"
              height="1400"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-[#070E0A]/85 backdrop-blur-[2px]" />

            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-32 interactive">
              <h2 className="font-fraunces text-[clamp(2.75rem,7vw,5.5rem)] font-black text-[#FAF8F2] mb-8 sm:mb-10 leading-[0.95] tracking-[-0.04em]">
                Your next window opens tomorrow at sunrise.
              </h2>
              <a
                href="/register"
                onMouseMove={magneticMove}
                onMouseLeave={magneticLeave}
                className="group relative inline-flex items-center gap-5 overflow-hidden bg-[#FAF8F2] text-[#16301F] px-8 sm:px-12 py-4 sm:py-5 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CA655] focus-visible:ring-offset-4 focus-visible:ring-offset-[#070E0A]"
                style={{ transition: `transform 450ms ${EASE}` }}
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  Start Your Journey
                </span>
                <span
                  aria-hidden="true"
                  className="relative z-10 text-lg transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white"
                >
                  &rarr;
                </span>
                <span className="absolute inset-0 -translate-x-full bg-[#7CA655] transition-transform duration-700 ease-out group-hover:translate-x-0" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="py-16 relative z-10 border-t"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
          transition: `background-color 700ms ${EASE}, border-color 700ms ${EASE}`,
        }}
      >
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <img
                src={logoImage}
                alt=""
                aria-hidden="true"
                height="28"
                loading="lazy"
                decoding="async"
                className="h-7 w-auto grayscale opacity-80"
              />
              <img
                src={logoText}
                alt="Kalora"
                height="16"
                loading="lazy"
                decoding="async"
                className="h-4 w-auto grayscale opacity-80"
              />
            </div>
            <p
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: theme.muted, transition: `color 700ms ${EASE}` }}
            >
              &copy; {new Date().getFullYear()} Kalora. Aligning nature and
              nutrition.
            </p>
          </div>
          <div
            className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-4 text-xs font-mono tracking-widest uppercase"
            style={{ color: theme.text, transition: `color 700ms ${EASE}` }}
          >
            <a
              href="#"
              className="hover:text-[#7CA655] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CA655] focus-visible:ring-offset-4"
            >
              The Philosophy
            </a>
            <a
              href="#"
              className="hover:text-[#7CA655] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CA655] focus-visible:ring-offset-4"
            >
              Science
            </a>
            <a
              href="#"
              className="hover:text-[#7CA655] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CA655] focus-visible:ring-offset-4"
            >
              Support
            </a>
            <Link
              to="/terms"
              className="hover:text-[#7CA655] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CA655] focus-visible:ring-offset-4"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="hover:text-[#7CA655] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CA655] focus-visible:ring-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
