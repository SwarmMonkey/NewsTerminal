import type { NewsItem, SourceID, SourceResponse } from "@shared/types"
import sources from "@shared/sources"
import { delay } from "@shared/utils"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useWindowSize } from "react-use"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { OverlayScrollbar } from "../common/overlay-scrollbar"
import { myFetch, safeParseString, translateText } from "~/utils"
import { cacheSources, refetchSources } from "~/utils/data"
import { useFocusWith } from "~/hooks/useFocus"
import { useRefetch } from "~/hooks/useRefetch"
import { useRelativeTime } from "~/hooks/useRelativeTime"

// Define constant for localStorage key prefix
const LOCAL_STORAGE_KEY_PREFIX = "source-"

export interface ItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  id: SourceID
  /**
   * Whether to show opacity, the style of the original card when dragging
   */
  isDragging?: boolean
  setHandleRef?: (ref: HTMLElement | null) => void
}

interface NewsCardProps {
  id: SourceID
  setHandleRef?: (ref: HTMLElement | null) => void
}

export const CardWrapper = forwardRef<HTMLElement, ItemsProps>(({ id, isDragging, setHandleRef, style, ...props }, dndRef) => {
  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, {
    once: true,
  })

  useImperativeHandle(dndRef, () => ref.current! as HTMLDivElement)

  return (
    <div
      ref={ref}
      className={$(
        "flex flex-col h-500px rounded-2xl p-4 cursor-default",
        // "backdrop-blur-5",
        "transition-opacity-300",
        isDragging && "op-50",
        `bg-${sources[id].color}-500 dark:bg-${sources[id].color} bg-op-40!`,
      )}
      style={{
        transformOrigin: "50% 50%",
        ...style,
      }}
      {...props}
    >
      {inView && <NewsCard id={id} setHandleRef={setHandleRef} />}
    </div>
  )
})

// Add a type for the API error
interface ApiError {
  response?: {
    status: number
    data: any
  }
  request?: any
  message?: string
}

// Helper function to get source data from localStorage
function getLocalStorageSource(id: SourceID): SourceResponse | null {
  try {
    const data = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${id}`)
    if (data) {
      return JSON.parse(data) as SourceResponse
    }
  } catch (e) {
    console.error(`Failed to retrieve data from localStorage for ${id}:`, e)
  }
  return null
}

// Helper function to save source data to localStorage
function saveLocalStorageSource(id: SourceID, data: SourceResponse): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${id}`, JSON.stringify(data))
  } catch (e) {
    console.error(`Failed to save data to localStorage for ${id}:`, e)
  }
}

