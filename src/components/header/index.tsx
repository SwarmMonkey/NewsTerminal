import { Link } from "@tanstack/react-router"
import { useIsFetching } from "@tanstack/react-query"
import type { SourceID } from "@shared/types"
import { NavBar } from "../navbar"
import { Menu } from "./menu"
import { currentSourcesAtom, goToTopAtom } from "~/atoms"

function GoTop() {
  const { ok, fn: goToTop } = useAtomValue(goToTopAtom)
  return (
    <button
      type="button"
      title="Go To Top"
      className={$("i-ph:arrow-fat-up-duotone", ok ? "op-50 btn" : "op-0")}
      onClick={goToTop}
    />
  )
}

function Refresh() {
  const currentSources = useAtomValue(currentSourcesAtom)
  const { refresh } = useRefetch()
  const refreshAll = useCallback(() => refresh(...currentSources), [refresh, currentSources])

  const isFetching = useIsFetching({
    predicate: (query) => {
      const [type, id] = query.queryKey as ["source" | "entire", SourceID]
      return (type === "source" && currentSources.includes(id)) || type === "entire"
    },
  })

  return (
    <button
      type="button"
      title="Refresh"
      className={$("i-ph:arrow-counter-clockwise-duotone btn", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <span className="flex justify-self-start items-center">
        <Link to="/" className="flex gap-2 items-center">
          <div className="h-20 w-20 bg-contain bg-no-repeat" title="logo" style={{ backgroundImage: "url(/NewsTerminal.png)" }} />
          <div className="flex flex-col justify-center">
            <p className="text-xl font-brand-title tracking-tight uppercase font-bold whitespace-nowrap leading-tight mb-0">News</p>
            <p className="text-xl font-brand-title tracking-tight uppercase font-bold whitespace-nowrap leading-tight mt-0">Terminal</p>
          </div>
        </Link>
      </span>
      <span className="justify-self-center flex items-center h-full">
        <span className="hidden md:(inline-block)">
          <NavBar />
        </span>
      </span>
      <span className="justify-self-end flex gap-2 items-center text-xl text-primary-600 dark:text-primary h-full">
        <GoTop />
        <Refresh />
        <Menu />
      </span>
    </>
  )
}
