import { createFileRoute } from "@tanstack/react-router"
import ApiTest from "~/components/ApiTest"

export const Route = createFileRoute("/api-test")({
  component: ApiTestComponent,
})

function ApiTestComponent() {
  return <ApiTest />
}
