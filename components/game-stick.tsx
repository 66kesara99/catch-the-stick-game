"use client"

import { useState, useEffect } from "react"

interface GameStickProps {
  id: number
  position: number
  onClick: (id: number) => void
}

export default function GameStick({ id, position, onClick }: GameStickProps) {
  const [horizontalPosition, setHorizontalPosition] = useState(0)
  const [width, setWidth] = useState(0)
  const [color, setColor] = useState("")

  // Initialize stick properties on mount
  useEffect(() => {
    // Random horizontal position (5-85% to keep within bounds)
    const randomPosition = Math.floor(Math.random() * 80) + 5
    setHorizontalPosition(randomPosition)

    // Random height between 60px and 120px for vertical sticks
    const randomHeight = Math.floor(Math.random() * 60) + 60
    setWidth(randomHeight) // We're still using the width state, but it represents height now

    // Random color
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setColor(randomColor)
  }, [])

  const handleClick = () => {
    onClick(id)
  }

  return (
    <div
      className={`absolute cursor-pointer transition-transform ${color} rounded-md shadow-md`}
      style={{
        left: `${horizontalPosition}%`,
        top: `${position}%`,
        width: "12px",
        height: `${width}px`, // Now using the width value for height to make it vertical
        transform: "translateX(-50%)",
      }}
      onClick={handleClick}
    />
  )
}

