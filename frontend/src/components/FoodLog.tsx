import React from 'react'
import { useEffect, useState } from 'react'
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
import { getMealVerdict } from '../utils/mealVerdict'

const API_KEY = import.meta.env.VITE_USDA_API_KEY || ''

const NUTRIENT_IDS = {
  CALORIES: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
}

const FoodLog = ({ onFoodAdded }) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState([])
  const [selected, setSelected] = React.useState(null)
  const [quantity, setQuantity] = React.useState(100)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [foods, setFoods] = React.useState([])

  React.useEffect(() => {
    if (!search || search.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(search)}&dataType=Foundation,SR Legacy&pageSize=10&api_key=${API_KEY}`,
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
  }, [])

  const fetchFoods = async () => {
    try {
      const data = await api.food.list()
      setFoods(data)
    } catch (err) {
      console.error(err)
    }
  }

  const getNutrient = (food, nutrientId, qty = 100) => {
    const nutrient = food.foodNutrients?.find(
      (n) => n.nutrientId === nutrientId,
    )
    const baseValue = nutrient ? nutrient.value : 0
    return Math.round((baseValue * qty) / 100)
  }

  const handleSubmit = async () => {
    if (!selected || !quantity) return

    try {
      const newFood = {
        foodName: selected.description,
        quantity: quantity,
        calories: getNutrient(selected, NUTRIENT_IDS.CALORIES, quantity),
        protein: getNutrient(selected, NUTRIENT_IDS.PROTEIN, quantity),
        carbs: getNutrient(selected, NUTRIENT_IDS.CARBS, quantity),
        fat: getNutrient(selected, NUTRIENT_IDS.FAT, quantity),
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
        setResults([])
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('API error:', err.code, err.status)
      }
      console.error('Failed:', err)
    }
  }

  const groupedFoods = foods.reduce((acc, food) => {
    const meal = food.mealType || 'snack'
    if (!acc[meal]) acc[meal] = []
    acc[meal].push(food)
    return acc
  }, {})

  const getMealTotals = (foods) => {
    return foods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat,
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    )
  }

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        {mealOrder
          .filter((mealType) => groupedFoods[mealType]?.length > 0)
          .map((mealType) => {
            const totals = getMealTotals(groupedFoods[mealType])
            const verdict = getMealVerdict(groupedFoods[mealType])
            console.log('Verdict for', mealType, ':', verdict)

            return (
              <div key={mealType} className="mb-8">
                <h2 className="text-xl font-bold mb-2 capitalize">
                  {mealType}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {totals.calories} cal · {totals.protein} proteins ·{' '}
                  {totals.carbs} carbs ·{totals.fat} fats
                </p>
                {verdict && (
                  <p className="text-sm text-green-600 mb-4">{verdict}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {groupedFoods[mealType]?.map((food) => (
                    <div
                      key={food.id}
                      className="rounded-3xl box-shadow p-5 min-h-40 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold line-clamp-2">
                          {food.foodName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {food.calories} cal
                        </p>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          {food.quantity}g
                        </p>
                        <p className="text-xs text-muted-foreground">
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
          <div className="rounded-3xl box-shadow p-5 min-h-40 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition">
            <img src={plusIcon} alt="plus" className="w-full h-full max-w-20" />
            <p>Add food</p>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-2xl">Add Food</DrawerTitle>
            {!selected ? (
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search food "
                  value={search}
                  onValueChange={setSearch}
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
                            <span className="font-medium">
                              {food.description}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              per 100g:{' '}
                              {getNutrient(food, NUTRIENT_IDS.CALORIES)} cal
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{selected.description}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (grams)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="text-lg"
                  />
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">
                    Nutrition ({quantity}g)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-2xl font-bold">
                        {getNutrient(selected, NUTRIENT_IDS.CALORIES, quantity)}
                      </p>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-2xl font-bold">
                        {getNutrient(selected, NUTRIENT_IDS.PROTEIN, quantity)}g
                      </p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-2xl font-bold">
                        {getNutrient(selected, NUTRIENT_IDS.CARBS, quantity)}g
                      </p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-2xl font-bold">
                        {getNutrient(selected, NUTRIENT_IDS.FAT, quantity)}g
                      </p>
                      <p className="text-xs text-muted-foreground">Fat</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelected(null)}
                >
                  Change Food
                </Button>
              </div>
            )}
          </DrawerHeader>
          <DrawerFooter>
            <Button
              onClick={handleSubmit}
              disabled={!selected || !quantity || success}
              className={`w-full transition-all duration-300 ${
                success ? 'bg-green-600 hover:bg-green-600' : ''
              }`}
            >
              {success ? '✓ Food logged!' : 'Add to Log'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default FoodLog
