import { createFileRoute } from '@tanstack/react-router'
import FoodLog from '#/components/FoodLog'
import Goal from '#/components/Goal'
import { useNavigate, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Goal />
      <FoodLog />
      <a href="./register">
        register <br />
      </a>
      <a href="./login">login</a>
    </>
  )
}
