"use client"
import { getRandomNo } from "@/utils/getRandomid"
import { useSocket } from "@/utils/socketContext"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const CELL_COUNT = 12

const Page = () => {
  const { id, name } = useParams<{ id: string, name: string }>()
  const router = useRouter()
  const { joinGame, sendCellClick, subscribeToCellClicks, stopGame, gameStoped } = useSocket()


  const [myColor] = useState(() => [getRandomNo(), getRandomNo(), getRandomNo()])
  const [cells, setCells] = useState<(number[] | null)[]>(
    Array.from({ length: CELL_COUNT }, () => null)
  )
  const allFilled = useCallback(() => {
    const [r, g, b] = myColor
    return cells.every((cell) => cell !== null && cell[0] === r && cell[1] === g && cell[2] === b)
  }, [cells, myColor])

  const hasWon = allFilled()
  const isPaused = hasWon || gameStoped.stoped

  const hasSentStopRef = useRef(false)
  useEffect(() => {
    if (hasWon && !hasSentStopRef.current) {
      hasSentStopRef.current = true
      stopGame(id, name)
    }
  }, [hasWon, id, name, stopGame])

  useEffect(() => {
    joinGame(id, name).catch(() => { })
  }, [id, name, joinGame])

  useEffect(() => {
    return subscribeToCellClicks((msg) => {
      setCells((prev) => {
        const next = [...prev]
        next[msg.index] = msg.color
        return next
      })
    })
  }, [subscribeToCellClicks])

  const handleClick = (index: number) => {
    if (isPaused) return
    const color = myColor
    setCells((prev) => {
      const next = [...prev]
      next[index] = color
      return next
    })
    sendCellClick(id, index, color)
  }

  useEffect(() => {
    if (gameStoped.stoped) {
      alert(`Player ${gameStoped.name} won the game`)
      router.replace('/')
    }
  }, [gameStoped.stoped, gameStoped.name, router])


  return (
    <div className="flex flex-col flex-1 justify-start items-center">
      <div className="font-bold text-foreground text-2xl m-7">
        {id}
      </div>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ${isPaused ? "opacity-50 pointer-events-none" : ""}`}>
        {
          cells.map((color, index) => {
            return (
              <div
                onClick={() => handleClick(index)}
                key={index}
                id={`cell-${index}`}
                style={color ? { backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` } : undefined}
                className="w-20 h-20 lg:w-32 lg:h-32 dark:bg-white rounded-md ring-1 dark:ring-black/10 bg-zinc-800 ring-white/10"
              ></div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Page
