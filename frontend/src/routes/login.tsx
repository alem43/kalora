import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { api, ApiError } from '#/lib/api'
import { GoogleLogin } from '@react-oauth/google'
import logoImage from '../images/logo_image.png' // Assuming same path structure

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string>('')

  const loginValuesSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  })

  type LoginValues = z.infer<typeof loginValuesSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginValuesSchema),
  })

  const onSubmit = async (data: LoginValues) => {
    try {
      setServerError('')
      await api.auth.login({
        email: data.email,
        password: data.password,
      })
      navigate({ to: '/' })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setServerError('Invalid credentials. Rhythm out of sync.')
        } else {
          setServerError(`Error: ${error.code}`)
        }
      } else {
        setServerError('Network disruption. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFCF8] text-[#173A27] font-sans selection:bg-[#82B85A]/30 selection:text-[#173A27] flex items-center justify-center p-4 relative overflow-hidden antialiased">
      {/* SUBTLE BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#82B85A]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#805033]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 z-0 pointer-events-none"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="mb-8 flex justify-center">
          <Link to="/" className="group flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[#E2EEDB] flex items-center justify-center group-hover:border-[#82B85A] transition-colors duration-300">
              <img src={logoImage} alt="Kalora" className="h-6 w-auto" />
            </div>
            <span className="text-3xl font-extrabold tracking-tighter text-[#173A27]">
              Kalora
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(23,58,39,0.1)] border border-[#E2EEDB] p-8 sm:p-10 relative overflow-hidden">
          {/* Internal corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4F9F1] rounded-bl-full -z-0 opacity-50"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Sync Your Rhythm
              </h1>
              <p className="text-gray-500 font-medium">
                Welcome back to your metabolic compass.
              </p>
            </div>

            {serverError && (
              <div className="mb-8 p-4 bg-[#805033]/10 border border-[#805033]/20 rounded-2xl flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#805033] shrink-0"
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
                <p className="text-sm font-bold text-[#805033]">
                  {serverError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-[#173A27] mb-2 px-1"
                  >
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    autoFocus
                    className="w-full px-5 py-4 bg-[#F4F9F1]/50 border border-[#E2EEDB] rounded-2xl focus:ring-4 focus:ring-[#82B85A]/10 focus:border-[#82B85A] transition-all outline-none text-[#173A27] font-medium placeholder:text-gray-400"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs font-bold text-[#805033] px-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold text-[#173A27]"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-bold text-[#82B85A] hover:text-[#173A27] transition-colors"
                    >
                      Forgot?
                    </a>
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className="w-full px-5 py-4 bg-[#F4F9F1]/50 border border-[#E2EEDB] rounded-2xl focus:ring-4 focus:ring-[#82B85A]/10 focus:border-[#82B85A] transition-all outline-none text-[#173A27] font-medium tracking-widest placeholder:tracking-normal placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-2 text-xs font-bold text-[#805033] px-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#173A27] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#204E35] hover:shadow-[0_8px_25px_rgba(23,58,39,0.2)] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Aligning...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2EEDB]"></div>
              </div>
              <div className="relative bg-white px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                Or connect with
              </div>
            </div>

            <div className="mt-8 flex justify-center w-full overflow-hidden rounded-full border border-[#E2EEDB] hover:border-[#82B85A] hover:bg-[#F4F9F1] transition-all duration-300">
              {/* Note: GoogleLogin has its own default styling, we wrap it to contain its borders within our aesthetic */}
              <div className="scale-[1.02] transform w-full flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      setServerError('')
                      await api.auth.googleLogin({
                        credential: credentialResponse.credential,
                      })
                      navigate({ to: '/dashboard' })
                    } catch (error) {
                      setServerError('Google alignment failed.')
                    }
                  }}
                  onError={() => setServerError('Google alignment failed.')}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="pill"
                  logo_alignment="center"
                  width="100%"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          New to the rhythm?{' '}
          <Link
            to="/register"
            className="text-[#82B85A] font-bold hover:text-[#173A27] transition-colors underline decoration-[#82B85A]/30 underline-offset-4"
          >
            Start your map
          </Link>
        </p>
      </div>
    </div>
  )
}
