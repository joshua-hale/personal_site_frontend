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
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-accent">
        {displayed}
        <span className={`inline-block w-[0.6ch] -translate-y-px ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`}>▌</span>
      </h1>
      <p className="text-text-muted mt-4 text-sm sm:text-base">
        Full-stack developer | Software architect | Late night debugger
      </p>
    </section>
  )
}