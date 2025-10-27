import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="text-center space-y-4 py-20">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-600">Page not found.</p>
      <Link to="/" className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
        Go Home
      </Link>
    </section>
  )
}
