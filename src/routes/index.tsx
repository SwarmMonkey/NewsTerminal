import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { focusSourcesAtom } from "~/atoms"
import { About } from "~/components/about"
import { Column } from "~/components/column"
import { CaButton } from "~/components/CaButton"

export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  const focusSources = useAtomValue(focusSourcesAtom)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const id = useMemo(() => focusSources.length ? "focus" : "hottest", [])
  return (
    <>
      <CaButton caCode="ca:BaUru9rp4UhLr3C1Ug4816hoYUwAuxTmJ8ZKPhP37Cdd" />
      <About />
      <Column id={id} />
    </>
  )
}
