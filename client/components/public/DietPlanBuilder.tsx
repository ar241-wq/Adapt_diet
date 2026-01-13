'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { DietPlanRequest, DietPlanResponse, DayPlan, Meal } from '@/types';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

const ALLERGIES = [
  { id: 'nuts', label: 'Nuts' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'soy', label: 'Soy' },
  { id: 'sesame', label: 'Sesame' },
];

const GOALS = [
  { id: 'lose', label: 'Lose Weight', description: '-500 cal/day' },
  { id: 'maintain', label: 'Maintain Weight', description: 'Stay balanced' },
  { id: 'gain', label: 'Build Muscle', description: '+300 cal/day' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { id: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
  { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
  { id: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
  { id: 'very_active', label: 'Very Active', description: 'Very hard exercise daily' },
];

function MealCard({ meal, mealType }: { meal: Meal | null; mealType: string }) {
  if (!meal) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
          {mealType}
        </span>
        <span className="text-sm font-semibold text-gray-700">{meal.calories} cal</span>
      </div>
      <h4 className="font-medium text-gray-900 mb-2">{meal.name}</h4>
      <div className="flex gap-3 text-xs text-gray-500">
        <span>P: {meal.protein}g</span>
        <span>C: {meal.carbs}g</span>
        <span>F: {meal.fats}g</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {meal.ingredients.slice(0, 4).map((ing, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {ing}
          </span>
        ))}
        {meal.ingredients.length > 4 && (
          <span className="text-xs text-gray-400">+{meal.ingredients.length - 4} more</span>
        )}
      </div>
    </div>
  );
}

function DayCard({ dayPlan }: { dayPlan: DayPlan }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{dayPlan.day}</h3>
        <div className="text-right">
          <span className="text-sm font-medium text-primary-600">
            {dayPlan.totals.calories} cal
          </span>
          <div className="text-xs text-gray-500">
            P: {dayPlan.totals.protein}g | C: {dayPlan.totals.carbs}g | F: {dayPlan.totals.fats}g
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MealCard meal={dayPlan.meals.breakfast} mealType="Breakfast" />
        <MealCard meal={dayPlan.meals.lunch} mealType="Lunch" />
        <MealCard meal={dayPlan.meals.dinner} mealType="Dinner" />
        <MealCard meal={dayPlan.meals.snack} mealType="Snack" />
      </div>
    </div>
  );
}

export default function DietPlanBuilder() {
  const [formData, setFormData] = useState<DietPlanRequest>({
    height: 170,
    weight: 70,
    allergies: [],
    goal: 'maintain',
    age: 30,
    gender: 'male',
    activity_level: 'moderate',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<DietPlanResponse | null>(null);
  const [activeDay, setActiveDay] = useState<number>(0);

  const handleAllergyToggle = (allergyId: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies?.includes(allergyId)
        ? prev.allergies.filter((a) => a !== allergyId)
        : [...(prev.allergies || []), allergyId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.generateDietPlan(formData);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setActiveDay(0);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Build Your Plan with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a personalized 7-day meal plan based on your body metrics and dietary preferences
          </p>
        </div>

        {!plan ? (
          /* Form */
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
              {/* Body Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      min="100"
                      max="250"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      min="30"
                      max="300"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      min="18"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Goal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal: goal.id as 'lose' | 'maintain' | 'gain' })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.goal === goal.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{goal.label}</div>
                      <div className="text-sm text-gray-500">{goal.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Level</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, activity_level: level.id as DietPlanRequest['activity_level'] })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.activity_level === level.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies & Restrictions</h3>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map((allergy) => (
                    <button
                      key={allergy.id}
                      type="button"
                      onClick={() => handleAllergyToggle(allergy.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.allergies?.includes(allergy.id)
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {formData.allergies?.includes(allergy.id) && (
                        <span className="mr-1">x</span>
                      )}
                      {allergy.label}
                    </button>
                  ))}
                </div>
                {formData.allergies && formData.allergies.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Meals containing {formData.allergies.join(', ')} will be excluded
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-center">
                <Button type="submit" size="lg" isLoading={loading} className="px-12">
                  Generate My Plan
                </Button>
              </div>
            </div>
          </form>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Your Personalized Plan</h3>
                  <p className="text-gray-600">
                    Based on your profile: {plan.user_info.height}cm, {plan.user_info.weight}kg, {plan.user_info.age} years old
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Create New Plan
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary-600">{plan.daily_calorie_target}</div>
                  <div className="text-sm text-gray-600">Daily Calories</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-700">{plan.bmr}</div>
                  <div className="text-sm text-gray-600">BMR</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-700">{plan.tdee}</div>
                  <div className="text-sm text-gray-600">TDEE</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 capitalize">{plan.goal}</div>
                  <div className="text-sm text-gray-600">Goal</div>
                </div>
              </div>

              {plan.allergies.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span>Excluded:</span>
                  {plan.allergies.map((a) => (
                    <span key={a} className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Day Selector */}
            <div className="flex overflow-x-auto gap-2 pb-2">
              {plan.week_plan.map((day, index) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(index)}
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeDay === index
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>

            {/* Active Day Plan */}
            <DayCard dayPlan={plan.week_plan[activeDay]} />

            {/* All Days Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Day</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Calories</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Protein</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Carbs</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Fats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.week_plan.map((day) => (
                      <tr key={day.day} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{day.day}</td>
                        <td className="py-3 px-4 text-primary-600 font-semibold">{day.totals.calories}</td>
                        <td className="py-3 px-4 text-gray-600">{day.totals.protein}g</td>
                        <td className="py-3 px-4 text-gray-600">{day.totals.carbs}g</td>
                        <td className="py-3 px-4 text-gray-600">{day.totals.fats}g</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td className="py-3 px-4 text-gray-900">Weekly Avg</td>
                      <td className="py-3 px-4 text-primary-600">
                        {Math.round(plan.week_plan.reduce((sum, d) => sum + d.totals.calories, 0) / 7)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {Math.round(plan.week_plan.reduce((sum, d) => sum + d.totals.protein, 0) / 7)}g
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {Math.round(plan.week_plan.reduce((sum, d) => sum + d.totals.carbs, 0) / 7)}g
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {Math.round(plan.week_plan.reduce((sum, d) => sum + d.totals.fats, 0) / 7)}g
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
