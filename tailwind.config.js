/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          mono: ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        },
        colors: {
          bg: "#0d0d0d",
          surface: "#121212",
          border: "#222222",
          accent: "#00ff88",
          "accent-hover": "#00cc66",
          text: "#e5e5e5",
          "text-muted": "#a1a1a1",
        },
        boxShadow: {
          glow: "0 0 12px rgba(0,255,136,0.25)",
        },
      },
    },
    plugins: [],
  }
  