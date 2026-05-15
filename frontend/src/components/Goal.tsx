import React from 'react'
import { useState, useEffect } from 'react'
import { api, ApiError } from '#/lib/api'

const Goal = () => {
  const [foods, setFoods] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.food.list()
      setFoods(data)
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
  const goalCalories = totalCalories + 500

  if (loading) {
    return <p className="text-gray-600">Loading...</p>
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <>
      <p>
        {totalCalories} / {goalCalories}
      </p>
    </>
  )
}

export default Goal
