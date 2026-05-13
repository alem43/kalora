import FoodLog from '#/components/FoodLog'
import Navbar from '#/components/Navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar />
      <FoodLog />
    </>
  )
}
