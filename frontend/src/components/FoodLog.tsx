import React from 'react'
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

const API_KEY = 'd8tkLb5J4HS11xXhao5G8JHXfyRa2tJEKexqpaGZ'

const FoodLog = ({ onFoodAdded }) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState([])
  const [selected, setSelected] = React.useState(null)
  const [quantity, setQuantity] = React.useState(100)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

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
      const res = await fetch('http://localhost:8787/food', {
        // Was localhost:3000
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          foodName: selected.description,
          quantity: quantity,
          calories: getNutrient(selected, 1008, quantity),
          protein: getNutrient(selected, 1003, quantity),
          carbs: getNutrient(selected, 1005, quantity),
          fat: getNutrient(selected, 1004, quantity),
          date: new Date().toISOString().split('T')[0],
        }),
      })

      if (res.ok) {
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
      }
    } catch (err) {
      console.error('Failed:', err)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className="w-50 h-50 box-shadow flex flex-col justify-center items-center-safe rounded-b-4xl">
          <img src={plusIcon} alt="plus" className="w-full h-full max-w-36" />
          <p>Add food</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl">Add Food</DrawerTitle>
          {!selected ? (
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search food (e.g., banana)"
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
                            per 100g: {getNutrient(food, 1008)} cal
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
                <h3 className="font-semibold mb-3">Nutrition ({quantity}g)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-2xl font-bold">
                      {getNutrient(selected, 1008, quantity)}
                    </p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-2xl font-bold">
                      {getNutrient(selected, 1003, quantity)}g
                    </p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-2xl font-bold">
                      {getNutrient(selected, 1005, quantity)}g
                    </p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-2xl font-bold">
                      {getNutrient(selected, 1004, quantity)}g
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
  )
}

export default FoodLog
