import { fixedColumnIds, metadata } from "@shared/metadata"
import { useAtomValue } from "jotai"
import { clsx as $ } from "clsx"
import { Link } from "@tanstack/react-router"
import { currentColumnIDAtom } from "~/atoms"
import { useSearchBar } from "~/hooks/useSearch"

export function NavBar() {
  const currentId = useAtomValue(currentColumnIDAtom)
  const { toggle } = useSearchBar()

  // Filter out GitHub from hottest column in the navbar display only
  const filteredColumnIds = fixedColumnIds.filter((id) => {
    // If it's not hottest column, keep it
    if (id !== "hottest") return true

    // For hottest column, we'll keep it but later filter GitHub from display
    return true
  })

  return (
    <span
      className={$([
        "flex p-3 rounded-2xl bg-primary/1 text-sm",
        "shadow shadow-primary/20 hover:shadow-primary/50 transition-shadow-500",
        "items-center justify-between",
      ])}
    >
      <div className="flex items-center h-6">
        <button
          type="button"
          onClick={() => toggle(true)}
          className={$(
            "px-2 h-full flex items-center hover:(bg-primary/10 rounded-md) op-70 dark:op-90",
            "cursor-pointer transition-all",
          )}
        >
          More
        </button>
        {filteredColumnIds.map((columnId) => {
          // For the hottest column, create a wrapper component that doesn't display GitHub
          if (columnId === "hottest") {
            return (
              <Link
                key={columnId}
                to="/c/$column"
                params={{ column: columnId }}
                className={$(
                  "px-2 h-full flex items-center hover:(bg-primary/10 rounded-md) cursor-pointer transition-all",
                  currentId === columnId ? "color-primary font-bold" : "op-70 dark:op-90",
                )}
              >
                {metadata[columnId].name}
              </Link>
            )
          }

          // Regular display for other columns
          return (
            <Link
              key={columnId}
              to="/c/$column"
              params={{ column: columnId }}
              className={$(
                "px-2 h-full flex items-center hover:(bg-primary/10 rounded-md) cursor-pointer transition-all",
                currentId === columnId ? "color-primary font-bold" : "op-70 dark:op-90",
              )}
            >
              {metadata[columnId].name}
            </Link>
          )
        })}
      </div>
      <div className="text-xs op-50 hover:op-80 transition-opacity ml-2 h-6 flex items-center">
        <span title="Use your browser's translate feature if needed">
          Need translation? Try browser translate
        </span>
      </div>
    </span>
  )
}
