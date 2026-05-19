export function getMealVerdict(mealFoods) {
  const totals = mealFoods.reduce(
    (acc, food) => {
      acc.calories += food.calories
      acc.protein += food.protein
      acc.carbs += food.carbs
      acc.fat += food.fat

      return acc
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  )

  const latestFood = mealFoods[mealFoods.length - 1]

  const hour = new Date(latestFood.loggedAt).getHours()

  if (totals.calories >= 1200) {
    return 'Very high calorie meal'
  }

  if (totals.protein >= 40) {
    return 'High protein meal'
  }

  if (totals.carbs >= 100) {
    return 'Carb-heavy meal'
  }

  if (totals.protein <= 10) {
    return 'Low protein meal'
  }

  if (hour >= 22 && totals.calories >= 500) {
    return 'Large late-night meal'
  }

  return null
}
