export default function Footer() {
    return (
      <footer className="border-t border-border bg-surface text-text-muted text-sm py-4 flex justify-center items-center">
        <p className="text-center">
          © {new Date().getFullYear()} Joshua Hale
        </p>
      </footer>
    )
  }
  