function NewsCard({ id, setHandleRef }: NewsCardProps) {
  const { refresh } = useRefetch()
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["source", id],
    queryFn: async ({ queryKey }) => {
      const id = queryKey[1] as SourceID
      console.log(`Fetching data for source: ${id}`)
      let url = `/s?id=${id}`
      const headers: Record<string, any> = {}

      // Check if we need to force a refresh
      if (refetchSources.has(id)) {
        url = `/s?id=${id}&latest`
        const jwt = safeParseString(localStorage.getItem("jwt"))
        if (jwt) headers.Authorization = `Bearer ${jwt}`
        refetchSources.delete(id)
      } else if (cacheSources.has(id)) { // Check if we have cached data in memory
        console.log(`Using cached data for source: ${id}`)
        await delay(200)
        const cachedData = cacheSources.get(id)
        // Preemptively save to localStorage for fallback
        if (cachedData) saveLocalStorageSource(id, cachedData)
        return cachedData
      } else { // Check localStorage as last resort before API call
        const localData = getLocalStorageSource(id)
        if (localData?.items?.length) {
          console.log(`Using localStorage data for source: ${id}`)
          // If we have local data, save it to the memory cache too
          cacheSources.set(id, localData)
          return localData
        }
      }

      try {
        console.log(`Making API request to: ${url}`)
        const response: SourceResponse = await myFetch(url, {
          headers,
          // Add timeout to prevent long-hanging requests
          timeout: 10000,
          // Add retry for production resilience
          retry: 3,
        })
        console.log(`API response for ${id}:`, response)

        // Process the data
        if (response?.items?.length) {
          // Add diff information for hottest sources
          if (sources[id].type === "hottest" && cacheSources.has(id)) {
            try {
              response.items.forEach((item, i) => {
                const o = cacheSources.get(id)!.items.findIndex(k => k.id === item.id)
                item.extra = {
                  ...item?.extra,
                  diff: o === -1 ? undefined : o - i,
                }
              })
            } catch (e) {
              console.error(`Error calculating diffs for ${id}:`, e)
            }
          }

          // Save to memory cache and localStorage
          cacheSources.set(id, response)
          saveLocalStorageSource(id, response)
          return response
        } else {
          throw new Error("Empty response items")
        }
      } catch (error) {
        console.error(`API error for ${id}:`, error)
        const apiError = error as ApiError
        if (apiError.response) {
          console.error(`Status: ${apiError.response.status}, Data:`, apiError.response.data)
        }
        if (apiError.request) {
          console.error(`No response received, request:`, apiError.request)
        }

        // Fallback chain:
        // 1. Try memory cache first
        if (cacheSources.has(id)) {
          console.log(`Using cached data as fallback for failed API request to ${id}`)
          return cacheSources.get(id)
        }

        // 2. Try localStorage next
        const localData = getLocalStorageSource(id)
        if (localData?.items?.length) {
          console.log(`Using localStorage as fallback for failed API request to ${id}`)
          return localData
        }

        // 3. Last resort - empty response
        return {
          status: "cache",
          id,
          updatedTime: Date.now(),
          items: [],
        }
      }
    },
    placeholderData: prev => prev,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: true, // Try refetching when connection comes back
    refetchOnWindowFocus: false,
    retry: 2, // Allow retries for resilience
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000), // Exponential backoff capped at 30 seconds
  })

  const { isFocused, toggleFocus } = useFocusWith(id)

  // Get translations for source information
  const translatedSourceName = translateText(sources[id].name)
  const translatedSourceTitle = sources[id].title ? translateText(sources[id].title) : ""
  const translatedSourceDesc = sources[id].desc ? translateText(sources[id].desc) : ""

  // Log error details if present
  useEffect(() => {
    if (error) {
      console.error(`Error for source ${id}:`, error)
    }
  }, [error, id])

  return (
    <>
      <div className={$("flex justify-between mx-2 mt-0 mb-2 items-center")}>
        <div className="flex gap-2 items-center">
          <a
            className={$("w-8 h-8 rounded-full bg-cover")}
            target="_blank"
            href={sources[id].home}
            title={translatedSourceDesc || sources[id].desc}
            style={{
              backgroundImage: `url(/icons/${id.split("-")[0]}.png)`,
            }}
          />
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span
                className="text-xl font-bold"
                title={translatedSourceDesc || sources[id].desc}
              >
                {translatedSourceName}
              </span>
              {sources[id]?.title && <span className={$("text-sm", `color-${sources[id].color} bg-base op-80 bg-op-50! px-1 rounded`)}>{translatedSourceTitle}</span>}
            </span>
            <span className="text-xs op-70"><UpdatedTime isError={isError} updatedTime={data?.updatedTime} /></span>
          </span>
        </div>
        <div className={$("flex gap-2 text-lg", `color-${sources[id].color}`)}>
          <button
            type="button"
            className={$("btn i-ph:arrow-counter-clockwise-duotone", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
            onClick={() => refresh(id)}
          />
          <button
            type="button"
            className={$("btn", isFocused ? "i-ph:star-fill" : "i-ph:star-duotone")}
            onClick={toggleFocus}
          />
          {/* firefox cannot drag a button */}
          {setHandleRef && (
            <div
              ref={setHandleRef}
              className={$("btn", "i-ph:dots-six-vertical-duotone", "cursor-grab")}
            />
          )}
        </div>
      </div>

      <OverlayScrollbar
        className={$([
          "h-full p-2 overflow-y-auto rounded-2xl bg-base bg-op-70!",
          isFetching && `animate-pulse`,
          `sprinkle-${sources[id].color}`,
        ])}
        options={{
          overflow: { x: "hidden" },
        }}
        defer
      >
        <div className={$("transition-opacity-500", isFetching && "op-20")}>
          {!!data?.items?.length && (sources[id].type === "hottest" ? <NewsListHot items={data.items} /> : <NewsListTimeLine items={data.items} />)}
        </div>
      </OverlayScrollbar>
    </>
  )
}

function UpdatedTime({ isError, updatedTime }: { updatedTime: any, isError: boolean }) {
  const relativeTime = useRelativeTime(updatedTime ?? "")
  if (relativeTime) return `Updated ${relativeTime}`
  if (isError) return "Failed to load"
  return "Loading..."
}

function DiffNumber({ diff }: { diff: number }) {
  const [shown, setShown] = useState(true)
  useEffect(() => {
    setShown(true)
    const timer = setTimeout(() => {
      setShown(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [setShown, diff])

  return (
    <AnimatePresence>
      { shown && (
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 0.5, y: -7 }}
          exit={{ opacity: 0, y: -15 }}
          className={$("absolute left-0 text-xs", diff < 0 ? "text-green" : "text-red")}
        >
          {diff > 0 ? `+${diff}` : diff}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
function ExtraInfo({ item }: { item: NewsItem }) {
  if (item?.extra?.info) {
    return <>{item.extra.info}</>
  }
  if (item?.extra?.icon) {
    const { url, scale } = typeof item.extra.icon === "string" ? { url: item.extra.icon, scale: undefined } : item.extra.icon
    return (
      <img
        src={url}
        style={{
          transform: `scale(${scale ?? 1})`,
        }}
        className="h-4 inline mt--1"
        onError={e => e.currentTarget.style.display = "none"}
      />
    )
  }
}

function NewsUpdatedTime({ date }: { date: string | number }) {
  const relativeTime = useRelativeTime(date)
  return <>{relativeTime}</>
}
function NewsListHot({ items }: { items: NewsItem[] }) {
  const { width } = useWindowSize()
  const translatedItems = items.map(item => ({
    ...item,
    title: translateText(item.title),
    extra: {
      ...item.extra,
      hover: item.extra?.hover ? translateText(item.extra.hover) : undefined,
      info: item.extra?.info ? translateText(item.extra.info) : item.extra?.info,
    },
  }))

  return (
    <ol className="flex flex-col gap-2">
      {translatedItems?.map((item, i) => (
        <a
          href={width < 768 ? item.mobileUrl || item.url : item.url}
          target="_blank"
          key={item.id}
          title={item.extra?.hover}
          className={$(
            "flex gap-2 items-center items-stretch relative cursor-pointer [&_*]:cursor-pointer transition-all",
            "hover:bg-neutral-400/10 rounded-md pr-1 visited:(text-neutral-400)",
          )}
        >
          <span className={$("bg-neutral-400/10 min-w-6 flex justify-center items-center rounded-md text-sm")}>
            {i + 1}
          </span>
          {!!item.extra?.diff && <DiffNumber diff={item.extra.diff} />}
          <span className="self-start line-height-none">
            <span className="mr-2 text-base">
              {item.title}
            </span>
            <span className="text-xs text-neutral-400/80 truncate align-middle">
              <ExtraInfo item={item} />
            </span>
          </span>
        </a>
      ))}
    </ol>
  )
}

function NewsListTimeLine({ items }: { items: NewsItem[] }) {
  const { width } = useWindowSize()
  const translatedItems = items.map(item => ({
    ...item,
    title: translateText(item.title),
    extra: {
      ...item.extra,
      hover: item.extra?.hover ? translateText(item.extra.hover) : undefined,
      info: item.extra?.info ? translateText(item.extra.info) : item.extra?.info,
    },
  }))

  return (
    <ol className="border-s border-neutral-400/50 flex flex-col ml-1">
      {translatedItems?.map(item => (
        <li key={`${item.id}-${item.pubDate || item?.extra?.date || ""}`} className="flex flex-col">
          <span className="flex items-center gap-1 text-neutral-400/50 ml--1px">
            <span className="">-</span>
            <span className="text-xs text-neutral-400/80">
              {(item.pubDate || item?.extra?.date) && <NewsUpdatedTime date={(item.pubDate || item?.extra?.date)!} />}
            </span>
            <span className="text-xs text-neutral-400/80">
              <ExtraInfo item={item} />
            </span>
          </span>
          <a
            className={$(
              "ml-2 px-1 hover:bg-neutral-400/10 rounded-md visited:(text-neutral-400/80)",
              "cursor-pointer [&_*]:cursor-pointer transition-all",
            )}
            href={width < 768 ? item.mobileUrl || item.url : item.url}
            title={item.extra?.hover}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  )
}
