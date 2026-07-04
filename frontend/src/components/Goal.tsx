import React, { useEffect } from 'react'
import { api, ApiError } from '#/lib/api'

interface GoalProps {
  refreshKey?: number
}

const Goal = ({ refreshKey }: GoalProps) => {
  const [foods, setFoods] = React.useState<any[]>([])
  const [goalCalories, setGoalCalories] = React.useState<number>(2000)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [foodData, meData] = await Promise.all([
        api.food.list(),
        api.auth.me(),
      ])
      setFoods(foodData)
      setGoalCalories(meData.calorieGoal)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Error loading food logs: ${err.code}`)
      } else {
        setError('Failed to load food logs')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalCalories = foods.reduce(
    (sum: number, food: any) => sum + Number(food.calories || 0),
    0,
  )
  const percentage = Math.min(
    100,
    Math.round((totalCalories / goalCalories) * 100),
  )
  const diff = goalCalories - totalCalories
  const remainingLabel =
    diff >= 0 ? `${diff} kcal remaining` : `${-diff} kcal over`

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#E2EEDB] p-8 animate-pulse flex flex-col gap-4">
        <div className="h-4 w-48 bg-[#E2EEDB] rounded"></div>
        <div className="h-8 w-full bg-[#F4F9F1] rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-5 bg-[#805033]/10 border border-[#805033]/20 rounded-[2rem] flex items-center gap-3">
        <svg
          className="w-5 h-5 text-[#805033]"
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
        <p className="text-sm font-bold text-[#805033]">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#E2EEDB] p-6 sm:p-8 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-full bg-[#F4F9F1] rounded-l-full z-0 opacity-40 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#82B85A] animate-pulse"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Energy Mapping Baseline
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#173A27]">
            {totalCalories.toLocaleString()}{' '}
            <span className="text-base font-medium text-gray-400">
              / {goalCalories.toLocaleString()} kcal consumed
            </span>
          </h2>
        </div>
        <div className="w-full lg:w-1/2 space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-[#173A27]">
              {percentage}% of baseline reached
            </span>
            <span className={diff >= 0 ? 'text-[#82B85A]' : 'text-[#805033]'}>
              {remainingLabel}
            </span>
          </div>
          <div className="w-full h-5 bg-[#F4F9F1] rounded-full p-1 border border-[#E2EEDB] overflow-hidden">
            <div
              style={{ width: `${Math.max(5, percentage)}%` }}
              className="h-full bg-linear-to-r from-[#82B85A] to-[#6da447] rounded-full transition-all duration-500 ease-out shadow-sm"
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Goal
