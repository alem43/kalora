import React, { useEffect, useState } from 'react'
import plusIcon from '../images/plus.svg'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { api, ApiError } from '#/lib/api'
import { generateMealVerdict } from '../lib/verdicts'

const API_KEY = import.meta.env.VITE_USDA_API_KEY || ''

const NUTRIENT_IDS = {
  CALORIES: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
  FIBER: 1079,
  SUGAR: 2000,
}

interface FoodLogProps {
  onFoodAdded?: () => void
  refreshKey?: number
}

const FoodLog = ({ onFoodAdded, refreshKey }: FoodLogProps) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState<any[]>([])
  const [selected, setSelected] = React.useState<any>(null)
  const [quantity, setQuantity] = React.useState(100)
  const [timeInput, setTimeInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [foods, setFoods] = React.useState<any[]>([])

  React.useEffect(() => {
    if (!search || search.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
            search,
          )}&dataType=Foundation,SR Legacy&pageSize=10&api_key=${API_KEY}`,
        )
        const data = await res.json()
        setResults(data.foods || [])
      } catch (err) {
        console.error('Search failed:', err)
        setResults([])
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchFoods()
  }, [refreshKey])

  useEffect(() => {
    if (open) {
      const now = new Date()
      const minutes = Math.floor(now.getMinutes() / 5) * 5
      now.setMinutes(minutes)
      now.setSeconds(0)
      const timeStr = now.toTimeString().slice(0, 5)
      setTimeInput(timeStr)
    }
  }, [open])

  const fetchFoods = async () => {
    try {
      const data = await api.food.list()
      setFoods(data)
    } catch (err) {
      console.error(err)
    }
  }

  const getNutrient = (food: any, nutrientId: number, qty = 100) => {
    const nutrient = food.foodNutrients?.find(
      (n: any) => n.nutrientId === nutrientId,
    )
    const baseValue = nutrient ? nutrient.value : 0
    return Math.round((baseValue * qty) / 100)
  }

  const handleSubmit = async () => {
    if (!selected || !quantity || !timeInput) return

    const [hours, minutes] = timeInput.split(':').map(Number)
    const loggedAt = new Date()
    loggedAt.setHours(hours, minutes, 0, 0)
    const hour = loggedAt.getHours()

    let mealType = 'snack'
    if (hour >= 5 && hour < 11) mealType = 'breakfast'
    else if (hour >= 11 && hour < 16) mealType = 'lunch'
    else if (hour >= 16 && hour < 22) mealType = 'dinner'

    try {
      const newFood = {
        foodName: selected.description,
        quantity: quantity,
        calories: getNutrient(selected, NUTRIENT_IDS.CALORIES, quantity),
        protein: getNutrient(selected, NUTRIENT_IDS.PROTEIN, quantity),
        carbs: getNutrient(selected, NUTRIENT_IDS.CARBS, quantity),
        fat: getNutrient(selected, NUTRIENT_IDS.FAT, quantity),
        fiber: getNutrient(selected, NUTRIENT_IDS.FIBER, quantity),
        sugar: getNutrient(selected, NUTRIENT_IDS.SUGAR, quantity),
        mealType: mealType,
        loggedAt: loggedAt,
      }

      const createdFood = await api.food.create(newFood)
      setFoods([...foods, createdFood])
      setSuccess(true)
      onFoodAdded?.()

      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setSearch('')
        setSelected(null)
        setQuantity(100)
        setTimeInput('')
        setResults([])
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('API error:', err.code, err.status)
      }
      console.error('Failed:', err)
    }
  }

  const groupedFoods = foods.reduce((acc: any, food: any) => {
    const meal = food.mealType || 'snack'
    if (!acc[meal]) acc[meal] = []
    acc[meal].push(food)
    return acc
  }, {})

  const getMealTotals = (foodsList: any[]) => {
    return foodsList.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat,
        fiber: totals.fiber + (food.fiber || 0),
        sugar: totals.sugar + (food.sugar || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
    )
  }

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <div className="space-y-10">
      <Drawer open={open} onOpenChange={setOpen}>
        {mealOrder
          .filter((mealType) => groupedFoods[mealType]?.length > 0)
          .map((mealType) => {
            const totals = getMealTotals(groupedFoods[mealType])
            const verdict = generateMealVerdict({
              category: mealType as any,
              calories: totals.calories,
              protein: totals.protein,
              carbs: totals.carbs,
              fats: totals.fat,
              fiber: totals.fiber,
              sugar: totals.sugar,
              hour: new Date(groupedFoods[mealType][0].loggedAt).getHours(),
            })

            return (
              <div
                key={mealType}
                className="bg-white rounded-[2rem] border border-[#E2EEDB] p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2EEDB] pb-4 mb-4 gap-2">
                  <div>
                    <h2 className="text-xl font-extrabold capitalize text-[#173A27] tracking-tight">
                      {mealType}
                    </h2>
                    <p className="text-xs font-bold text-[#82B85A] uppercase tracking-wider mt-0.5">
                      Chronological Window
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-500 bg-[#F4F9F1] border border-[#E2EEDB] px-3 py-1.5 rounded-full">
                    <span>{totals.calories} kcal</span>
                    <span className="text-[#E2EEDB]">|</span>
                    <span>{totals.protein}g P</span>
                    <span className="text-[#E2EEDB]">|</span>
                    <span>{totals.carbs}g C</span>
                    <span className="text-[#E2EEDB]">|</span>
                    <span>{totals.fat}g F</span>
                  </div>
                </div>
                {(verdict.concerns.length > 0 ||
                  verdict.positives.length > 0 ||
                  verdict.suggestions.length > 0) && (
                  <div className="mb-6 p-4 bg-[#FAFCF8] rounded-2xl border border-[#E2EEDB] space-y-2">
                    {verdict.concerns.map((item) => (
                      <p
                        key={item.text}
                        className="text-xs font-bold text-[#805033] flex items-center gap-1.5"
                      >
                        <span className="shrink-0 text-sm">⚠️</span> {item.text}
                      </p>
                    ))}
                    {verdict.positives.map((item) => (
                      <p
                        key={item.text}
                        className="text-xs font-bold text-[#82B85A] flex items-center gap-1.5"
                      >
                        <span className="shrink-0 text-sm">✅</span> {item.text}
                      </p>
                    ))}
                    {verdict.suggestions.map((item) => (
                      <p
                        key={item.text}
                        className="text-xs font-bold text-[#173A27] flex items-center gap-1.5"
                      >
                        <span className="shrink-0 text-sm">💡</span> {item.text}
                      </p>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedFoods[mealType]?.map((food: any) => (
                    <div
                      key={food.id}
                      className="rounded-2xl border border-[#E2EEDB] bg-white p-4 flex flex-col justify-between min-h-36 hover:border-[#82B85A]/40 hover:shadow-sm transition-all duration-300"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#173A27] line-clamp-2 leading-snug">
                          {food.foodName}
                        </p>
                        <p className="text-xs font-extrabold text-[#82B85A] mt-1">
                          {food.calories} kcal
                        </p>
                      </div>
                      <div className="flex items-end justify-between border-t border-[#F4F9F1] pt-2 mt-3">
                        <p className="text-xs text-gray-400 font-medium">
                          {food.quantity}g
                        </p>
                        <p className="text-xs text-gray-400 font-bold">
                          {new Date(food.loggedAt).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        <DrawerTrigger asChild>
          <div className="rounded-[2rem] border border-dashed border-[#82B85A]/40 bg-white p-6 min-h-36 flex flex-col items-center justify-center cursor-pointer hover:border-[#82B85A] hover:bg-[#F4F9F1]/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-full bg-[#F4F9F1] border border-[#E2EEDB] flex items-center justify-center mb-2 group-hover:bg-[#82B85A] transition-colors duration-300">
              <img
                src={plusIcon}
                alt="plus"
                className="w-4 h-4 group-hover:invert transition-all duration-300"
              />
            </div>
            <p className="text-sm font-bold text-[#173A27]">
              Log New Nutrient Profile
            </p>
          </div>
        </DrawerTrigger>
        <DrawerContent className="bg-[#FAFCF8] text-[#173A27] rounded-t-[2.5rem] border-t border-[#E2EEDB] max-h-[90vh]">
          <div className="overflow-y-auto max-w-lg mx-auto w-full px-6 py-4">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl font-extrabold tracking-tight text-[#173A27]">
                Log Food Profile
              </DrawerTitle>
            </DrawerHeader>
            {!selected ? (
              <Command
                shouldFilter={false}
                className="bg-white rounded-2xl border border-[#E2EEDB] overflow-hidden shadow-sm"
              >
                <CommandInput
                  placeholder="Query nutritional indexing registry..."
                  value={search}
                  onValueChange={setSearch}
                  className="border-none font-medium h-12 focus:ring-0 text-sm"
                />
                <CommandList className="border-t border-[#F4F9F1]">
                  {loading && (
                    <CommandEmpty className="text-sm py-6 text-gray-400 font-medium">
                      Querying USDA Registry...
                    </CommandEmpty>
                  )}
                  {!loading && search && results.length === 0 && (
                    <CommandEmpty className="text-sm py-6 text-gray-400 font-medium">
                      No metabolic metrics resolved.
                    </CommandEmpty>
                  )}
                  {!loading && results.length > 0 && (
                    <CommandGroup>
                      {results.map((food) => (
                        <CommandItem
                          key={food.fdcId}
                          onSelect={() => setSelected(food)}
                          className="cursor-pointer p-3 hover:bg-[#F4F9F1] transition-colors flex flex-col items-start gap-0.5 border-b border-[#FAFCF8] last:border-none"
                        >
                          <span className="font-bold text-sm text-[#173A27]">
                            {food.description}
                          </span>
                          <span className="text-xs text-[#82B85A] font-semibold">
                            {getNutrient(food, NUTRIENT_IDS.CALORIES)} kcal /
                            100g
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            ) : (
              <div className="space-y-5 mt-2">
                <div className="p-4 bg-white rounded-2xl border border-[#E2EEDB]">
                  <p className="font-bold text-sm text-[#173A27]">
                    {selected.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="quantity"
                      className="text-xs font-bold text-[#173A27] px-1"
                    >
                      Quantity (grams)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      className="bg-white border-[#E2EEDB] rounded-xl h-11 focus-visible:ring-[#82B85A]/20 focus-visible:border-[#82B85A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="time"
                      className="text-xs font-bold text-[#173A27] px-1"
                    >
                      Timestamp
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      className="bg-white border-[#E2EEDB] rounded-xl h-11 focus-visible:ring-[#82B85A]/20 focus-visible:border-[#82B85A]"
                    />
                  </div>
                </div>
                <div className="p-4 bg-white border border-[#E2EEDB] rounded-2xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Calculated Indexing ({quantity}g)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-[#FAFCF8] border border-[#E2EEDB] rounded-xl">
                      <p className="text-lg font-extrabold text-[#173A27]">
                        {getNutrient(selected, NUTRIENT_IDS.CALORIES, quantity)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        Calories
                      </p>
                    </div>
                    <div className="p-2 bg-[#FAFCF8] border border-[#E2EEDB] rounded-xl">
                      <p className="text-lg font-extrabold text-[#173A27]">
                        {getNutrient(selected, NUTRIENT_IDS.PROTEIN, quantity)}g
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        Protein
                      </p>
                    </div>
                    <div className="p-2 bg-[#FAFCF8] border border-[#E2EEDB] rounded-xl">
                      <p className="text-lg font-extrabold text-[#173A27]">
                        {getNutrient(selected, NUTRIENT_IDS.CARBS, quantity)}g
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        Carbs
                      </p>
                    </div>
                    <div className="p-2 bg-[#FAFCF8] border border-[#E2EEDB] rounded-xl">
                      <p className="text-lg font-extrabold text-[#173A27]">
                        {getNutrient(selected, NUTRIENT_IDS.FAT, quantity)}g
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        Fat
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#E2EEDB] hover:bg-[#F4F9F1] rounded-xl"
                  onClick={() => setSelected(null)}
                >
                  Modify Selection Base
                </Button>
              </div>
            )}
            <DrawerFooter className="px-0 pt-6 border-t border-[#E2EEDB] mt-6 flex flex-row gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!selected || !quantity || !timeInput || success}
                className={`flex-1 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                  success
                    ? 'bg-[#82B85A] hover:bg-[#82B85A] text-white'
                    : 'bg-[#173A27] text-white hover:bg-[#204E35]'
                }`}
              >
                {success ? '✓ Indexing Complete' : 'Commit Entry to Log'}
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-[#E2EEDB] font-bold text-sm px-6"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default FoodLog
