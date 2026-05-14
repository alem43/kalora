import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/homePage')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <a href="/register">
        register <br />
      </a>
      <a href="/login">login</a>
    </>
  )
}
