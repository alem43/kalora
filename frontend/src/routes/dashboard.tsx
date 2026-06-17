import FoodLog from '#/components/FoodLog'
import Goal from '#/components/Goal'
import Navbar from '#/components/Navbar'
import ShouldIEatThis from '#/components/ShouldIEatThis'
import { createFileRoute } from '@tanstack/react-router'
import { BrowserRouter } from 'react-router-dom'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
      <Goal />
      <FoodLog />
      <ShouldIEatThis />
    </>
  )
}
