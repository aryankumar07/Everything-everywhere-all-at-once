import { debounce } from "@/utils/debounce";
import { Search as SearchIcon, ChevronsRight as RightIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react";

interface SearchProps {
  medium?: boolean
  large?: boolean
}

interface SuggestionProps {
  suggestion: string
  highlight: boolean
  onClick: () => void
}


const words = [
  "ephemeral", "cascade", "solitude", "wander", "luminous",
  "drift", "horizon", "whisper", "ember", "serene",
  "twilight", "echo", "vivid", "ripple", "mosaic",
  "aurora", "zenith", "flux", "nimble", "reverie",
  "bloom", "ethereal", "prism", "velvet", "radiant",
  "nebula", "quartz", "obsidian", "saffron", "crimson",
  "labyrinth", "mirage", "tempest", "alchemy", "paradox",
  "catalyst", "resonance", "fragment", "orbit", "synthesis",
  "phantom", "glacier", "voltage", "cipher", "spectrum",
  "vortex", "silhouette", "monolith", "fractal", "oasis",
  "still waters run deep", "chase the horizon",
  "lost in translation", "break of dawn", "silver lining",
  "echoes of silence", "wanderlust calling", "infinite loop",
  "pixel perfect", "code and coffee",
  "beyond the veil", "shattered glass", "frozen in time",
  "light years away", "dancing shadows", "midnight oil",
  "paper trails", "neon dreams", "fading echoes",
  "gravity pulls", "between the lines", "uncharted waters",
  "burning bridges", "quiet storms", "wild at heart",
  "ember", "cobalt", "ivory", "scarlet", "indigo",
  "sapphire", "onyx", "amber", "jade", "coral",
  "serenity now", "digital nomad", "zero gravity",
  "solar flare", "deep focus", "edge of tomorrow",
  "blank canvas", "open source", "last light",
  "first breath", "iron will", "glass ceiling",
  "free fall", "dark matter", "bright side",
  "old soul", "new wave", "raw energy",
  "half moon", "full circle"
];





const Search = ({
  medium,
  large
}: SearchProps) => {

  const [results, setResults] = useState<string[]>([])

  const [index, setIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (index >= 0 && listRef.current) {
      const item = listRef.current.children[index] as HTMLElement
      item?.scrollIntoView({ block: "nearest" })
    }
  }, [index])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length === 0) {
      setResults([])
      return
    }
    const filterWords = words.filter((word) => word.includes(e.target.value))
    setResults(filterWords)
  }
  const deboucedChange = debounce(handleChange, 500)


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const eventType = event.key
    if (eventType === "ArrowDown" || eventType === "ArrowUp") {
      event.preventDefault()
    }
    if (eventType === "ArrowDown") {
      setIndex((prev) => {
        if (prev + 1 < results.length) {
          return prev + 1;
        }

        if (results.length > 0) {
          return 0;
        }
        return -1;
      })
    } else if (eventType === "ArrowUp") {
      setIndex((prev) => {
        if (prev - 1 >= 0) {
          return prev - 1;
        }
        if (results.length > 0) {
          return results.length - 1;
        }
        return -1;
      })
    } else if (eventType === "Enter") {
      if (index !== -1) {
        console.log(results[index])
      }
    }
  }

  return (
    <div
      className={`flex flex-col ${medium ? "w-md" : ""} ${large ? "w-lg" : ""} bg-slate-800 rounded-2xl p-2`}>
      <div className={`flex items-center gap-2 px-3 py-2 min-h-10  border border-slate-700 bg-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-slate-400 focus-within:border-transparent transition`}>
        <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search keywords"
          onKeyDown={handleKeyDown}
          onChange={(e) => deboucedChange(e)}
          className="w-full bg-transparent border-0 outline-none text-slate-100 placeholder:text-slate-500 text-sm"
        />
      </div>
      <div ref={listRef} className={`flex flex-col justify-center items-start max-h-48 overflow-scroll ${results.length > 0 ? "mt-3" : ""}`}>
        {
          results.map((result, curr) => {
            return (
              <Suggestion key={curr} suggestion={result} highlight={index === curr} onClick={() => setIndex(curr)} />
            )
          })
        }
      </div>
    </div>
  )
}

const Suggestion = ({ suggestion, highlight, onClick }: SuggestionProps) => {
  return (
    <div onClick={onClick} className={`flex justify-start items-center gap-8 p-4 cursor-pointer w-full rounded-2xl hover:bg-slate-900 ${highlight ? "bg-slate-900" : ""}`}>
      <RightIcon size={24} />
      <div className="font-semibold text-xl">{suggestion}</div>
    </div>
  )
}


export default Search
