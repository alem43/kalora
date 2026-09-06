import { createFileRoute, Link } from '@tanstack/react-router'
import Navbar from '#/components/Navbar'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms & Conditions | Kalora' },
      {
        name: 'description',
        content:
          'Terms and conditions for using Kalora, a nutrition and meal-timing tracking application.',
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
              Terms &amp; Conditions
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-3">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div className="space-y-10 bg-white border border-[#E2EEDB] rounded-3xl p-6 sm:p-10 shadow-sm">
            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>
                These Terms &amp; Conditions ("Terms") govern your access to
                and use of Kalora (the "Service"), operated by Kalora
                ("we," "us," or "our"). By creating an account or using the
                Service, you agree to be bound by these Terms. If you do not
                agree, do not use the Service.
              </p>
            </Section>

            <Section id="eligibility" title="2. Eligibility">
              <p>
                You must be at least 13 years old to create an account. By
                registering, you confirm that you meet this minimum age
                requirement and that the information you provide is accurate.
              </p>
            </Section>

            <Section id="accounts" title="3. Your Account">
              <p>
                To use most features of Kalora, you must create an account
                using an email address and password, or sign in with Google.
                You are responsible for maintaining the confidentiality of
                your login credentials and for all activity that occurs under
                your account. Notify us promptly if you suspect unauthorized
                use of your account.
              </p>
            </Section>

            <Section id="the-service" title="4. What Kalora Does">
              <p>
                Kalora lets you log meals and track calorie and macronutrient
                intake. At signup, you provide details such as your gender,
                age, height, weight, activity level, and goal, which we use
                to calculate a personalized calorie target. Kalora also
                surfaces pattern-based insights (for example, late-night
                eating or low breakfast protein) derived from your own
                logged data over the preceding 30 days, and lets you look up
                nutritional information via a public food database while
                logging meals.
              </p>
            </Section>

            <Section id="acceptable-use" title="5. Acceptable Use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the Service for any unlawful purpose;</li>
                <li>
                  Attempt to gain unauthorized access to other accounts or to
                  Kalora's systems;
                </li>
                <li>
                  Interfere with or disrupt the Service, including through
                  automated scraping or excessive requests;
                </li>
                <li>
                  Submit false information that could compromise the
                  integrity or safety of the Service for other users; or
                </li>
                <li>
                  Reverse-engineer, decompile, or attempt to extract the
                  source code of the Service, except as permitted by law.
                </li>
              </ul>
            </Section>

            <Section
              id="informational-disclaimer"
              title="6. Not Medical or Nutritional Advice"
            >
              <p>
                Kalora provides general informational tools for tracking
                food intake and identifying patterns in your own logged
                data. Calorie targets, macronutrient breakdowns, and pattern
                insights are generated automatically and are{' '}
                <strong>not</strong> medical, dietary, or health advice, and
                are not a substitute for consultation with a qualified
                physician, registered dietitian, or other healthcare
                professional. Always seek professional guidance before
                making significant changes to your diet, especially if you
                have a medical condition, are pregnant, or are managing a
                health concern.
              </p>
            </Section>

            <Section id="third-party-data" title="7. Third-Party Data">
              <p>
                Food search results are provided by the U.S. Department of
                Agriculture's FoodData Central database, a public data
                source. We do not control or guarantee the accuracy of this
                third-party nutritional data, and you use it at your own
                discretion.
              </p>
            </Section>

            <Section id="ip" title="8. Intellectual Property">
              <p>
                The Service, including its design, branding, and underlying
                software, is owned by Kalora or its licensors and is
                protected by applicable intellectual property laws. You may
                not copy, modify, or distribute any part of the Service
                without permission. You retain ownership of the food and
                personal data you submit; you grant us a limited license to
                process it solely to operate the Service for you, as
                described in our{' '}
                <Link
                  to="/privacy"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

            <Section id="disclaimers" title="9. Disclaimers">
              <p>
                The Service is provided "as is" and "as available," without
                warranties of any kind, whether express or implied,
                including but not limited to accuracy, reliability, or
                fitness for a particular purpose. We do not guarantee that
                the Service will be uninterrupted, error-free, or secure.
              </p>
            </Section>

            <Section id="liability" title="10. Limitation of Liability">
              <p>
                To the fullest extent permitted by applicable law, Kalora
                shall not be liable for any indirect, incidental, special,
                or consequential damages arising from your use of, or
                inability to use, the Service, including any decisions made
                based on calorie estimates, macronutrient data, or insights
                generated by the Service.
              </p>
            </Section>

            <Section id="termination" title="11. Suspension &amp; Termination">
              <p>
                We may suspend or terminate your access to the Service if
                you violate these Terms. You may stop using the Service at
                any time. To request deletion of your account and associated
                data, contact us at{' '}
                <a
                  href="mailto:begunicalem6@gmail.com"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  begunicalem6@gmail.com
                </a>
                .
              </p>
            </Section>

            <Section id="changes-service" title="12. Changes to the Service">
              <p>
                We may modify, suspend, or discontinue any part of the
                Service at any time, with or without notice.
              </p>
            </Section>

            <Section id="changes-terms" title="13. Changes to These Terms">
              <p>
                We may update these Terms from time to time. Material
                changes will be reflected by updating the "Last updated"
                date above. Continued use of the Service after changes take
                effect constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section id="governing-law" title="14. Governing Law">
              <p>
                These Terms are governed by the laws of Bosnia and
                Herzegovina, without regard to its conflict-of-law
                provisions, without prejudice to any mandatory consumer
                protection rights you may have under the law of your country
                of residence.
              </p>
            </Section>

            <Section id="contact" title="15. Contact">
              <p>
                Questions about these Terms can be sent to{' '}
                <a
                  href="mailto:begunicalem6@gmail.com"
                  className="text-[#82B85A] font-semibold underline underline-offset-2"
                >
                  begunicalem6@gmail.com
                </a>
                .
              </p>
            </Section>
          </div>
        </main>
      </div>
    </div>
  )
}
