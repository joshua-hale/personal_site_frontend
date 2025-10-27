import { useEffect, useRef, useState } from "react"

export default function Hero() {
  const TEXT = "Joshua Hale — Software Engineer"
  const [displayed, setDisplayed] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  const startedRef = useRef(false)
  const indexRef = useRef(0)
  const typingTimeoutRef = useRef(null)
  const cursorIntervalRef = useRef(null)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    // ensure fresh start on each mount
    indexRef.current = 0
    setDisplayed("")

    const typeNext = () => {
      const i = indexRef.current
      if (i < TEXT.length) {
        setDisplayed(prev => prev + TEXT.charAt(i))
        indexRef.current = i + 1
        typingTimeoutRef.current = setTimeout(typeNext, 90)
      }
    }

    typeNext()

    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current)
      // 🔑 allow the next mount (Strict Mode or refresh) to start again
      startedRef.current = false
      indexRef.current = 0
    }
  }, [])

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center bg-bg text-text">
      <h1 className="text-3xl sm:text-5xl font-bold text-accent drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">
        {displayed}
        <span className={`ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`}>_</span>
      </h1>
      <p className="text-text-muted mt-4 text-sm sm:text-base">
        Crafting clean code and powerful APIs.
      </p>
    </section>
  )
}
