import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { generateMealVerdict } from '../lib/verdicts'
import type { MealCategory } from '../lib/verdicts'
import { api } from '#/lib/api'

const API_KEY = import.meta.env.VITE_USDA_API_KEY || ''

const NUTRIENT_IDS = {
  CALORIES: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
  FIBER: 1079,
  SUGAR: 2000,
}

const MEAL_CATEGORIES: MealCategory[] = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
]

function getMealFromHour(hour: number): MealCategory {
  if (hour >= 5 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 16) return 'lunch'
  if (hour >= 16 && hour < 22) return 'dinner'
  return 'snack'
}

type Props = {
  onFoodLogged?: () => void
}

export function ShouldIEatThis({ onFoodLogged }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [quantity, setQuantity] = useState(100)
  const [mealCategory, setMealCategory] = useState<MealCategory>(
    getMealFromHour(new Date().getHours()),
  )
  const [loading, setLoading] = useState(false)
  const [logged, setLogged] = useState(false)

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearch('')
      setSelected(null)
      setQuantity(100)
      setMealCategory(getMealFromHour(new Date().getHours()))
      setLogged(false)
      setResults([])
    }
  }, [open])

  // USDA food search (debounced)
  useEffect(() => {
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
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const getNutrient = (food: any, nutrientId: number, qty = 100) => {
    const nutrient = food.foodNutrients?.find(
      (n: any) => n.nutrientId === nutrientId,
    )
    const base = nutrient ? nutrient.value : 0
    return Math.round((base * qty) / 100)
  }

  // Recompute nutrients live as quantity changes
  const nutrients = useMemo(() => {
    if (!selected) return null
    return {
      calories: getNutrient(selected, NUTRIENT_IDS.CALORIES, quantity),
      protein: getNutrient(selected, NUTRIENT_IDS.PROTEIN, quantity),
      carbs: getNutrient(selected, NUTRIENT_IDS.CARBS, quantity),
      fat: getNutrient(selected, NUTRIENT_IDS.FAT, quantity),
      fiber: getNutrient(selected, NUTRIENT_IDS.FIBER, quantity),
      sugar: getNutrient(selected, NUTRIENT_IDS.SUGAR, quantity),
    }
  }, [selected, quantity])

  // Recompute verdict live as nutrients or meal type changes
  const verdict = useMemo(() => {
    if (!nutrients) return null
    return generateMealVerdict({
      category: mealCategory,
      calories: nutrients.calories,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fats: nutrients.fat,
      fiber: nutrients.fiber,
      sugar: nutrients.sugar,
      hour: new Date().getHours(),
    })
  }, [nutrients, mealCategory])

  const hasVerdict =
    verdict &&
    (verdict.positives.length > 0 ||
      verdict.concerns.length > 0 ||
      verdict.suggestions.length > 0)

  const handleLog = async () => {
    if (!selected || !nutrients) return
    try {
      await api.food.create({
        foodName: selected.description,
        quantity,
        calories: nutrients.calories,
        protein: nutrients.protein,
        carbs: nutrients.carbs,
        fat: nutrients.fat,
        fiber: nutrients.fiber,
        sugar: nutrients.sugar,
        mealType: mealCategory,
        loggedAt: new Date(),
      })
      setLogged(true)
      onFoodLogged?.()
      setTimeout(() => setOpen(false), 1500)
    } catch (err) {
      console.error('Failed to log:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="rounded-3xl box-shadow p-5 min-h-40 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition gap-2">
          <span className="text-3xl">🤔</span>
          <p className="font-semibold text-center">Should I eat this?</p>
          <p className="text-xs text-muted-foreground text-center">
            Check before you eat
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Should I eat this?</DialogTitle>
        </DialogHeader>

        {!selected ? (
          // Phase 1: search
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search food..."
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList>
              {loading && <CommandEmpty>Searching...</CommandEmpty>}
              {!loading && search && results.length === 0 && (
                <CommandEmpty>No results</CommandEmpty>
              )}
              {!loading && results.length > 0 && (
                <CommandGroup>
                  {results.map((food) => (
                    <CommandItem
                      key={food.fdcId}
                      onSelect={() => setSelected(food)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col w-full">
                        <span className="font-medium">{food.description}</span>
                        <span className="text-xs text-muted-foreground">
                          per 100g: {getNutrient(food, NUTRIENT_IDS.CALORIES)}{' '}
                          cal
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        ) : (
          // Phase 2: verdict
          <div className="space-y-5">
            {/* Selected food header */}
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-xl">
                <p className="font-semibold text-sm">{selected.description}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelected(null)}
              >
                ✕
              </Button>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <Label htmlFor="qty">Quantity (g)</Label>
              <Input
                id="qty"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                min="1"
              />
            </div>

            {/* Meal type selector */}
            <div className="space-y-1">
              <Label>Meal type</Label>
              <div className="flex gap-2 flex-wrap">
                {MEAL_CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={mealCategory === cat ? 'default' : 'outline'}
                    onClick={() => setMealCategory(cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Nutrition grid */}
            {nutrients && (
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Cal', value: nutrients.calories },
                  { label: 'Protein', value: `${nutrients.protein}g` },
                  { label: 'Carbs', value: `${nutrients.carbs}g` },
                  { label: 'Fat', value: `${nutrients.fat}g` },
                  { label: 'Fiber', value: `${nutrients.fiber}g` },
                  { label: 'Sugar', value: `${nutrients.sugar}g` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2 bg-muted rounded-lg">
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Live verdict */}
            {hasVerdict && (
              <div className="rounded-2xl border p-4 space-y-2">
                <p className="font-semibold text-sm mb-1">Verdict</p>
                {verdict!.concerns.map((item) => (
                  <p key={item.text} className="text-sm text-orange-600">
                    ⚠️ {item.text}
                  </p>
                ))}
                {verdict!.positives.map((item) => (
                  <p key={item.text} className="text-sm text-green-600">
                    ✅ {item.text}
                  </p>
                ))}
                {verdict!.suggestions.map((item) => (
                  <p key={item.text} className="text-sm text-blue-600">
                    💡 {item.text}
                  </p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className={`flex-1 transition-all duration-300 ${
                  logged ? 'bg-green-600 hover:bg-green-600' : ''
                }`}
                onClick={handleLog}
                disabled={logged}
              >
                {logged ? '✓ Logged!' : 'Log it anyway'}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Skip
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShouldIEatThis
