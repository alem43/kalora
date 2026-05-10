import { createFileRoute } from '@tanstack/react-router'
import FoodLog from '#/components/FoodLog'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <FoodLog />
    </>
  )
}
