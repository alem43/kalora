import React from 'react'
import { useState, useEffect } from 'react'

const Goal = () => {
  const [foods, setFoods] = React.useState([])

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const res = await fetch('http://localhost:8787/food', {
        credentials: 'include',
      })

      if (!res.ok) return

      const data = await res.json()
      setFoods(data)
    } catch (err) {
      console.error(err)
    }
  }

  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0)

  const goalCalories = totalCalories + 500

  return (
    <>
      <p>
        {totalCalories} / {goalCalories}
      </p>
    </>
  )
}

export default Goal
