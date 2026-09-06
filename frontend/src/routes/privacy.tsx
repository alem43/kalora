import { createFileRoute, Link } from '@tanstack/react-router'
import Navbar from '#/components/Navbar'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Kalora' },
      {
        name: 'description',
        content:
          "Kalora's privacy policy: what personal data we collect, why, how it's used, and your rights.",
      },
    ],
  }),
  component: RouteComponent,
})

const LAST_UPDATED = 'September 6, 2026'

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="text-xl font-extrabold text-[#173A27] tracking-tight mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-[#3B4A40]">
        {children}
      </div>
    </section>
  )
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#FAFCF8] text-[#173A27] font-sans selection:bg-[#82B85A]/30 selection:text-[#173A27] antialiased relative overflow-hidden pb-32">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
      <div className="absolute -top-40 -right-40 w-150 h-150 bg-[#82B85A]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="grow w-full max-w-3xl mx-auto px-6 sm:px-8 pt-32 lg:pt-40">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#173A27]">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-3">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div className="space-y-10 bg-white border border-[#E2EEDB] rounded-3xl p-6 sm:p-10 shadow-sm">
            <Section id="who-we-are" title="1. Who We Are">
              <p>
                This Privacy Policy explains how Kalora ("we," "us," or
                "our") collects, uses, and protects personal data when you
                use the Kalora nutrition-tracking application (the
                "Service"). For any privacy question or request, contact us
                at{' '}
                <a
                  href="mailto:begunicalem6@gmail.com"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  begunicalem6@gmail.com
                </a>
                .
              </p>
            </Section>

            <Section id="data-we-collect" title="2. Information We Collect">
              <p className="font-semibold text-[#173A27]">
                Data you provide directly:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account: email address, username, password (stored as a secure hash, never in plain text).</li>
                <li>
                  Profile/health metrics: gender, age, height, weight, goal
                  weight, activity level, and fitness goal — used to
                  calculate your personalized calorie target.
                </li>
                <li>
                  Food logs: food name, quantity, calories, and macronutrient
                  values (protein, carbs, fat, fiber, sugar), meal type, and
                  the time you logged each entry.
                </li>
              </ul>
              <p className="font-semibold text-[#173A27] pt-2">
                Data collected automatically:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  A session identifier stored in a secure, HTTP-only cookie,
                  used to keep you signed in.
                </li>
                <li>
                  A local, non-tracking cookie that remembers whether the
                  sidebar menu is expanded or collapsed. This cookie is not
                  sent to our servers or used to identify or track you.
                </li>
              </ul>
              <p className="font-semibold text-[#173A27] pt-2">
                Data received from third parties:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  If you sign in with Google, we receive your email address
                  from Google to create or match your account.
                </li>
              </ul>
              <p className="font-semibold text-[#173A27] pt-2">
                Data we do <span className="underline">not</span> collect:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  We do not use analytics, advertising, or tracking
                  technologies of any kind.
                </li>
                <li>We do not collect payment information.</li>
                <li>
                  We do not access your device's location, contacts, or
                  camera.
                </li>
              </ul>
            </Section>

            <Section id="how-we-use" title="3. How We Use Your Information">
              <ul className="list-disc pl-5 space-y-1">
                <li>To create and maintain your account and authenticate you;</li>
                <li>
                  To calculate your personalized calorie target and display
                  your food logs back to you;
                </li>
                <li>
                  To generate insights about eating patterns, computed only
                  from your own food logs from the preceding 30 days;
                </li>
                <li>To operate, maintain, and secure the Service.</li>
              </ul>
              <p>
                We do not use your data to train machine learning or AI
                models, and we do not sell your personal data.
              </p>
            </Section>

            <Section id="legal-basis" title="4. Legal Basis for Processing (EEA/UK Users)">
              <p>
                Where the GDPR applies, we process your data on the
                following legal bases: performance of a contract (to
                provide the Service you sign up for), and your consent where
                you choose to sign in via Google. You may withdraw consent
                for Google sign-in at any time by using email/password
                login instead, or by deleting your account.
              </p>
            </Section>

            <Section id="third-party-food-search" title="5. Food Search (USDA FoodData Central)">
              <p>
                When you search for a food item to log, your search text is
                sent directly from your browser to the U.S. Department of
                Agriculture's public FoodData Central API to retrieve
                nutritional data. This request does not include your name,
                email, or account information — only the search text you
                type.
              </p>
            </Section>

            <Section id="sharing" title="6. Data Sharing">
              <p>
                We do not sell your personal data. We share data only with
                the infrastructure providers necessary to run the Service:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Our hosting providers, to run the application and store data in our database;</li>
                <li>
                  Google, if you use Google Sign-In, subject to Google's own
                  privacy policy;
                </li>
                <li>
                  The U.S. Department of Agriculture's FoodData Central
                  service, for food search queries as described above.
                </li>
              </ul>
              <p>
                We do not share your data with advertisers or data brokers.
              </p>
            </Section>

            <Section id="international-transfers" title="7. International Data Transfers">
              <p>
                Because our infrastructure providers may operate servers in
                different countries, your data may be processed outside
                your country of residence, including outside the European
                Economic Area. Where this occurs, we rely on the safeguards
                our infrastructure providers make available for
                international data transfers.
              </p>
            </Section>

            <Section id="retention" title="8. Data Retention">
              <p>
                We retain your account and food-log data for as long as your
                account remains active. We do not currently have an
                automated retention or deletion schedule. If you request
                account deletion (see Section 10), we will delete your
                personal data within a reasonable time, except where we are
                required to retain limited information to comply with legal
                obligations.
              </p>
            </Section>

            <Section id="security" title="9. Data Security">
              <p>
                Passwords are stored as salted hashes, never in plain text.
                Authentication uses secure, HTTP-only session cookies
                transmitted over encrypted (HTTPS) connections. No method of
                transmission or storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </Section>

            <Section id="your-rights" title="10. Your Rights">
              <p>
                Depending on your location, you may have the right to
                access, correct, export, or delete your personal data, and
                to object to or restrict certain processing. You can delete
                individual food log entries directly within the app. To
                request access to, correction of, or full deletion of your
                account and associated data, email us at{' '}
                <a
                  href="mailto:begunicalem6@gmail.com"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  begunicalem6@gmail.com
                </a>
                . We will handle your request manually and respond within a
                reasonable time.
              </p>
            </Section>

            <Section id="children" title="11. Children's Privacy">
              <p>
                The Service requires users to be at least 13 years old and
                is not directed at children under that age. If you believe a
                child under 13 has provided us with personal data, contact
                us and we will delete it.
              </p>
            </Section>

            <Section id="cookies" title="12. Cookies">
              <p>
                We use one strictly necessary cookie (the session cookie) to
                keep you signed in, and one functional cookie to remember
                your sidebar display preference. We do not use cookies for
                advertising, analytics, or cross-site tracking.
              </p>
            </Section>

            <Section id="changes" title="13. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time.
                Material changes will be reflected by updating the "Last
                updated" date above.
              </p>
            </Section>

            <Section id="contact" title="14. Contact Us">
              <p>
                For any question or request regarding this Privacy Policy or
                your personal data, contact{' '}
                <a
                  href="mailto:begunicalem6@gmail.com"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  begunicalem6@gmail.com
                </a>
                . See also our{' '}
                <Link
                  to="/terms"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </Section>
          </div>
        </main>
      </div>
    </div>
  )
}
