import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { api, ApiError } from '#/lib/api'
import { GoogleLogin } from '@react-oauth/google'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

const step1Schema = z
  .object({
    userName: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const step2Schema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  age: z.number().min(13, 'Must be at least 13').max(120),
  height: z.number().min(100, 'Height must be at least 100cm').max(250),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300),
  goalWeight: z.number().min(30).max(300).optional(),
  activityLevel: z.enum([
    'sedentary',
    'light',
    'moderate',
    'active',
    'very_active',
  ]),
  goal: z.enum(['lose_weight', 'maintain', 'gain_weight', 'build_muscle']),
})

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>
type CombinedFormData = Partial<Step1Values> & Partial<Step2Values>

function RouteComponent() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [serverError, setServerError] = useState<string>('')
  const [formData, setFormData] = useState<CombinedFormData>({})
  const [isGoogleSignup, setIsGoogleSignup] = useState(false)

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
  })

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      activityLevel: 'moderate',
      goal: 'maintain',
    },
  })

  const onStep1Submit = (data: Step1Values) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const onStep2Submit = async (data: Step2Values) => {
    try {
      setServerError('')

      if (isGoogleSignup) {
        await api.auth.completeOnboarding(data)
      } else {
        const completeData = { ...formData, ...data }
        await api.auth.register({
          userName: completeData.userName!,
          email: completeData.email!,
          password: completeData.password,
          gender: completeData.gender!,
          age: completeData.age!,
          height: completeData.height!,
          weight: completeData.weight!,
          goalWeight: completeData.goalWeight,
          activityLevel: completeData.activityLevel!,
          goal: completeData.goal!,
        })
      }

      setCurrentStep(3)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'EMAIL_EXISTS') {
          setServerError('This email is already registered')
        } else if (error.code === 'USERNAME_TAKEN') {
          setServerError('This username is already taken')
        } else if (error.code === 'VALIDATION_ERROR') {
          setServerError('Please check your information and try again')
        } else {
          setServerError(`Error: ${error.code}`)
        }
      } else {
        setServerError('Network error. Please try again.')
      }
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    currentStep >= step
                      ? 'bg-[#82B85A] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 mx-2 transition ${
                      currentStep > step ? 'bg-[#82B85A]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <p className="text-sm text-gray-600">
              {currentStep === 1 && 'Account Details'}
              {currentStep === 2 && 'Personal Information'}
              {currentStep === 3 && 'Success!'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{serverError}</p>
              {(serverError === 'This email is already registered' ||
                serverError === 'This username is already taken') && (
                <p className="text-sm text-red-600 mt-1">
                  <Link to="/login" className="underline font-medium">
                    Sign in instead
                  </Link>
                </p>
              )}
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h1>
                <p className="text-gray-600">Let's start with the basics</p>
              </div>
              <form
                onSubmit={step1Form.handleSubmit(onStep1Submit)}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Username
                  </label>
                  <input
                    {...step1Form.register('userName')}
                    type="text"
                    id="userName"
                    autoFocus
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                    placeholder="johndoe"
                  />
                  {step1Form.formState.errors.userName && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {step1Form.formState.errors.userName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    {...step1Form.register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                    placeholder="you@example.com"
                  />
                  {step1Form.formState.errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {step1Form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    {...step1Form.register('password')}
                    type="password"
                    id="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                    placeholder="••••••••"
                  />
                  {step1Form.formState.errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {step1Form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    {...step1Form.register('confirmPassword')}
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                    placeholder="••••••••"
                  />
                  {step1Form.formState.errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {step1Form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#82B85A] hover:bg-[#73a54d] text-white font-semibold py-3 rounded-lg transition"
                >
                  Continue
                </button>
              </form>
              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        setServerError('')
                        const res = await api.auth.googleLogin({
                          credential: credentialResponse.credential,
                        })
                        if (res.needsOnboarding) {
                          setIsGoogleSignup(true)
                          setFormData({
                            email: res.email,
                            userName: res.userName,
                          })
                          setCurrentStep(2)
                        } else {
                          navigate({ to: '/dashboard' })
                        }
                      } catch (error) {
                        console.error('Google login error:', error)
                        setServerError('Google login failed')
                      }
                    }}
                    onError={() => setServerError('Google login failed')}
                  />
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tell Us About Yourself
                </h1>
                <p className="text-gray-600">
                  Help us personalize your experience
                </p>
              </div>
              <form
                onSubmit={step2Form.handleSubmit(onStep2Submit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      {...step2Form.register('gender')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {step2Form.formState.errors.gender && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {step2Form.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Age
                    </label>
                    <input
                      {...step2Form.register('age', { valueAsNumber: true })}
                      type="number"
                      id="age"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                      placeholder="25"
                    />
                    {step2Form.formState.errors.age && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {step2Form.formState.errors.age.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Height (cm)
                    </label>
                    <input
                      {...step2Form.register('height', { valueAsNumber: true })}
                      type="number"
                      id="height"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                      placeholder="170"
                    />
                    {step2Form.formState.errors.height && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {step2Form.formState.errors.height.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="weight"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Weight (kg)
                    </label>
                    <input
                      {...step2Form.register('weight', { valueAsNumber: true })}
                      type="number"
                      id="weight"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                      placeholder="70"
                    />
                    {step2Form.formState.errors.weight && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {step2Form.formState.errors.weight.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="goalWeight"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Goal Weight (kg){' '}
                    <span className="text-gray-400">- Optional</span>
                  </label>
                  <input
                    {...step2Form.register('goalWeight', {
                      valueAsNumber: true,
                    })}
                    type="number"
                    id="goalWeight"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                    placeholder="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Activity Level
                  </label>
                  <select
                    {...step2Form.register('activityLevel')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                  >
                    <option value="sedentary">
                      Sedentary (little to no exercise)
                    </option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">
                      Very Active (intense daily)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Goal
                  </label>
                  <select
                    {...step2Form.register('goal')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B85A] focus:border-transparent transition outline-none"
                  >
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain_weight">Gain Weight</option>
                    <option value="build_muscle">Build Muscle</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={step2Form.formState.isSubmitting}
                    className="flex-1 bg-[#82B85A] hover:bg-[#73a54d] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {step2Form.formState.isSubmitting
                      ? 'Creating...'
                      : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          )}
          {currentStep === 3 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <svg
                    className="w-10 h-10 text-[#82B85A]"
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
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Successfully Registered!
              </h1>
              <p className="text-gray-600 mb-8">
                Your account has been created. Let's start your nutrition
                journey!
              </p>
              <button
                onClick={() => navigate({ to: '/dashboard' })}
                className="bg-[#82B85A] hover:bg-[#73a54d] text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
