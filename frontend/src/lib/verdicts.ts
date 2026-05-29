export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type Meal = {
  category: MealCategory
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium?: number
  hour: number

  speed?: 'fast' | 'normal' | 'slow'
  emotionalState?: 'good' | 'neutral' | 'stressed' | 'tired'
  hungerBefore?: number
  fullnessAfter?: number
}

export type Insight = {
  text: string
  severity: 1 | 2 | 3
}

export type Verdict = {
  positives: Insight[]
  concerns: Insight[]
  suggestions: Insight[]
}

export function generateMealVerdict(meal: Meal): Verdict {
  const positives: Insight[] = []
  const concerns: Insight[] = []
  const suggestions: Insight[] = []

  const addPositive = (text: string, severity: 1 | 2 | 3 = 1) => {
    positives.push({ text, severity })
  }

  const addConcern = (text: string, severity: 1 | 2 | 3 = 1) => {
    concerns.push({ text, severity })
  }

  const addSuggestion = (text: string, severity: 1 | 2 | 3 = 1) => {
    suggestions.push({ text, severity })
  }

  if (meal.protein < 15) {
    addConcern('Low protein may reduce fullness.', 2)

    addSuggestion('Adding protein could improve satiety.', 1)
  }

  if (meal.protein < 10) {
    addConcern('This meal may not keep you satisfied for very long.', 2)
  }

  if (meal.protein > 25) {
    addPositive('High protein supports fullness and recovery.', 2)
  }

  if (meal.protein > 35) {
    addPositive('Strong protein intake may improve appetite control later.', 2)
  }

  if (meal.fiber < 5) {
    addConcern('Low fiber may lead to earlier hunger.', 2)

    addSuggestion(
      'Adding vegetables, fruit, or whole grains may improve fullness.',
      1,
    )
  }

  if (meal.fiber < 3) {
    addConcern('This meal lacks slower-digesting foods.', 2)
  }

  if (meal.fiber > 8) {
    addPositive('Fiber content may support stable fullness.', 2)
  }

  if (meal.fiber > 12) {
    addPositive('High fiber intake may improve appetite stability.', 2)
  }

  if (meal.sugar > 30) {
    addConcern('High sugar intake may cause unstable energy later.', 2)
  }

  if (meal.sugar > 45) {
    addConcern('This meal may lead to a quicker energy crash.', 3)
  }

  if (meal.sugar > 60) {
    addConcern('Very high sugar concentration detected.', 3)
  }

  if (meal.sugar < 10) {
    addPositive('Sugar content is relatively controlled.', 1)
  }

  if (meal.calories > 1200) {
    addConcern('Large calorie spike detected.', 2)
  }

  if (meal.calories > 1500) {
    addConcern('This is a very calorie-dense meal.', 3)
  }

  if (meal.calories < 250) {
    addConcern('This meal may be too small to sustain energy for long.', 1)
  }

  if (meal.calories >= 400 && meal.calories <= 700) {
    addPositive('Calorie intake appears balanced for this meal.', 1)
  }

  if (meal.category === 'breakfast' && meal.protein < 15) {
    addConcern('Low-protein breakfasts may lead to earlier hunger.', 2)
  }

  if (meal.category === 'breakfast' && meal.sugar > 35) {
    addConcern(
      'High-sugar breakfasts may cause energy fluctuations later in the day.',
      2,
    )
  }

  if (meal.category === 'breakfast' && meal.fiber < 5) {
    addConcern('Low fiber breakfast may not provide long-lasting fullness.', 2)
  }

  if (meal.category === 'breakfast' && meal.protein > 25) {
    addPositive(
      'High-protein breakfasts often improve appetite control during the day.',
      2,
    )
  }

  if (meal.category === 'lunch' && meal.calories > 1400) {
    addConcern('Heavy lunches may reduce afternoon energy levels.', 2)
  }

  if (meal.category === 'lunch' && meal.protein > 30) {
    addPositive('Strong protein lunch supports stable afternoon energy.', 2)
  }

  if (meal.category === 'dinner' && meal.calories > 1200) {
    addConcern('Large evening meals may increase likelihood of overeating.', 2)
  }

  if (meal.category === 'dinner' && meal.sugar > 30) {
    addConcern('High-sugar dinners may affect next-day hunger patterns.', 2)
  }

  if (meal.category === 'dinner' && meal.fiber < 5) {
    addConcern('Low fiber dinners may not keep you full overnight.', 2)
  }

  if (meal.category === 'snack' && meal.protein < 8) {
    addConcern('Low-protein snacks may not satisfy cravings for long.', 2)
  }

  if (meal.category === 'snack' && meal.sugar > 25) {
    addConcern('High-sugar snacks may increase cravings later.', 2)
  }

  if (meal.hour >= 22 && meal.calories > 800) {
    addConcern(
      'Late-night high-calorie meals may weaken appetite regulation over time.',
      3,
    )
  }

  if (meal.hour >= 23 && meal.sugar > 35) {
    addConcern(
      'Late-night high sugar intake may increase next-day cravings.',
      3,
    )
  }

  if (meal.hour >= 22 && meal.protein > 25) {
    addPositive(
      'Protein intake at night may help reduce late-night snacking.',
      1,
    )
  }

  if (meal.protein < 15 && meal.fiber < 5) {
    addConcern(
      'Low protein and low fiber together may reduce fullness significantly.',
      3,
    )
  }

  if (meal.protein > 25 && meal.fiber > 8) {
    addPositive('Protein and fiber together support strong satiety.', 3)
  }

  if (meal.sugar > 40 && meal.fiber < 5) {
    addConcern(
      'High sugar with low fiber may cause energy spikes and crashes.',
      3,
    )
  }

  if (meal.carbs > 90 && meal.protein < 15) {
    addConcern('High carbs with low protein may increase hunger later.', 2)
  }

  if (meal.speed === 'fast') {
    addConcern('Fast eating may reduce fullness awareness.', 1)
  }

  if (meal.speed === 'fast' && meal.calories > 800) {
    addConcern(
      'Eating quickly with large meals may increase overeating risk.',
      2,
    )
  }

  if (meal.speed === 'slow') {
    addPositive('Slower eating may improve satiety awareness.', 1)
  }

  if (meal.emotionalState === 'stressed' && meal.sugar > 30) {
    addConcern('Stress-related high sugar intake may reinforce cravings.', 2)
  }

  if (meal.emotionalState === 'tired' && meal.calories > 1000) {
    addConcern('Fatigue may be influencing higher calorie intake.', 2)
  }

  if (meal.hungerBefore !== undefined && meal.hungerBefore >= 9) {
    addConcern('Extreme hunger may increase overeating likelihood.', 2)
  }

  if (meal.fullnessAfter !== undefined && meal.fullnessAfter <= 4) {
    addConcern('This meal may not have been very satisfying.', 2)
  }

  if (meal.fullnessAfter !== undefined && meal.fullnessAfter >= 8) {
    addPositive('This meal appears to provide strong fullness.', 2)
  }

  if (meal.protein < 20 && meal.category !== 'snack') {
    addSuggestion(
      'Adding eggs, yogurt, chicken, fish, tofu, or beans could improve satiety.',
      1,
    )
  }

  if (meal.fiber < 5) {
    addSuggestion('Adding fruit or vegetables may help improve fullness.', 1)
  }

  if (meal.hour >= 22 && meal.calories > 900) {
    addSuggestion(
      'A lighter late-night meal may feel more satisfying than expected.',
      1,
    )
  }

  positives.sort((a, b) => b.severity - a.severity)

  concerns.sort((a, b) => b.severity - a.severity)

  suggestions.sort((a, b) => b.severity - a.severity)

  return {
    positives: positives.slice(0, 3),
    concerns: concerns.slice(0, 4),
    suggestions: suggestions.slice(0, 2),
  }
}
