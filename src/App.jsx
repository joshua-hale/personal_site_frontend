// Use your existing components here. If your Navbar/Footer filenames differ, adjust paths.
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Pages you already had before auth
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'   // or Posts.jsx if that's what you used
import Login from './pages/Login.jsx'         // keep your layout-only login page if you had one
import Contact from './pages/Contact.jsx'     // if you had a contact page already

import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
