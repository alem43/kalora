import { createFileRoute } from '@tanstack/react-router'
import FoodLog from '#/components/FoodLog'
import Goal from '#/components/Goal'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Goal />
      <FoodLog />
    </>
  )
}
