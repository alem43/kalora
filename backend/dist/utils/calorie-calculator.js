const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};
const GOAL_ADJUSTMENTS = {
    lose_weight: -500,
    maintain: 0,
    gain_weight: 300,
    build_muscle: 250,
};
export function calculateCalorieGoal(params) {
    const { gender, age, height, weight, activityLevel, goal } = params;
    const bmrBase = 10 * weight + 6.25 * height - 5 * age;
    let bmr;
    if (gender === "male")
        bmr = bmrBase + 5;
    else if (gender === "female")
        bmr = bmrBase - 161;
    else
        bmr = bmrBase - 78;
    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
    const calorieGoal = tdee + GOAL_ADJUSTMENTS[goal];
    return Math.round(Math.max(1200, calorieGoal));
}
