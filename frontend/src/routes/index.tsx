import { createFileRoute } from '@tanstack/react-router'
import FoodLog from '#/components/FoodLog'
import Goal from '#/components/Goal'
import { useNavigate, Link } from '@tanstack/react-router'
import HomePage from '#/components/HomePage'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <HomePage />
    </>
  )
}
