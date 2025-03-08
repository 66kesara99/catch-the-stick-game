"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import GameStick from "@/components/game-stick"
import { useToast } from "@/hooks/use-toast"

export default function CatchTheStickGame() {
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [sticks, setSticks] = useState<Array<{ id: number; position: number }>>([])
  const [highScore, setHighScore] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const nextStickIdRef = useRef(1)
  const { toast } = useToast()

  // Start the game
  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setSticks([])
    nextStickIdRef.current = 1
  }

  // End the game
  const endGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    setGameActive(false)

    if (score > highScore) {
      setHighScore(score)
      toast({
        title: "New High Score!",
        description: `You set a new record: ${score}`,
      })
    }
  }

  // Handle stick click
  const handleStickClick = (id: number) => {
    if (!gameActive) return

    setSticks((prevSticks) => {
      const updatedSticks = prevSticks.filter((stick) => stick.id !== id)
      return updatedSticks
    })

    setScore((prevScore) => prevScore + 1)

    // Play a sound or show visual feedback
    toast({
      title: "Caught!",
      description: "+1 point",
      duration: 1000,
    })
  }

  // Game loop
  useEffect(() => {
    if (!gameActive) return

    // Move sticks down
    const moveSticks = () => {
      setSticks((prevSticks) => {
        return prevSticks
          .map((stick) => ({
            ...stick,
            position: stick.position + 2,
          }))
          .filter((stick) => {
            // Remove sticks that hit the bottom
            if (stick.position >= 100) {
              toast({
                title: "Missed!",
                description: "A stick hit the ground",
                variant: "destructive",
                duration: 1000,
              })
              return false
            }
            return true
          })
      })
    }

    // Create game loop
    const gameLoop = setInterval(() => {
      moveSticks()
    }, 50)

    // Create sticks at random intervals
    const stickGenerator = setInterval(() => {
      setSticks((prevSticks) => {
        const newStick = { id: nextStickIdRef.current, position: 0 };
        nextStickIdRef.current += 1;
        return [...prevSticks, newStick];
      });
    }, Math.floor(Math.random() * 1500) + 500);

    // Set game duration (30 seconds)
    const gameTimer = setTimeout(() => {
      endGame()
    }, 30000)

    // Cleanup
    return () => {
      clearInterval(gameLoop)
      clearInterval(stickGenerator)
      clearTimeout(gameTimer)
    }
  }, [gameActive, toast])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <h1 className="mb-6 text-4xl font-bold text-blue-800">Catch The Stick</h1>

      <div className="mb-4 flex w-full max-w-md justify-between">
        <Card className="p-4 text-center">
          <h2 className="text-sm font-medium text-gray-500">Score</h2>
          <p className="text-3xl font-bold text-blue-600">{score}</p>
        </Card>

        <Card className="p-4 text-center">
          <h2 className="text-sm font-medium text-gray-500">High Score</h2>
          <p className="text-3xl font-bold text-purple-600">{highScore}</p>
        </Card>
      </div>

      <div
        ref={gameAreaRef}
        className="relative mb-6 h-[500px] w-full max-w-md overflow-hidden rounded-lg border-4 border-blue-300 bg-white shadow-lg"
      >
        {gameActive ? (
          <>
            {sticks.map((stick) => (
              <GameStick key={stick.id} id={stick.id} position={stick.position} onClick={handleStickClick} />
            ))}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="mb-4 text-xl text-gray-600">Click Start to play!</p>
            <p className="mb-6 text-center text-sm text-gray-500">
              Catch the falling vertical sticks before they hit the ground
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!gameActive ? (
          <Button size="lg" onClick={startGame} className="bg-green-500 hover:bg-green-600">
            Start Game
          </Button>
        ) : (
          <Button size="lg" onClick={endGame} variant="destructive">
            End Game
          </Button>
        )}
      </div>

      <div className="mt-8 max-w-md text-center text-sm text-gray-600">
        <h3 className="mb-2 font-semibold">How to Play:</h3>
        <p>
          Click on the falling vertical sticks before they hit the bottom of the game area. Each caught stick is worth 1
          point. The game lasts for 30 seconds.
        </p>
      </div>
    </div>
  )
}

