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
        <div className="w-full bg-[#F4F9F1] border border-[#E2EEDB] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-[#82B85A] hover:bg-white hover:shadow-sm transition-all duration-300 group gap-1">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            🤔
          </span>
          <p className="font-extrabold text-[#173A27] text-sm mt-1">
            Execute Sync Audit
          </p>
          <p className="text-[11px] text-gray-400 font-medium">
            Verify compatibility indexes live
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-[#FAFCF8] text-[#173A27] rounded-[2.5rem] border border-[#E2EEDB] p-6 shadow-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-[#173A27]">
            Metabolic Sync Audit
          </DialogTitle>
        </DialogHeader>

        {!selected ? (
          <Command
            shouldFilter={false}
            className="bg-white rounded-2xl border border-[#E2EEDB] overflow-hidden shadow-sm"
          >
            <CommandInput
              placeholder="Query structural profile registry..."
              value={search}
              onValueChange={setSearch}
              className="border-none font-medium h-12 focus:ring-0 text-sm"
              autoFocus
            />
            <CommandList className="border-t border-[#F4F9F1]">
              {loading && (
                <CommandEmpty className="text-sm py-6 text-gray-400 font-medium">
                  Querying USDA Registry...
                </CommandEmpty>
              )}
              {!loading && search && results.length === 0 && (
                <CommandEmpty className="text-sm py-6 text-gray-400 font-medium">
                  No records found.
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
                        {getNutrient(food, NUTRIENT_IDS.CALORIES)} kcal / 100g
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-white rounded-xl border border-[#E2EEDB]">
                <p className="font-bold text-xs text-[#173A27] line-clamp-2">
                  {selected.description}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-[#805033] h-10 w-10 rounded-full shrink-0"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="qty"
                className="text-xs font-bold text-[#173A27] px-1"
              >
                Quantity (g)
              </Label>
              <Input
                id="qty"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                min="1"
                className="bg-white border-[#E2EEDB] rounded-xl h-11 focus-visible:ring-[#82B85A]/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173A27] px-1">
                Target Mapping Interval
              </Label>
              <div className="flex gap-1.5 flex-wrap">
                {MEAL_CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={mealCategory === cat ? 'default' : 'outline'}
                    onClick={() => setMealCategory(cat)}
                    className={`capitalize rounded-xl text-xs font-bold px-3 py-1.5 ${
                      mealCategory === cat
                        ? 'bg-[#173A27] text-white hover:bg-[#173A27]'
                        : 'bg-white border-[#E2EEDB] text-[#173A27] hover:bg-[#F4F9F1]'
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {nutrients && (
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-white border border-[#E2EEDB] rounded-2xl">
                {[
                  { label: 'Cal', value: nutrients.calories },
                  { label: 'Protein', value: `${nutrients.protein}g` },
                  { label: 'Carbs', value: `${nutrients.carbs}g` },
                  { label: 'Fat', value: `${nutrients.fat}g` },
                  { label: 'Fiber', value: `${nutrients.fiber}g` },
                  { label: 'Sugar', value: `${nutrients.sugar}g` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="p-2 bg-[#FAFCF8] rounded-xl border border-[#F4F9F1]"
                  >
                    <p className="text-sm font-extrabold text-[#173A27]">
                      {value}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {hasVerdict && (
              <div className="rounded-2xl border border-[#E2EEDB] bg-white p-4 space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">
                  Live Audit Verdict
                </p>
                {verdict!.concerns.map((item) => (
                  <p
                    key={item.text}
                    className="text-xs font-bold text-[#805033] flex items-center gap-1.5"
                  >
                    <span className="shrink-0 text-sm">⚠️</span> {item.text}
                  </p>
                ))}
                {verdict!.positives.map((item) => (
                  <p
                    key={item.text}
                    className="text-xs font-bold text-[#82B85A] flex items-center gap-1.5"
                  >
                    <span className="shrink-0 text-sm">✅</span> {item.text}
                  </p>
                ))}
                {verdict!.suggestions.map((item) => (
                  <p
                    key={item.text}
                    className="text-xs font-bold text-[#173A27] flex items-center gap-1.5"
                  >
                    <span className="shrink-0 text-sm">💡</span> {item.text}
                  </p>
                ))}
              </div>
            )}

            <div className="flex gap-3 border-t border-[#E2EEDB] pt-4 mt-2">
              <Button
                className={`flex-1 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                  logged
                    ? 'bg-[#82B85A] hover:bg-[#82B85A] text-white'
                    : 'bg-[#173A27] text-white hover:bg-[#204E35]'
                }`}
                onClick={handleLog}
                disabled={logged}
              >
                {logged ? '✓ Added to Track' : 'Log Profile Anyway'}
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-[#E2EEDB] font-bold text-sm px-6"
                onClick={() => setOpen(false)}
              >
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
