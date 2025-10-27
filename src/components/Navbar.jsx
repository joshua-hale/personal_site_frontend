import { useState } from "react"
import { NavLink } from "react-router-dom"

const linkBase = "px-3 py-2 rounded-md text-sm font-medium transition-colors"
const active = "text-accent"
const inactive = "text-text-muted hover:text-accent"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex justify-between items-center border-b border-border px-6 py-4 bg-surface shadow-md">
      {/* Left side spacer (optional logo spot) */}
      <div className="flex-1" />

      {/* Centered nav links */}
      <div className="flex space-x-6 justify-center">
        <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Home</NavLink>
        <NavLink to="/projects" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Projects</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Contact</NavLink>
      </div>

      {/* Right side login */}
      <div className="flex-1 flex justify-end">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "text-accent" : "text-text-muted hover:text-accent"}`
          }
        >
          Login
        </NavLink>
      </div>
    </nav>
  )
}
